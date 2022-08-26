/** @format */

const fs = require('fs');
const csv = './sample.csv';
const allFileContents = fs.readFileSync(csv, 'utf-8');

// Implementation of the CSV parser:
const Data = [];
const lines = allFileContents.split(/\r?\n/);
let employees_attendance_records = {};
let done_with_record = false;
let current_user;

lines.forEach((line) => {
  let current_data = line;

  if (!done_with_record) {
    if (current_data.startsWith('"')) {
      const user_id = current_data.slice(current_data.lastIndexOf('ID'), -1);
      current_user = user_id;
      employees_attendance_records[current_user] = [];
    } else if (
      current_data.startsWith('SN') ||
      current_data.startsWith('Total')
    ) {
      return;
    } else if (current_data.match(/[1-9]/)) {
      let [SN, Date, Clockin, Clockout, Total] = current_data.split(',');
      const user_data = {
        hoursWorked: parseInt(Total.split(':')[0]),
        minutesWorked: parseInt(Total.split(':')[1]),
        clockInTime: Clockin.replace(/"/g, ''),
        clockOutTime: Clockout.replace(/"/g, ''),
      };
      employees_attendance_records[current_user].push(user_data);
      Data.push(employees_attendance_records);
    } else if (current_data.startsWith(',')) {
      done_with_record = true;
    }
  } else if (done_with_record) {
    if (current_data.startsWith('"')) {
      let id = current_data.slice(current_data.lastIndexOf('ID'), -1);
      current_user = id;
      employees_attendance_records[current_user] = [];
    }
    done_with_record = false;
  }
});

fs.writeFile('Output.json', JSON.stringify(Data[0], null, 4), (err) => {
  if (err) {
    throw err;
  }
});
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

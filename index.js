const mysql = require('mysql2');
const fs = require('fs')
const inquirer = require('inquirer');
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;
// allows for use of environmental variables (.env)
require('dotenv').config();
const db = mysql.createConnection(
    {
      host: 'localhost',
      // user instructions:  copy ".env.EXAMPLE", rename copied file as ".env", enter in your personal details in variable fields
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
  );
const choices = ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"];

// welcome message for non-tech clients
console.info("\x1b[4m%s\x1b[0m", "\n\nWelcome to Employee Tracker!\n\n");

const mainMenu = () => {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "menu",
      choices: choices,
      loop: true,
    },
  ])
  .then(response => {
    switch (`${response.menu}`) {
      case "View All Employees":
        viewEmployees();
        break;
      case "Add Employee":
        console.log("Add Employee");
        break;
      case "Update Employee Role":
        console.log("Update Employee Role");
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "View All Departments":
        viewDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Quit":
        console.info("\x1b[4m%s\x1b[0m", "\nThank you for choosing Employee Tracker!");
        closeApp();
        break;
    }
  })
}

// use prepared statements to protect against SQL injection

//FIXME: show manager name instead of ID
const viewEmployees = () => {
  // SQL to be queried
  const employeesFormatted = 'SELECT a.id, a.first_name, a.last_name, role.title, department.name, role.salary, a.manager_id FROM employee a JOIN role ON a.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY id ASC;'
  // async query that performs SQL query, catches error, then returns to the main menu
  db.promise().query(employeesFormatted)
  .then(([rows,fields]) => {
    // adds white space for readability
    console.info("\n");
    console.table(rows);
  })
  .then(() => mainMenu());
}

const addEmployee = () => {}

const updateEmployeeRole = () => {}

const viewRoles = () => {
  // SQL to be queried
  const rolesFormatted = "SELECT role.id, role.title, department.name, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY id ASC;"
  // async query that performs SQL query, catches error, then returns to the main menu
  db.promise().query(rolesFormatted)
  .then(([rows,fields]) => {
    // adds white space for readability
    console.info("\n");
    console.table(rows);
  })
  .then(() => mainMenu());
}

// FIXME: I have no idea how to use choices as a function and the documentation is not useful.  Searched google for half a day.  I'm stumped.
const addRole = () => {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the role?",
      name: "role",
      // input must be less than 30 due to MySQL db specifying varchar(30)
      validate: async (input) => {
        if (input.length >= 30) return "Please limit names to 30 characters."
        return true;
      }
    },
    {
      type: "input",
      message: "What is the salary of the role?",
      name: "salary",
    },
    {
      type: "list",
      message: "Which department does the role belong to?",
      name: "department",
      // FIXME: choices needs a returned promise containing department table names (see viewDepartment())
      choices(arr) {
        return new Promise((resolve, reject) => {
          const departmentArr = getDepartments();
          if (departmentArr) resolve(arr = departmentArr);
          reject("Something went wrong");
        })
        .then(function(value) {arr = value}, function(err) {err})
      }
    }
  ]).then(response => {
    console.log(response.role, response.salary, response.department)
  })
}

const viewDepartments = () => {
  // SQL to be queried
  const depFormatted = "SELECT * FROM department ORDER BY id ASC;";
  // async query that performs SQL query, catches error, then returns to the main menu
  db.promise().query(depFormatted)
    .then(([rows,fields]) => {
      // adds white space for readability
      console.info("\n");
      console.table(rows);
    })
    .then(() => mainMenu());
}

// specifically for addRole() inquirer prompt
const getDepartments = () => {
  // SQL to be queried
  const depFormatted = "SELECT * FROM department ORDER BY id ASC;";
  // async query that performs SQL query and returns department names
  db.promise().query(depFormatted)
    .then(([rows,fields]) => {
      return rows.map(({name}) => name);
  });
}

const addDepartment = () => {
  // prompt user for input, add user input to db, return to main menu
  inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the department?",
      name: "department",
      // input must be less than 30 due to MySQL db specifying varchar(30)
      validate: async (input) => {
        if (input.length >= 30) return "Please limit names to 30 characters."
        return true;
      }
    }
  ]).then(response => {
    console.info(response.department)
    // prepared statement to protect against SQL injection
    db.promise().query(`INSERT into department (name) VALUES (?)`, [response.department])
      .catch(console.info("Adding department failed!"))
      .then(console.info("Department added succcessfully!"));
  }).then(() => mainMenu());
}

// cleanly exits node application
const closeApp = () => {
  process.exit();
}

mainMenu();
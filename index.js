const mysql = require('mysql2');
const express = require('express');
const fs = require('fs')
const inquirer = require('inquirer');
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;
const app = express();
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

const menu = () => {
  inquirer
    .prompt([
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
          console.log("View All Employees");
          break;
        case "Add Employee":
          console.log("Add Employee");
          break;
        case "Update Employee Role":
          console.log("Update Employee Role");
          break;
        case "View All Roles":
          console.log("View All Roles");
          break;
        case "Add Role":
          console.log("Add Role");
          break;
        case "View All Departments":
          console.log("View All Departments");
          break;
        case "Add Department":
          console.log("Add Department");
          break;
        case "Quit":
          console.log("Quit");
          break;
      }
    })
}
menu();
// use prepared statements to protect against SQL injection
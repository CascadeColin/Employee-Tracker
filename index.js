const mysql = require('mysql2');
const fs = require('fs')
const inquirer = require('inquirer');
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;
const app = express();
// stores mysql db credentials in .env
require('dotenv').config();

const db = mysql.createConnection(
    {
      host: 'localhost',
      // used .env to hide login details and db name for walkthrough video | .env.EXAMPLE in repo
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the ${process.env.DB} database.`)
  );


// use prepared statements to protect against SQL injection
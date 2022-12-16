const mysql = require('mysql2');
const express = require('express');
const fs = require('fs')
const inquirer = require('inquirer');
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;
const app = express();
// stores mysql db credentials in .env
require('dotenv').config();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// const db = mysql.createConnection(
//     {
//       host: 'localhost',
//       user: process.env.USER,
//       password: process.env.PASS,
//       database: process.env.DB
//     },
//     console.log(`Connected to the ${process.env.DB} database.`)
//   );
const mysql = require('mysql');
const db = require('./config/database');

var pool  = mysql.createPool(db);

module.exports = pool;

const mysql = require('mysql');
const db = require('./config/database');

var con = mysql.createConnection(db);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;

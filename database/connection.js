const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'endterm_nodejs'
  });
  
  db.connect((err) => {
    if (err) {
      console.error('MySQL connection error:', err);
    } else {
      console.log('Connected to MySQL');
    }
  });

  module.exports = db;
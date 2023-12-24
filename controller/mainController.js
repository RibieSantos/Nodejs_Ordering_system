const con = require('../database/connection');
exports.getIndex = (req,res)=>{
    res.render("index");
}
function registerUser(username, password, callback) {
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  con.query(sql, [username, password], (err, result) => {
    callback(err, result);
  });
}

function loginUser(username, password, callback) {
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  con.query(sql, [username, password], (err, result) => {
    callback(err, result);
  });
}

module.exports = {
  registerUser,
  loginUser,
};




const express = require("express");
const app = express();
const mysql = require("mysql");
const port = 3000;

app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/',require('./routes/mainRoute'));
app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    userController.registerUser(username, password, (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.send('Error registering user');
      } else {
        console.log('User registered successfully');
        res.redirect('/');
      }
    });
  });
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    userController.loginUser(username, password, (err, result) => {
      if (err) {
        console.error('Error logging in:', err);
        res.send('Error logging in');
      } else {
        if (result.length > 0) {
          console.log('Login successful');
          res.send('Login successful');
        } else {
          console.log('Invalid username or password');
          res.send('Invalid username or password');
        }
      }
    });
  });
app.listen(port,()=>{
    console.log("Running port");
});
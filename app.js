const express = require("express");
const flash = require("express-flash");
const session = require("express-session");
const app = express();
const mysql = require("mysql");
const port = 3000;

app.use(session({
  secret: 'AaBbCc',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/',require('./routes/mainRoute'));

app.listen(port,()=>{
    console.log("Running port");
});
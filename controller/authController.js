const bcrypt = require("bcrypt");
const saltRounds = 10;
const conn = require("../database/connection");
const flash = require("express-flash");

exports.showLogin = (req,res)=>{
    res.render('login',{message:req.flash('message')});
}

exports.showRegister = (req,res)=>{
    res.render('register',{message:req.flash('message')});
}

exports.login = (req,res)=>{
    const {email, password} = req.body;
    sql = "SELECT * FROM users WHERE email = ?";
    conn.query(sql,[email],(err,results)=>{
        if (err) throw err;

        if (results.length>0) {
            const user =  results[0];

            bcrypt.compare(password,user.password,(bcryptErr,bcryptResults)=>{
                if(bcryptErr) throw bcryptErr;
                
                if (bcryptResults) {
                    req.session.user = user;

                    if (user.user_type === "admin") {
                        res.redirect("/admin/dashboard");
                    }else{
                        res.redirect("/home");
                    }
                    
                }else {
                    req.flash('message', 'Incorrect password');
                    res.redirect('/showLogin');
                  }
          
            });
        }else {
            req.flash('message', 'User not found');
            res.redirect('/showLogin');
          }
    });
}

exports.register = (req,res) => {
    const {fullname,gender,birthdate,email,contact,address,password,user_type} = req.body; 
    sql = "INSERT INTO users(fullname,gender,birthdate,contact,address,email,password,user_type) VALUES(?,?,?,?,?,?,?,?)";

    bcrypt.hash(password,saltRounds,(err,hash)=>{
        if (err) throw err;

        conn.query(sql,[fullname,gender,birthdate,contact,address,email,hash,"customer"],(err,results)=>{
            if(err) throw err;
    
            req.flash('message', 'Registration successful. Please log in.');
          res.redirect('/showLogin');
        });
    });
    
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/');
    });
  };
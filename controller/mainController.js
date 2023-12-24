const con = require('../database/connection');
exports.getIndex = (req,res)=>{
    res.render("index");
}

exports.getHome = (req,res)=>{
    res.render("customer/dashboard");
}
exports.getDash = (req,res)=>{
    res.render("admin/dashboard");
}

exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      // User is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, redirect to login page
      req.flash('message', 'Please log in to access the dashboard.');
      res.redirect('/showLogin');
    }
  };




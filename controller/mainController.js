const con = require('../database/connection');
const multer = require("multer");
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
      next();
    } else {
      req.flash('message', 'Please log in to access the dashboard.');
      res.redirect('/showLogin');
    }
  };

// Menu Controller
exports.getMenu = (req,res)=>{
  const sql ="SELECT menu.menu_id,menu.menu_title, menu.menu_desc, menu.menu_price, menu.menu_status, menu.menu_image, category.cat_title FROM menu JOIN category ON menu.cat_id = category.cat_id";;
  con.query(sql,[],(err,results)=>{

    res.render('admin/menu/menu',{menu:results}); 

  });
}
exports.getAddMenu = (req,res)=>{
  const sql = "SELECT * FROM menu";
  con.query(sql,[],(err,results)=>{
    if (err) {
      console.error('Error querying menu table:', err);
      return res.status(500).send('Internal Server Error');
    }
    const sql = "SELECT * FROM category";
    con.query(sql,[],(catErr,catResults)=>{
      if (catErr) {
        console.error('Error querying category table:', catErr);
        return res.status(500).send('Internal Server Error');
      }
    res.render('admin/menu/addMenu',{menu:results,cat:catResults}); 
  });

  });
}

exports.addMenu = (req, res) => {
  const { menu_title, menu_desc, menu_price, menu_cat, menu_status } = req.body;

  const menu_image = req.file ? req.file.filename : null;
  const sql ='INSERT INTO menu (menu_image,menu_title, menu_desc, menu_price, cat_id, menu_status) VALUES (?, ?, ?, ?, ?, ?)';
  con.query(
    sql,
    [menu_image,menu_title, menu_desc, menu_price, menu_cat, menu_status],
    (err) => {
      if (err) {
        console.error('Error adding menu to the database:', err);
        return res.status(500).send('Internal Server Error');
      }
      req.flash('messages', 'Please log in to access the dashboard.')
      res.redirect('/admin/menu');
    }
  );
};

exports.getEditMenu = (req,res)=>{
  const id = req.params.id;
  const sql = "SELECT * FROM menu JOIN category ON menu.cat_id = category.cat_id WHERE menu_id = ?";
  const catsql = 'SELECT * FROM category';
  con.query(sql,[id],(err,results)=>{
    if (err) {
      console.error('Error querying menu from database:', err);
      return res.status(500).send('Internal Server Error');
    }
    con.query(catsql, (err, categories) => {
      if (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.render('admin/menu/editMenu', { menu: results[0], categories });
    });
  
  }); 
}

exports.updateMenu = (req, res) => {
  const id = req.params.id;
  const {menu_title,menu_desc,menu_price,menu_cat,menu_status} = req.body;
  const sql = "UPDATE menu SET cat_id=?,menu_image=?,menu_title=?,menu_desc=?,menu_price=?,menu_status=? WHERE menu_id = ?";
  // const id = req.params.id; // Assuming your route is '/update-menu/:id'
  // const { menu_title, menu_desc, menu_price, menu_cat, menu_status } = req.body;

  // // Handle file upload (assuming you are using multer for handling file uploads)
  const menu_image = req.file ? req.file.filename : null;

  con.query(sql,[menu_cat,menu_image,menu_title,menu_desc,menu_price,menu_status,id],(err,results)=>{
    console.log(results);
    console.log(results[0]);
      req.flash('messages','Menu item successfully updated');
      res.redirect('/admin/menu');
  });
  
};



exports.deleteMenu = (req,res)=>{
  const id = req.params.id;
  const sql = "DELETE FROM menu WHERE menu_id = ?";
  con.query(sql,[id],(err,results)=>{
    if(err) throw err;

    req.flash('success','Menu item successfully deleted.');
    res.redirect('/admin/menu');
  });
}






//Category Controller
exports.getCategory = (req,res)=>{
  const sql = "SELECT * FROM category";
  con.query(sql,[],(err,results)=>{

    res.render('admin/category/category',{category:results}); 

  });
}

exports.getAddCategory = (req,res)=>{
  const sql = "SELECT * FROM category";
  con.query(sql,[],(err,results)=>{

    res.render('admin/category/addCategory',{category:results}); 

  });
}
exports.deleteMenu = (req,res)=>{
  const id = req.params.id;
  const sql = "DELETE FROM category WHERE cat_id = ?";
  con.query(sql,[id],(err,results)=>{
    if(err) throw err;

    req.flash('success','Menu item successfully deleted.');
    res.redirect('/admin/category');
  });
}




exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect('/');
  });
};
const con = require('../database/connection');
exports.getIndex = (req,res)=>{
    res.render("index");
}
//Customer Dashboard
exports.getHome = (req, res) => {
  const sql = "SELECT menu.menu_id, menu.menu_title, menu.menu_desc, menu.menu_price, menu.menu_status, menu.menu_image, category.cat_title FROM menu JOIN category ON menu.cat_id = category.cat_id";
  con.query(sql, [], (err, results) => {
    if (err) {
      console.error('Error querying menu table:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render("customer/dashboard", { menu: results });
  });
};

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

//Admin Side
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
      // Handle error
      console.error('Error querying menu table:', err);
      return res.status(500).send('Internal Server Error');
    }
    const sql = "SELECT * FROM category";
    con.query(sql,[],(catErr,catResults)=>{
      if (catErr) {
        // Handle error
        console.error('Error querying category table:', catErr);
        return res.status(500).send('Internal Server Error');
      }
    res.render('admin/menu/addMenu',{menu:results,cat:catResults}); 
  });

  });
}
//Add Menu
exports.addMenu = (req, res) => {
  const { menu_title, menu_desc, menu_price, menu_cat, menu_status } = req.body;
  const menu_image = req.file ? req.file.filename : null;
  // Assuming you have a 'menu' table with columns: id, title, description, price, category, status
  const sql ='INSERT INTO menu (menu_image,menu_title, menu_desc, menu_price, cat_id, menu_status) VALUES (?, ?, ?, ?, ?, ?)';
  con.query(
    sql,
    [menu_image,menu_title, menu_desc, menu_price, menu_cat, menu_status],
    (err) => {
      if (err) {
        console.error('Error adding menu to the database:', err);
        return res.status(500).send('Internal Server Error');
      }
      req.flash('message', 'Please log in to access the dashboard.')
      // Redirect to the dashboard or show a success message
      res.redirect('/admin/menu');
    }
  );
};
//Delete Menu
exports.deleteMenu = (req,res)=>{
  const id = req.params.id;
  const sql = "DELETE FROM menu WHERE menu_id = ?";
  con.query(sql,[id],(err,results)=>{
    if(err) throw err;
    req.flash('messages','Menu item successfully deleted.');
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

//Customer Side
//Cart Update the getCart function to fetch cart items from the database
exports.getCart = (req, res) => {
  const userId = req.session.user.user_id;
  const sql = 'SELECT cart.menu_id, menu.menu_image, menu.menu_title, menu.menu_price, cart.quantity, cart.total_price FROM cart JOIN menu ON cart.menu_id = menu.menu_id WHERE cart.user_id = ?';
  con.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error querying cart items:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('customer/cart/cart', { cart: results });
  });
};
exports.getOrders = (req,res)=>{
  res.render('customer/orders/orders'); 
}
exports.getOrderHistory = (req,res)=>{
  res.render('customer/order_history/order_history'); 
}
exports.getMenuForCustomer = (req, res) => {
  const sql = "SELECT menu_id, menu_title, menu_desc, menu_price, menu_image FROM menu";
  con.query(sql, [], (err, results) => {
    if (err) {
      console.error('Error querying menu table:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('customer/dashboard', { menu: results });
  });
};
// Add the following function to handle adding items to the cart
exports.addToCart = (req, res) => {
  const { menu_id, menu_image, menu_title, menu_price, quantity } = req.body;
  const total_price = menu_price * quantity;
  const sql = 'INSERT INTO cart (menu_id, user_id, quantity, total_price) VALUES (?, ?, ?, ?)';
  con.query(sql, [menu_id, req.session.user.user_id, quantity, total_price], (err) => {
    if (err) {
      console.error('Error adding item to cart:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/customer/cart');
  });
};


//logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect('/');
  });
};
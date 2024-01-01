const con = require('../database/connection');
const multer = require("multer");
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

// Corrected Node.js code
exports.getDash = (req, res) => {
  const menuQuery = "SELECT COUNT(*) AS menu_count FROM menu";
  const ordersQuery = "SELECT COUNT(*) FROM orders";
  const customerQuery = "SELECT * FROM users WHERE user_type = ?";
  const customerCountQuery = "SELECT COUNT(*) AS customer_count FROM users WHERE user_type = ?";
  const totalSalesQuery = "SELECT SUM(total_amount) AS total_sales FROM orderdetails";

  con.query(menuQuery, [], (err, menuResults) => {
    con.query(ordersQuery, [], (orderErr, orderResults) => {
      con.query(customerQuery, ['customer'], (cusErr, cusResults) => {
        con.query(customerCountQuery, ['customer'], (countErr, countResults) => {
          con.query(totalSalesQuery, [], (totalErr, totalResults) => {
            res.render("admin/dashboard", {
              menus: menuResults,
              orders: orderResults,
              customers: cusResults,
              cusCount: countResults,
              totals: totalResults
            });
          });
        });
      });
    });
  });
};


exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
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
//Add Menu
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




//Delete Menu

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

exports.addCategory = (req,res)=>{
  const {cat_title,cat_desc} = req.body;
  const sql = "INSERT INTO category(cat_title,cat_desc) VALUES (?,?)";
  con.query(sql,[cat_title,cat_desc],(err,results)=>{
    res.redirect('/admin/category');
  });
}

exports.deleteCategory = (req,res)=>{
  const id = req.params.id;
  const sql = "DELETE FROM category WHERE cat_id = ?";
  con.query(sql,[id],(err,results)=>{
    if(err) throw err;

    req.flash('success','Menu item successfully deleted.');
    res.redirect('/admin/category');
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
const con = require('../database/connection');
const multer = require("multer");
exports.getIndex = (req,res)=>{
  const menuQuery = "SELECT * FROM menu";
  const catQuery = "SELECT * FROM category";
  con.query(menuQuery,[],(menuErr,menuRes)=>{
    con.query(catQuery,[],(catErr,catRes)=>{
      res.render("index",{menu:menuRes,cat:catRes});

    })
  })
}

//Admin Side
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
//Select id to edit menu
exports.getEditMenu = (req, res) => {
  const menuId = req.params.id;
  const sql = 'SELECT * FROM menu WHERE menu_id = ?';
  con.query(sql, [menuId], (err, result) => {
    if (err) {
      console.error('Error querying menu:', err);
      return res.status(500).send('Internal Server Error');
    }
    const sqlCategories = 'SELECT * FROM category';
    con.query(sqlCategories, (catErr, catResults) => {
      if (catErr) {
        console.error('Error querying categories:', catErr);
        return res.status(500).send('Internal Server Error');
      }
      res.render('admin/menu/editMenu', { menu: result[0], categories: catResults });
    });
  });
};
// Update Menu
exports.updateMenu = (req, res) => {
  const menuId = req.params.id;
  const { menu_title, menu_desc, menu_price, menu_cat, menu_status } = req.body;
  const menu_image = req.file ? req.file.filename : null;
  const updateQuery = 'UPDATE menu SET menu_image = ?, menu_title = ?, menu_desc = ?, menu_price = ?, cat_id = ?, menu_status = ? WHERE menu_id = ?';
  
  con.query(
    updateQuery,
    [menu_image, menu_title, menu_desc, menu_price, menu_cat, menu_status, menuId],
    (err) => {
      if (err) {
        console.error('Error updating menu:', err);
        return res.status(500).send('Internal Server Error');
      }
      req.flash('messages', 'Menu updated successfully.');
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

// Add Category
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
// Delete Category
exports.deleteCategory = (req,res)=>{
  const id = req.params.id;
  const sql = "DELETE FROM category WHERE cat_id = ?";
  con.query(sql,[id],(err,results)=>{
    if(err) throw err;

    req.flash('success','Menu item successfully deleted.');
    res.redirect('/admin/category');
  });
}

// Edit Category
exports.editCategory = (req,res)=>{
  const cat_id = req.params.id;
  const sql = 'SELECT * FROM category WHERE cat_id = ?';
  con.query(sql,[cat_id],(err,results)=>{
    if(err) throw err;
    res.render('admin/category/editCategory',{cat:results});
  })
};

exports.updateCategory = (req,res)=>{
  const id = req.params.id;
  const {cat_title,cat_desc} = req.body;
  const sql = 'UPDATE category SET cat_title = ?, cat_desc = ? WHERE cat_id = ?';

  con.query(sql,[cat_title,cat_desc,id],(err,results)=>{
    req.flash('messages','Category item successfully updated.');
    res.redirect('/admin/category');
  })
}

// admin - Customer table
exports.getCustomerTable = (req,res)=>{
  const sql = "SELECT * FROM users WHERE user_type = ?";
  con.query(sql,['customer'],(err,results)=>{
    res.render('admin/customers/customers',{customers:results})

  });
}


// Orders
exports.getAdminOrders = (req, res) => {
  const sql =
    "SELECT u.fullname, u.address, u.contact, m.menu_title, m.menu_price,o.ord_id, o.quantity, o.total_amount, o.order_status FROM menu AS m JOIN orders AS o ON m.menu_id = o.menu_id JOIN users AS u ON u.id = o.user_id";
  con.query(sql, [], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("admin/orders/order", { orders: results });
    }
  });
};
exports.statusUpdate = (req, res) => {
  const order_status = req.body.order_status;
  const id = req.params.id;
  const sql = "UPDATE orders SET order_status = ? WHERE ord_id = ?";
  con.query(sql, [order_status, id], (err, results) => {
    if (err) {
      // Handle error appropriately
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      req.flash('messages','Orders status are successfully updated');
      res.redirect('/admin/order');
    }
  });
};













//Customer Side
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
//Cart Update the getCart function to fetch cart items from the database
exports.getCart = (req, res) => {
  const id = req.session.user.id; // Assuming you have user session data

  const sql = 'SELECT cart_id, menu_image, menu_title, menu_price, quantity, total_price FROM cart WHERE id = ?';

  con.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error querying cart items:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.render('customer/cart/cart', { cart: results });
  });
};


exports.getOrders = (req, res) => {
  const userId = req.session.user.user_id;
  const sql = `
    SELECT orders.ord_id, orders.user_id, orders.menu_id, orders.quantity, orders.total_amount, orders.ord_date, menu.menu_title, menu.menu_image 
    FROM orders 
    JOIN menu ON orders.menu_id = menu.menu_id 
    WHERE orders.user_id = ?`;

  con.query(sql, [userId], (err, orders) => {
    if (err) {
      console.error('Error querying orders:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.render('customer/orders/orders', { orders });
  });
};

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
  const { menu_image, menu_title, menu_price, quantity } = req.body;
  const id = req.session.user.id;
  const parsedQuantity = parseInt(quantity); // Convert quantity to a number
  const parsedPrice = parseFloat(menu_price); // Convert price to a float
  if (isNaN(parsedQuantity) || parsedQuantity <= 0 || isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ message: 'Invalid quantity or price value' });
  }
  const total_price = parsedPrice * parsedQuantity;
  // Retrieve menu_id from the 'menu' table based on menu_title (for example)
  const selectQuery = 'SELECT menu_id FROM menu WHERE menu_title = ? LIMIT 1';
  con.query(selectQuery, [menu_title], (selectErr, selectResult) => {
    if (selectErr) {
      console.error('Error fetching menu_id:', selectErr);
      return res.status(500).json({ message: 'Error adding item to cart' });
    }
    if (selectResult.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    const menuId = selectResult[0].menu_id;
    const insertQuery = 'INSERT INTO cart (menu_image, menu_title, menu_price, menu_id, id, quantity, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)';
    con.query(insertQuery, [menu_image, menu_title, parsedPrice, menuId, id, parsedQuantity, total_price], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error adding item to cart:', insertErr);
        return res.status(500).json({ message: 'Error adding item to cart' });
      }
      return res.status(200).json({ message: 'Item added to cart successfully' });
    });
  });
};
// Checkout Button
exports.checkout = (req, res) => {
  const userId = req.session.user.id;
  const cartItems = req.body.cart; // Array of cart items

  // Assuming menu_title is included in the request body
  const menuTitles = req.body.menu_title;
  const menuPrices = req.body.menu_price;

  // Array to store orders
  const orders = [];

  // Fetch the menu_ids corresponding to the cart items
  const getMenuIdsQuery = 'SELECT menu_id FROM cart WHERE id = ?';
  con.query(getMenuIdsQuery, [userId], (err, cartMenuIds) => {
    if (err) {
      console.error('Error fetching menu_ids from cart:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Iterate through the cart items and insert them into the orders table
    cartItems.forEach((item, index) => {
      const { quantity, total_price } = JSON.parse(item);
      const menuTitle = menuTitles[index];
      const menuPrice = menuPrices[index];
      const menuId = cartMenuIds[index].menu_id; // Fetch menu_id from the fetched array

      // Validate menuId isn't null before insertion
      if (!menuId) {
        console.error('Menu ID is null or invalid');
        return res.status(400).send('Invalid menu ID');
      }

      const insertOrderQuery = 'INSERT INTO orders (id, menu_id, menu_title, menu_price, quantity, total_price, ord_date) VALUES (?, ?, ?, ?, ?, ?, NOW())';
      con.query(insertOrderQuery, [userId, menuId, menuTitle, menuPrice, quantity, total_price], (err, result) => {
        if (err) {
          console.error('Error placing order:', err);
          return res.status(500).send('Internal Server Error');
        }
        // Store the order details in the orders array
        orders.push({
          id: userId,
          menu_id: menuId,
          menu_title: menuTitle,
          menu_price: menuPrice,
          quantity,
          total_price
        });

        // Check if all orders are processed
        if (orders.length === cartItems.length) {
          // Delete cart items after successful order placement
          const deleteCartQuery = 'DELETE FROM cart WHERE id = ?';
          con.query(deleteCartQuery, [userId], (err, deleteResult) => {
            if (err) {
              console.error('Error deleting cart items:', err);
              return res.status(500).send('Internal Server Error');
            }
            // Handle successful order placement and cart deletion
            res.render('customer/orders/orders', { orders }); // Render a confirmation page with orders
          }); 
        }
      });
    });
  });

  // Optionally, you can redirect the user or render a confirmation page after processing the orders
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
//customer history
exports.getOrderHistory = (req, res) => {
  const userId = req.session.user.user_id;
  const sql = `
    SELECT orders.ord_id, orders.menu_id, orders.quantity, orders.total_amount, orders.ord_date, menu.menu_title, menu.menu_image 
    FROM orders 
    JOIN menu ON orders.menu_id = menu.menu_id 
    WHERE orders.user_id = ?`;
  con.query(sql, [userId], (err, orderHistory) => {
    if (err) {
      console.error('Error querying order history:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('customer/order_history/order_history', { orderHistory });
  });
};

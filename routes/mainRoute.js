const router = require("express").Router();
const mainCon = require("../controller/mainController");
const authController = require("../controller/authController");

//Login and Register Route
router.get('/showLogin', authController.showLogin);
router.post('/login', authController.login);
router.get('/showRegister', authController.showRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// landing page
router.get('/home', mainCon.isAuthenticated, mainCon.getHome);
router.get('/admin/dashboard', mainCon.isAuthenticated, mainCon.getDash);

//Admin Side
//Menu
router.get('/admin/menu',mainCon.isAuthenticated,mainCon.getMenu);
router.get('/admin/addMenu',mainCon.isAuthenticated,mainCon.getAddMenu);

//Category
router.get('/admin/category',mainCon.isAuthenticated,mainCon.getCategory);
router.get('/admin/addCategory',mainCon.isAuthenticated,mainCon.getAddCategory);


// Welcome Route
router.get('/',mainCon.getIndex);

module.exports = router;
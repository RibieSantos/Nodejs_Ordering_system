const router = require("express").Router();
const mainCon = require("../controller/mainController");
const authController = require("../controller/authController");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/foods'); // Set your destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
router.post('/admin/addMenu/add',upload.single('menu_image'),mainCon.isAuthenticated,mainCon.addMenu);
router.get('/admin/edit/:id',mainCon.isAuthenticated,mainCon.getEditMenu);
router.post('/admin/update/:id',mainCon.isAuthenticated,mainCon.updateMenu);
router.post('/admin/menu/delete/:id',mainCon.isAuthenticated,mainCon.deleteMenu);

//Category
router.get('/admin/category',mainCon.isAuthenticated,mainCon.getCategory);
router.get('/admin/addCategory',mainCon.isAuthenticated,mainCon.getAddCategory);
router.post('/admin/category/delete/:id',mainCon.isAuthenticated,mainCon.deleteMenu);



// Welcome Route
router.get('/',mainCon.getIndex);
router.get('/logout',mainCon.logout);

module.exports = router;
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
router.get('/dashboard', mainCon.isAuthenticated, mainCon.getDash);

// Welcome Route
router.get('/',mainCon.getIndex);

module.exports = router;
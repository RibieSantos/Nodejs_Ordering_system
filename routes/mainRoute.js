const router = require("express").Router();
const mainCon = require("../controller/mainController");

router.get('/',mainCon.getIndex);

module.exports = router;
const express = require("express");
const {securedPage,encryptData,decryptData} = require('../controllers/SecuredController');
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();


router.route("/").get(protect,securedPage);
router.route("/encrypt").post(protect,encryptData);
router.route("/decrypt").post(protect,decryptData);


module.exports = router;

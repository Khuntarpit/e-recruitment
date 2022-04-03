const express = require("express");
const inquiryCtrl = require("./inquiry.controller");
const router = express.Router();
const userBloked = require("../../middleware/middleware");

router.route("/createInquiry").post(userBloked, inquiryCtrl.createInquiry);
router.route("/getInquiry").get(userBloked, inquiryCtrl.getInquiry);

module.exports = router;

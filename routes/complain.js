const express=require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const hostel = require("../models/hostel.js");
const Admin = require("../models/admin.js");
const Hostel = require("../models/hostel.js");
const Warden = require("../models/warden.js");
const Supervisor = require("../models/supervisor.js");
const Student = require("../models/student.js");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.get("/complain",(req,res)=>{
    res.render("complain");
})

module.exports=router
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
const Complain = require("../models/complain.js");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.get("/complain",(req,res)=>{
    res.render("complain");
})

router.post("/complain",(req,res)=>{
    var type=req.body.type;
    var roomtemp=req.body.room;
    var problem=req.body.problem;
    var description=req.body.description;
    var contact=req.body.contact;
    var email=req.body.email;
    var resolved=false;
    Complain.create({
        roomtemp,
        type,
        problem,
        description,
        contact,
        email,
        resolved
    },(err,complain)=>{
        if(err)res.send(err);
        else{
            Student.findById(req.user._id,(err,student)=>{
                if(err)res.send(err);
                else{
                    complain.student=student._id;
                    student.myComplains.push(complain._id);
                    complain.save();
                    student.save();
                }
            })
        }
    })
    
})

module.exports=router
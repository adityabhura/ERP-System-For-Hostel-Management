const express=require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const Admin = require("../models/admin.js");
const Hostel = require("../models/hostel.js");
const Warden = require("../models/warden.js");
const Supervisor = require("../models/supervisor.js");
const Student = require("../models/student.js");
const Complain = require("../models/complain.js");
const Staff = require("../models/staff.js");

// const staff = require("../models/staff.js");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.get("/staffRegister", (req, res) => {
    res.render("staffRegister");
});

router.post("/staffRegister",(req,res) => {
    let {name,
        username, 
        password,
        type,
        email,
        mobileNo} = req.body;
        console.log(req.body.password);
    //If any field is empty send back error 
    if (!name  ||  !password || !username || !type || !email || !mobileNo) {
      err = "Please fill all the fields";
      res.send(req.body);
    }

    
    if (typeof err == "undefined") {
        bcrypt.genSalt(10, (err, salt) => {
            if(err)throw err;
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              password = hash;
              Staff({
                name,
                username, 
                password,
                type,
                email,
                mobileNo
              }).save((err, data) => {
                if (err) throw err;
                //req.flash("success_message", "Please Login to Continue");
                console.log(data);
                res.redirect("/staffLogin");
              });
            });
          });
    }
  });
  
  var localStrategy = require("passport-local").Strategy;
  passport.use(
    "staff",
    new localStrategy({ usernameField: "username" }, (username, password, done) => {
      Staff.findOne({ username: username }, (err, data) => {
        if (err) {
            throw err;
            console.log(err);
        }
        if (!data) {
            console.log("Staff not registered")
          return done(null, false, { message: "Staff Not Registered" });
        }
        bcrypt.compare(password, data.password, (err, match) => {
          if (err) return done(null, false);
          if (!match)
            return done(null, false, { message: "Password is Incorrect" });
          if (match) return done(null, data);
        });
      });
    })
  );
  
  router.get("/staffLogin", (req, res) => {
    res.render("staffLogin");
  });

  router.get("/staffDashboard", (req, res) => {
    res.render("staffDashboard");
  });

  router.post("/staffLogin", (req, res, next) => {
    passport.authenticate("staff", {
      failureRedirect: "/staffLogin",
      successRedirect: "/staffDashboard",
      //failureFlash: true,
    })(req, res, next);
  });

  router.get("/staff/:id/viewComplains",(req,res)=>{
    Staff.findById(req.params.id).populate({path:"Complains",model:Complain,populate:{path:"student",model:Student}}).populate({path:"Complains",model:Complain,populate:{path:"staff",model:Staff}}).exec((err,staff)=>{
      res.render("StaffViewComplains",{data:staff.Complains});
      // res.send(staff);
  })
  })

//   router.get("/staff/complains/:id",(req,res)=>{
//     Complain.findById(req.params.id).populate({path:"student",model:Student}).populate({path:"staff",model:Staff})
//     .exec((err,data)=>{
//             res.render("complainStaff",{data:data});
//     })   
// })

  module.exports = router;
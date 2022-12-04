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

router.get("/wardenLogin",(req,res)=>{
    res.render("wardenLogin");
})

router.post("/addWarden/:hostelId",(req,res)=>{
    let {
        name,
        username, 
        password,
        email,
        mobileNo
    }=req.body
    if (!name  ||  !password || !email || !mobileNo) {
        err = "Please fill all the fields";
        res.send(req.body);
      //   res.render("patientRegister", { err: err });
      }
      //Password match code
      // if (password != confirmPassword) {
      //   err = "Passwords dont match";
      //   res.render("patientRegister", {
      //     err: err,
      //     email: email,
      //     name: name,
      //     password: password,
      //     address: address,
      //     city: city,
      //     state: state
      //   });
      // }
      
      if (typeof err == "undefined") {
          bcrypt.genSalt(10, (err, salt) => {
              if(err)throw err;
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;
               Warden({
                    name,
                    username, 
                    password,
                    email,
                    mobileNo
                }).save((err, warden) => {
                  if (err) {
                    throw err;
                }else{
                    //req.flash("success_message", "Please Login to Continue");
                    Hostel.findById(req.params.hostelId,(err,hostel)=>{
                        if(err){
                            res.send(err);
                        }else{
                            warden.hostel=hostel._id;
                            hostel.warden=warden._id;
                            warden.save();
                            hostel.save();
                            res.send(hostel);
                        }
                    })
                }           
                });
              });
            });
      }    
})

var localStrategy = require("passport-local").Strategy;
passport.use(
  "warden",
  new localStrategy({ usernameField: "username" }, (username, password, done) => {
    Warden.findOne({ username:username }, (err, data) => {
      if (err) {
          throw err;
          console.log(err);
      }
      if (!data) {
          console.log("Warden invalid")
        return done(null, false, { message: "Warden invalid" });
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

router.post("/wardenLogin", (req, res, next) => {
    passport.authenticate("warden", {
      failureRedirect: "/wardenLogin",
      successRedirect: "/warden/Dashboard",
      //failureFlash: true,
    })(req, res, next);
});

router.get("/warden/DashBoard",(req,res)=>{
    console.log(req.session,req.user);
    res.render("wardenDashboard");
})

module.exports = router;
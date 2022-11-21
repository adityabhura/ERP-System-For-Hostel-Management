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

router.use(cookieParser("secret"));
router.use(
  session({
    secret: "secret",
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
  })
);
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
  });
  
  passport.deserializeUser(function (id, cb) {
    Supervisor.findById(id, function (err, user) {
      if (err) cb(err);
      if (user) cb(null, user);
      else {
        Supervisor.findById(id, function (err, user) {
          if (err) cb(err);
          cb(null, user);
        })
      }
    });
  });

const ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
      res.set(
        "Cache-Control",
        "no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0"
      );
      return next();
    } else res.redirect("/studentLogin");
};

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.get("/supervisorLogin",(req,res)=>{
    res.render("supervisorLogin");
})

router.post("/addSupervisor/:hostelId",(req,res)=>{
    // const name=req.body.name;
    // const username=req.body.username
    // const password=req.body.password;
    // const email=req.body.email;
    // const mobileNo=req.body.mobileNo;
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
                Supervisor({
                    name,
                    username, 
                    password,
                    email,
                    mobileNo
                }).save((err, supervisor) => {
                  if (err) {
                    throw err;
                }else{
                    //req.flash("success_message", "Please Login to Continue");
                    Hostel.findById(req.params.hostelId,(err,hostel)=>{
                        if(err){
                            res.send(err);
                        }else{
                            supervisor.hostel=hostel._id;
                            hostel.supervisor=supervisor._id;
                            supervisor.save();
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
  "supervisor",
  new localStrategy({ usernameField: "username" }, (username, password, done) => {
    Supervisor.findOne({ username:username }, (err, data) => {
      if (err) {
          throw err;
          console.log(err);
      }
      if (!data) {
          console.log("Supervisor invalid")
        return done(null, false, { message: "Supervisor invalid" });
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

router.post("/supervisorLogin", (req, res, next) => {
    passport.authenticate("supervisor", {
      failureRedirect: "/supervisorLogin",
      successRedirect: "/supervisorDashboard",
      //failureFlash: true,
    })(req, res, next);
});

router.get("/supervisorDashBoard",(req,res)=>{
    res.render("supervisorDashboard");
})

module.exports = router;
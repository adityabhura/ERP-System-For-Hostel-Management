const express=require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const admin = require("../models/admin.js");


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
    admin.findById(id, function (err, user) {
      if (err) cb(err);
      if (user) cb(null, user);
      else {
        admin.findById(id, function (err, user) {
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
    } else res.redirect("/adminLogin");
};

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.get("/adminRegister", (req, res) => {
    res.render("adminRegister");
});

router.post("/adminRegister",(req,res) => {
    let {name,username, password} = req.body;
    //If any field is empty send back error 
    if (!name || !username || !password) {
      err = "Please fill all the fields";
      res.send(err);
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
              admin({
                name,
                username,
                password,
              }).save((err, data) => {
                if (err) throw err;
                //req.flash("success_message", "Please Login to Continue");
                console.log(data);
                res.redirect("/adminlogin");
              });
            });
          });
    }
  });
  
  var localStrategy = require("passport-local").Strategy;
  passport.use(
    "admin",
    new localStrategy({ usernameField: "username" }, (username, password, done) => {
      admin.findOne({ username: username }, (err, data) => {
        if (err) throw err;
        if (!data) {
          return done(null, false, { message: "Patient Not Registered" });
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
  
  router.get("/adminLogin", (req, res) => {
    res.render("adminLogin");
  });
  
  router.post("/adminLogin", (req, res, next) => {
    passport.authenticate("admin", {
      failureRedirect: "/adminLogin",
      successRedirect: "/admin/dashboard",
      //failureFlash: true,
    })(req, res, next);
  });

  router.get("/admin/dashboard", (req, res) => {
    console.log(req.user);
    res.render("adminDashboard");
  });


module.exports = router;
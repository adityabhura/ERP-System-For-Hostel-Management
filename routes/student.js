const express=require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const student = require("../models/student.js");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.get("/studentRegister", (req, res) => {
    res.render("studentRegister");
});

router.post("/studentRegister",(req,res) => {
    let {name,
        //username, 
        password,
        address,
        City,
        State,
        Country,
        Pin,
        scholarId,
        instituteEmail,
        personalEmail,
        mobileNo} = req.body;
        username=req.body.scholarId;
    //If any field is empty send back error 
    if (!name  ||  !password || !address || !City || !State || !Country || !Pin || !scholarId || !instituteEmail || !personalEmail || !mobileNo) {
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
              student({
                name,
                username, 
                password,
                address,
                City,
                State,
                Country,
                Pin,
                scholarId,
                instituteEmail,
                personalEmail,
                mobileNo
              }).save((err, data) => {
                if (err) throw err;
                //req.flash("success_message", "Please Login to Continue");
                console.log(data);
                res.redirect("/studentlogin");
              });
            });
          });
    }
  });
  
  var localStrategy = require("passport-local").Strategy;
  passport.use(
    "student",
    new localStrategy({ usernameField: "scholarId" }, (scholarId, password, done) => {
      student.findOne({ scholarId: scholarId }, (err, data) => {
        if (err) {
            throw err;
            console.log(err);
        }
        if (!data) {
            console.log("Student not registered")
          return done(null, false, { message: "Student Not Registered" });
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
  
  router.get("/studentLogin", (req, res) => {
    res.render("studentLogin");
  });

  router.get("/studentDashboard",(req,res)=>{
    res.render("studentDashboard");
  })
  
  router.post("/studentLogin", (req, res, next) => {
    passport.authenticate("student", {
      failureRedirect: "/studentLogin",
      successRedirect: "/studentDashboard",
      //failureFlash: true,
    })(req, res, next);
  });

 


module.exports = router;
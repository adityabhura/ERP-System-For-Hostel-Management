const express=require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const student = require("../models/student.js");
const Complain=require("../models/complain.js");
const supervisor = require("../models/supervisor.js");
const sgMail=require("@sendgrid/mail");
const API_KEY="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";
const Hostel = require("../models/hostel.js");
const Staff = require("../models/staff.js");



//Packages to add students via excel sheet
var multer=require("multer");
//var bodyParser=require("body-parser");
var excelToJson = require('convert-excel-to-json');
var async=require("async");
const { response } = require("express");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.use("/uploads",express.static("uploads"));

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/");
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + file.originalname);
    }
})

var upload=multer({
    storage:storage,
}).array('data',1);

//Setting SendGrid
sgMail.setApiKey(API_KEY);

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
        mobileNo,batch,
        course,
        branch} = req.body;
        username=req.body.scholarId.toString();
        console.log(req.body.password);
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
                scholarId,
                batch,
                course,
                branch,
                instituteEmail,
                personalEmail,
                mobileNo, 
                password,
                address,
                City,
                State,
                Country,
                Pin,
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
    student.findById(req.user._id).populate({path:"room.hostel",model:Hostel}).exec((err,data)=>{
      res.render("studentDashboard",{student:data});
    })
    
  })
  
  router.post("/studentLogin", (req, res, next) => {
    passport.authenticate("student", {
      failureRedirect: "/studentLogin",
      successRedirect: "/studentDashboard",
      //failureFlash: true,
    })(req, res, next);
  });

router.get("/myComplains",(req,res)=>{
  student.findById(req.user._id).populate({path:"myComplains",model:Complain,populate:{path:"staff",model:Staff}}).exec((err,student)=>{
    // res.send(student)
    res.render("myComplains",{data:student.myComplains});
  })
})

// router.get("/myComplains/:id",(req,res)=>{
//   Complain.findById(req.params.id).populate({path:"student",model:student}).populate({path:"staff",model:Staff})
//     .exec((err,data)=>{
//       // res.send(data);
//       res.render("complainStudent",{data:data});
//     }) 
// })

router.post("/studentResolved/:complainId",(req,res)=>{
  Complain.findById(req.params.complainId,(err,complain)=>{
    if(err)res.send(err);
    else{
      complain.studentResolved=true;
      supervisor.supervisorResolved=true;
      complain.save();
      res.redirect("/myComplains")
    }
  })
})



router.get("/addByFile",(req,res)=>{
  res.render("addByFile");
})

router.post("/test",(req,res,next)=>{upload(req,res,(err)=>{
  if(err){
          res.send(err);    
  }else{
      console.log("1");
      next();
  }
})},(req,res)=>{
  console.log(req.files[0].path);
  const excelData = excelToJson({
      sourceFile: req.files[0].path,
      header:{
        rows: 1
        },
      columnToKey: {
        '*': '{{columnHeader}}'
      }
      });
      // res.send(excelData.Sheet1);
      async.eachSeries(excelData.Sheet1,(scholar,cb)=>{
        bcrypt.genSalt(10, (err, salt) => {
          if(err)throw err;
          bcrypt.hash(scholar.PASSWORD.toString(), salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            student({
              name: scholar.NAME,
              username:scholar["SCHOLAR ID"],
              scholarId:scholar["SCHOLAR ID"],
              batch:scholar.BATCH,
              course:scholar.COURSE,
              branch:scholar.BRANCH,
              instituteEmail:scholar["INSTITUTE EMAIL"],
              personalEmail:scholar["PERSONAL EMAIL"],
              mobileNo:scholar["MOBILE NO."], 
              password,
              address:scholar.ADDRESS,
              City:scholar.CITY,
              State:scholar.STATE,
              Country:scholar.COUNTRY,
              Pin:scholar.PIN,
            }).save((err, data) => {
              if (err) throw err;
              //req.flash("success_message", "Please Login to Continue");

              //Sending Email Starts here
              // var message = {
              //   from: 'hostel.erp.system.nits@gmail.com',
              //   to: scholar["INSTITUTE EMAIL"],
              //   subject: 'Registration done. Get your login crediatials',
              //   html: '<p>Your account has been successfully registered in ERP System for Hostel Management at NITS. Find your login crediatials in the mail</p>'+
              //         '<p>Username: Your Scholar ID<br>Password:'+scholar.PASSWORD.toString() 
              //         +'</p><b>This is a confidential mail. Do not share your login crediantials with anyone.</b>'
              // };
              // sgMail.send(message).then(response=>console.log('Email sent')).catch(error=>console.log(error.message));
              //Sending Email ends here

              console.log("Adding new student"+data);
              cb();
            });
          });
        });
      },(err)=>{
          if(err)console.log(err);
          else res.send("The file has been processed successfully");
      })
})

// router.post("/changePassword/student",(req,res)=>{
//   res.render("changePasswordStudent");
// })

// router.post("/changePassword/student",(req,res)=>{
//   student.findByUsername(req.user.username,(err,data)=>{
//     data.change
//   })
// })


module.exports = router;
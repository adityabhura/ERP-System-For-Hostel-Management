var express= require("express");
var mongoose=require("mongoose");
var app=express();
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const Admin = require("./models/admin.js");
const Hostel = require("./models/hostel.js");
const Warden = require("./models/warden.js");
const Supervisor = require("./models/supervisor.js");
const Student = require("./models/student.js");
const Staff = require("./models/staff.js");

app.use(express.static("style"));

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    // maxAge: 3600000,
    // resave: true,
    // saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});
  
passport.deserializeUser(function (id, cb) {
    Admin.findById(id, function (err, user) {
      //console.log("Checking Admin");
      if (err) cb(err);
      if (user) cb(null, user);
      else {
        Warden.findById(id, function (err, user) {
          //console.log("Checking Warden");
          if (err) cb(err);
          if(user) cb(null, user);
          else{
            Supervisor.findById(id, function (err, user) {
                //console.log("Checking Supervisor");
                if (err) cb(err);
                if(user) cb(null, user);
                else{
                    Student.findById(id, function (err, user) {
                        //console.log("Checking Student");
                        if (err) cb(err);
                        if(user) cb(null, user);
                        else{
                          Staff.findById(id, function (err, user) {
                            //console.log("Checking Staff");
                            if (err) cb(err);
                            if(user) cb(null, user);
                            else{
                              
                            }
                          })
                        }
                    })
                }
            })
          }
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

app.set("view engine","ejs");

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    // res.locals.error=req.flash("error");
    // res.locals.success=req.flash("success");
    next();
});

app.get("/",function(req,res){
    res.render("index");
})

app.get("/test",function(req,res){
    res.send("Success");
})

app.get("/noticeBoard",(req,res)=>{
  res.render("noticeboard")
})

app.get("/noticeForm",(req,res)=>{
  res.render("addNotice")
})

app.get("/notice/:id",(req,res)=>{
  res.render("notice");
})

mongoose.connect("mongodb+srv://aditya:1914033@cluster0.8a8afij.mongodb.net/?retryWrites=true&w=majority",function(res,req){
    console.log("Database connected");
});

app.use(require("./routes/admin.js"));
app.use(require("./routes/student.js"));
app.use(require("./routes/hostels.js"));
app.use(require("./routes/supervisor.js"));
app.use(require("./routes/warden.js"));
app.use(require("./routes/complain.js"));
app.use(require("./routes/staff.js"));

app.listen(3000,function(){
    console.log("The server has started");
});
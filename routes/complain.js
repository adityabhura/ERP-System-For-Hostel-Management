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
const complain = require("../models/complain.js");
const staff = require("../models/staff.js");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.get("/complain",(req,res)=>{
    res.render("addComplain");
})

router.post("/complain",(req,res)=>{
    var type=req.body.type;
    var roomtemp=req.body.room;
    var problem=req.body.problem;
    var description=req.body.description;
    var contact=req.body.contact;
    var email=req.body.email;
    var supervisorResolved=false;
    var studentResolved=false;
    var date=new Date();
    Complain.create({
        roomtemp,
        type,
        problem,
        description,
        contact,
        email,
        supervisorResolved,
        studentResolved,
        date
    },(err,complain)=>{
        if(err)res.send(err);
        else{
            Student.findById(req.user._id,(err,student)=>{
                if(err)res.send(err);
                else{
                    complain.student=student._id;
                    student.myComplains.push(complain._id);
                    //complain.save();
                    student.save();
                    //res.send(complain)
                    Hostel.findById(student.room.hostel,(err,hostel)=>{
                        hostel.complains.push(complain._id);
                        complain.hostel=hostel._id;
                        complain.save();
                        hostel.save();
                        res.redirect("/myComplains");
                    })
                }
            })
        }
    })
    
})

router.get("/complains/:id",(req,res)=>{
            Complain.findById(req.params.id)
            .populate({path:"student",model:Student})
            .populate({path:"staff",model:staff})
            .exec((err,data)=>{
                staff.find({},(err,staffs)=>{
                    res.render("complain",{data:data,staffs:staffs});
                    console.log(req.user);
                })
                
            })   
})

// router.get("/warden/complains/:id",(req,res)=>{
//     Complain.findById(req.params.id)
//     .populate({path:"student",model:Student})
//     .populate({path:"staff",model:staff})
//     .exec((err,data)=>{
//         staff.find({},(err,staffs)=>{
//             res.render("complainWarden",{data:data,staffs:staffs});
//             console.log(req.user);
//         })
        
//     })   
// })

router.post("/assignStaff/:id",(req,res)=>{
    Complain.findById(req.params.id,(err,complain)=>{
        staff.findById(req.body.staffId,(err,staff)=>{
            complain.staff=staff._id;
            staff.Complains.push(complain._id);
            complain.save();
            staff.save();
            res.redirect("/viewComplains")
        })
        
    })
})

router.post("/resolveComplain/:id",(req,res)=>{
    Complain.findById(req.params.id,(err,complain)=>{
        complain.resolved=true;
        complain.remarks=req.body.remarks;
        complain.resolvedBy=req.user.name;
        complain.resolvedOn=new Date();
        complain.save();
        res.redirect("/complains/"+req.params.id)
    })
})

//View the complains page for both warden and supervisor
router.get("/viewComplains",(req,res)=>{
    Hostel.findById(req.user.hostel)
    .populate({path:"complains",model:Complain,populate:{path:"student",model:Student}})
    .populate({path:"complains",model:Complain,populate:{path:"staff",model:staff}})
    .exec((err,hostel)=>{
        res.render("viewComplains",{data:hostel.complains});
    })
  })


module.exports=router
const express=require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
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

  
router.get("/addHostels",(req,res)=>{
    res.render("addHostels");
});

router.post("/addHostels",async(req,res)=>{
    const name=req.body.name;
    const number=req.body.number;
    const single=req.body.single;
    const double=req.body.double;
    const triple=req.body.triple;
    const capacity={
        singleBed:single,
        doubleBed:double,
        tripleBed:triple,
    }
    Hostel.create({
        name:name,
        number:number,
        capacity:capacity
    },(err,data)=>{
        if(err)res.send(err);
        else{
            Admin.findById(req.user._id,async (err,admin)=>{
                if(err){
                    res.send(err);
                }else{
                    console.log(data);
                    admin.hostels.push(data);
                    admin.save();
                }
            });
        }
    })
   res.redirect("/admin/dashboard");
});

router.get("/viewHostels",(req,res)=>{
    Hostel.find({}).populate({path:"warden",model:Warden}).populate({path:"supervisor",model:Supervisor}).exec((err,data)=>{
        if(err)res.send(err);
        else{
            res.render("viewHostels",{data:data});
        }
    })
})

router.get("/addWarden/:hostelId",(req,res)=>{
    Hostel.findById(req.params.hostelId,(err,hostel)=>{
        if(err){
            res.send(err);
        }else{
            //res.send(hostel);
            res.render("addWarden",{hostel:hostel});
        }
    })
})

router.get("/addSupervisor/:hostelId",(req,res)=>{
    Hostel.findById(req.params.hostelId,(err,hostel)=>{
        if(err){
            res.send(err);
        }else{
            //res.send(hostel);
            res.render("addSupervisor",{hostel:hostel});
        }
    })
})

router.get("/addStudents/:hostelId",(req,res)=>{
    Hostel.findById(req.params.hostelId,(err,hostel)=>{
        if(err){
            res.send(err);
        }else{
            //res.send(hostel);
            Student.find({},(err,students)=>{
                if(err){
                    res.send(err);
                }else{
                    res.render("addStudents",{hostel:hostel,students:students});
                }
            })
        }
    })
})

router.post("/addStudents/:hostelId/:studentId",(req,res)=>{
    Hostel.findById(req.params.hostelId,(err,hostel)=>{
        if(err){
            res.send(err);
        }else{
            //res.send(hostel);
            Student.findById(req.params.studentId,(err,student)=>{
                if(err){
                    res.send(err);
                }else{
                    hostel.students.push(student._id);
                    student.room.hostel=hostel._id;
                    hostel.save();
                    student.save();
                    // res.send(student);
                    res.redirect("/viewHostels");
                }
            })
        }
    })
})


module.exports = router;
var mongoose=require("mongoose");
const complain = require("./complain");

var HostelSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    number:{
        type:String,
        unique:true
    },
    capacity:{
        singleBed:Number,
        doubleBed:Number,
        tripleBed:Number,
    },
    rooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room"
    }],
    warden:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Warden"
    },
    supervisor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Supervisor"
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }],
    complains:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complain"
    }]
});

module.exports=mongoose.model("Hostel",HostelSchema);
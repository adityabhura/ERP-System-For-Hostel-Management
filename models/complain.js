var mongoose=require("mongoose");

var ComplainSchema=new mongoose.Schema({
    type:String,
    problem:String,
    description:String,
    contact:Number,
    email:String, 
    hostel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hostel"
    },
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room"
    },
    roomtemp:String,
    warden:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Warden"
    },
    supervisor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Supervisor"
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    resolved:Boolean
});

module.exports=mongoose.model("Complain",ComplainSchema);
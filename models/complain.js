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
    date:{type:Date,default:Date.now()},

    supervisorResolved:Boolean,
    studentResolved:Boolean,
    
    resolved:Boolean,
    remarks:String,
    resolvedBy:String,
    resolvedOn:{type:Date},

    staff:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Staff"
    },

    attachments:[{type:String}],

    forwardedToWarden:{type:Boolean,default:false},
    forwardedToAdmin:{type:Boolean,default:false},

});

module.exports=mongoose.model("Complain",ComplainSchema);
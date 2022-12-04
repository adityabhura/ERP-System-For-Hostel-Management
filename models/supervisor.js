var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var SupervisorSchema=new mongoose.Schema({
    name:String,
    password:String,
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    mobileNo:{type:Number,unique:true},
    hostel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hostel"
    },
    hostelComplains:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complain"
    }]
});

SupervisorSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Supervisor",SupervisorSchema);
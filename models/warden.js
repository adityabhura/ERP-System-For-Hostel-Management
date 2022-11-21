var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var WardenSchema=new mongoose.Schema({
    name:String,
    password:String,
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    mobileNo:{type:Number,unique:true},
    hostel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hostel"
    },
});

WardenSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Warden",WardenSchema);
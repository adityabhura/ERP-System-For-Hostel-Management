var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var StaffSchema=new mongoose.Schema({
    name:String,
    password:String,
    type:String,
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    mobileNo:{type:Number,unique:true},
    Complains:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complain"
    }],
    userType:{
        type:String,
        default:"staff"
    }
});

StaffSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Staff",StaffSchema);


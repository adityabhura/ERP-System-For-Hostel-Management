var mongoose=require("mongoose");
// var passportLocalMongoose=require("passport-local-mongoose");

var adminSchema=new mongoose.Schema({
    username:{type:String,unique:true},
    name:{type:String,default:"Administration"},
    password:String,
    hostels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hostel"
    }],
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }],
    Complains:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complain"
    }],
    userType:{
        type:String,
        default:"admin"
    },
    forwardedComplains:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complain"
    }],
});

module.exports=mongoose.model("Admin",adminSchema);
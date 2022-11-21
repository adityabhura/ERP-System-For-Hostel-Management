var mongoose=require("mongoose");
// var passportLocalMongoose=require("passport-local-mongoose");

var adminSchema=new mongoose.Schema({
    username:{type:String,unique:true},
    password:String,
    hostels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hostel"
    }],
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }]
});

module.exports=mongoose.model("Admin",adminSchema);
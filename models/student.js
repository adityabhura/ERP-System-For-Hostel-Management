var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var StudentSchema=new mongoose.Schema({
    name:String,
    password:String,
    username:{type:String,unique:true},
    address: String,
    City:String,
    State:String,
    Country:String,
    Pin:String,
    scholarId:Number,
    instituteEmail:{type:String,unique:true},
    personalEmail:{type:String,unique:true},
    mobileNo:{type:Number,unique:true},
    room:{
        hostel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hostel"
        },
        roomNo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Room"
        }
    },
});

StudentSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Student",StudentSchema);
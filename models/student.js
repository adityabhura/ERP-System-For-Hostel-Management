var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");


var StudentSchema=new mongoose.Schema({
    name:String,
    password:String,
    username:{type:Number,unique:true},
    course:String,
    batch:Number,
    branch:String,
    scholarId:{type:Number,unique:true},
    instituteEmail:{type:String,unique:true},
    personalEmail:{type:String,unique:true},
    mobileNo:{type:Number,unique:true},
    address: String,
    City:String,
    State:String,
    Country:String,
    Pin:String,
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
    myComplains:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complain"
    }]
});

StudentSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Student",StudentSchema);
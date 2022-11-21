var express= require("express");
var mongoose=require("mongoose");
var app=express();

app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("index");
})

app.get("/test",function(req,res){
    res.send("Success");
})

mongoose.connect("mongodb+srv://aditya:1914033@cluster0.8a8afij.mongodb.net/?retryWrites=true&w=majority",function(res,req){
    console.log("Database connected");
});

app.use(require("./routes/admin.js"));
app.use(require("./routes/student.js"));
app.use(require("./routes/hostels.js"));
app.use(require("./routes/supervisor.js"));
app.use(require("./routes/warden.js"));
app.use(require("./routes/complain.js"));

app.listen(3000,function(){
    console.log("The server has started");
});
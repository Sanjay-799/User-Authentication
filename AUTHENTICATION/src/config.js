const mongoose=require('mongoose');
const connect=mongoose.connect("mongodb://localhost:27017/surya");

connect.then(()=>{
    console.log("Database Connected Successfully")
})

.catch(()=>{
    console.log("Database not connected")
})

//create a schema 

const LoginSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

//collectio Part

const collection=new mongoose.model("users",LoginSchema);
module.exports=collection;





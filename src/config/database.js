const mongoose = require("mongoose");

const connectDb = async()=>{
  await  mongoose.connect("mongodb+srv://user:user123@cluster0.kpwel.mongodb.net/devTinder") 
}

module.exports ={connectDb};

// connectDb().then(()=>{
//     console.log("Database connected successfully..")
// }).catch((err)=>{
//     console.error("Database cannot boe connected",err)
// })

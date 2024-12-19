//console.log("Staring Nodejs Program..😊")
const express = require("express");
const {connectDb} = require("./config/database");
const User = require("./models/user");


const app = express();
app.use(express.json());

app.post("/user",(req,res)=>{
    res.send("Data saved successfully to the database")
});

app.post("/signup",async(req,res)=>{
    console.log(req.body);
//     console.log("reached");
   const user = User(req.body);
   try {
    await user.save();
    res.send("user data saved successfully.")
   } catch(err){
    res.status(400).send("error saving the user:"+ err.message)
   }
 

});

//find user by email
app.get("/user",async (req,res)=>{
  const userEmail = req.body.emailId;
  try {
    //find only one object, if there are multiple objects with same email
    const user = await User.findOne({ emailId: userEmail});
    //const users = await User.find({ emailId: userEmail});
    if(!user){
      res.status(404).send("User not found !")
    }else {
        res.send(users)
    }
    
  }catch(err){
    console.error("Something went wrong!",err.message)
  }
  
});

app.get("/getuser",async (req,res)=>{
    const userEmail = req.body.emailId;
    try {
      //find all the users with email Id
      const users = await User.find({ emailId: userEmail});
      if(users.length === 0){
        res.status(404).send("User not found !")
      }else {
          res.send(users)
      }
      
    }catch(err){
      console.error("Something went wrong!",err.message)
    }
    
  })
//Feed api - get all the users from the Database
app.get("/feed", async(req,res)=>{
    const users = await User.find({});
    res.send(users);
});

//delete
app.delete("/user",async(req,res)=>{
  const userId = req.body.userId;
  console.log("userId=",userId);
  try {
    //const user = await User.findByIdAndDelete(userId);
    const user = await User.findByIdAndDelete({_id: userId });
    res.send("User Deleted succesfully.");
  }catch(err){
    console.error("Something went wrong!",err.message)
  }
});

//update data of the user
app.patch("/user",async(req,res)=>{
  const userId= req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"before"});
    console.log("before=",user)
    res.send("User Updated succesfully.")
  }catch(err){
    console.error("Something went wrong!",err.message)
  }

})

connectDb().then(()=>{
        console.log("Database connected successfully..");
        app.listen(7777,()=>{
            console.log("Server is successfully listening on port 7777");
        });
    }).catch((err)=>{
        console.error("Database cannot boe connected",err)
    })
    


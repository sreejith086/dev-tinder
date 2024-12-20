//console.log("Staring Nodejs Program..😊")
const express = require("express");
const {connectDb} = require("./config/database");
const User = require("./models/user");
const { validateSignupData} = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth")
const app = express();
app.use(express.json());
app.use(cookieParser())

app.post("/user",(req,res)=>{
    res.send("Data saved successfully to the database")
});

app.post("/signup",async(req,res)=>{
   try {
    //validation of data
   validateSignupData(req);
   const {firstName,lastName,emailId,password,skills} = req.body;
   //encrypt the password and stored into the db
   const passwordhash = await bcrypt.hash(password,10)
   console.log(passwordhash);
   const user =  new User({
     firstName,lastName,emailId,skills,password:passwordhash
   });
    await user.save();
    res.send("user data saved successfully.")
   } catch(err){
    res.status(400).send("error saving the user:"+ err.message)
   }
});

app.post("/login",async (req,res)=>{
  try {
    const {emailId , password} = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("Invalid credentials")
    }
    //const isPasswordValid = await  bcrypt.compare(password,user.password);
    const isPasswordValid = await user.passwordValidate(password);
    if(isPasswordValid){
      //create JWT Token
       //const token = jwt.sign({_id:user._id},"Devtinder@123",{expiresIn:"1d"});
       const token = await user.getJWT();
      //Add the token to the cookie and send the response back to the user
      res.cookie("token",token,{ expires: new Date(Date.now() + 8* 360000), httpOnly: true });
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials")
    }
  } catch(err){
    res.status(400).send("Error:"+ err.message)
  }
});

//profile
app.get("/profile",userAuth,async(req,res)=>{
  try {  
      const user = req.user;
      res.send(user);
  } catch(err){
     res.status(400).send("Error:"+ err.message)
  }
});

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  const user = req.user;
  console.log("Sending connection request");
  res.send(user.firstName+ " send conenction request");
});


connectDb().then(()=>{
        console.log("Database connected successfully..");
        app.listen(7777,()=>{
            console.log("Server is successfully listening on port 7777");
        });
    }).catch((err)=>{
        console.error("Database cannot boe connected",err)
    })
    


//console.log("Staring Nodejs Program..😊")
const express = require("express");

const app = express();

// app.use("/user", (req,res)=>{
//     res.send("Hahaaha");
// });

app.get("/user", (req,res)=>{
    res.send({ name:"Sreejith", email:"test@gmail.com"})
});

app.post("/user",(req,res)=>{
    res.send("Data saved successfully to the database")
});
app.delete("/user",(req,res)=>{
    res.send("Deleted successfully.") 
})

app.use("/test", (req,res)=>{
    res.send("Hello from the server");
});

app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777");
});
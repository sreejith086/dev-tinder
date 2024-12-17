 const adminAuth = (req,res,next)=>{
    const token ='1234';
    const isAdminAuthorized = token === '12342';
    if(!isAdminAuthorized){
     res.status(401).send("unauthorized requets!")
    }else {
     next();
    }
 };

 const userAuth = (req,res,next)=>{
    console.log("start checking the user auth")
    const token ='1234';
    const isUserAuthorized = token === '12342';
    if(!isUserAuthorized){
     res.status(401).send("unauthorized request!")
    }else {
     next();
    }
 };
 module.exports = {adminAuth ,userAuth};
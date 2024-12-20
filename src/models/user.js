const mongoose = require("mongoose");
var validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:4,
        maxLength:50
    },
    lastName: {
        type:String,
        minLength:4,
        maxLength:50
    },
    emailId:{
        type:String,
        required: true,
        lowercase:true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email="+value)
            }
        }
    },
    password:{
        type:String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter a strong password="+value)
            }
        }
    },
    age:{
        type: Number,
        min:18
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data isnot valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo url isnot valid")
            }
        }
    },
    about: {
      type: String,
      default:"This is a default about of the user."
    },
    skills:{
        type: [String]
    }
},
{
    timestamps:true
});

userSchema.methods.getJWT= async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Devtinder@123",{expiresIn:"1d"});
    return token;
}
userSchema.methods.passwordValidate = async function(passwordInputByUser){
    const user = this;
    const passwordhash = user.password;
   const isPasswordValid =  await  bcrypt.compare(passwordInputByUser,passwordhash);
   return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
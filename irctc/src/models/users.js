const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    fname : {
        type:String,
        required:true,
    },
    lnane : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
    },
    pnumber : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    confirmpassword : {
        type:String,
        required:true
    },
   

});

// Compile model from schema
const User = mongoose.model("userModel", userSchema);
module.exports = User
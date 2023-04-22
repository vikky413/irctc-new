const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const confirmSchema = new Schema({

    sfrom : {
        type:String,
        required:true,
    },

    sto : {
        type:String,
        required:true,
    },

    trainname : {
        type:String,
        required:true,
    },

    trainnumber : {
        type:String,
        required:true,
    },

    coach : {
         type:String,
         required:true
    },

    age :{
        type:Number,
        required:true
    },

    dob : {
        type:String,
        required:true,
    },

    gender : {
        type:String,
        required:true,
    },

    pnr:{
        type:String,
        required:true
     },

    fname : {
        type:String,
        required:true,
    },

    lnane : {
        type:String,
       
    },
    
    email : {
        type:String,
        required:true,
        unique:false
        
    },
    phone : {
        type:String,
        required:true
    },
    subject :{
        type:Number,
    },
    passangers:{
        type:Array
    },
    pass_age:{
        type:Array
    },
    tid: {
        type:Number,
        required:true
    }

});

// Compile model from schema
const confirmModel = mongoose.model("confirmModel", confirmSchema);
module.exports = confirmModel

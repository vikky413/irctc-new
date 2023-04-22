const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const searchSchema = new Schema({
     ftrain : {
        type:String,
        required:true,
    },
    ttrain : {
        type:String,
        required:true,
    },
    date : {
        type:String,
        required:true
    }
});

// Compile model from schema
const searchModel = mongoose.model("searchModel", searchSchema);
module.exports = searchModel
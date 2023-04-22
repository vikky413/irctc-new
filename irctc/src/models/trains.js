const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const tSchema = new Schema({
    name : {
        type:String,
        required:true,
    },
    number : {
        type:String,
        required:true,
    },
    atime : {
        type:String,
        required:true,
    },
    dtime : {
        type:String,
        required:true,
    },

});

// Compile model from schema
const tModel = mongoose.model("tModel", tSchema);
module.exports = tModel
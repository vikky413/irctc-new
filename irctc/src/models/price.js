const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const priceSchema = new Schema({
     ac : {
        type:String,
        required:true,
    },
    lac : {
        type:String,
        required:true,
    },
    sac : {
        type:String,
        required:true,
    },
    sl : {
        type:String,
        required:true,
    },
    gn : {
        type:String,
        required:true,
    }

});

// Compile model from schema
const priceModel = mongoose.model("priceModel", priceSchema);
module.exports = priceModel
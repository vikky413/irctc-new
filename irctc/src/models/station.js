const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const stationSchema = new Schema({
     stn : {
        type:String,
        required:true,
    }

});

// Compile model from schema
const stationModel = mongoose.model("stationModel", stationSchema);
module.exports = stationModel
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bookSchema = new Schema({
     tname : {
        type:String,
        required:true,
    },
    trnno : {
        type:String,
        required:true,
    },
});

// Compile model from schema
const bookModel = mongoose.model("bookModel", bookSchema);
module.exports = bookModel
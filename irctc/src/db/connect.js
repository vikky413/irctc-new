const mongoose = require("mongoose")

mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://gayatripadhy61:gayatripadhy61@cluster0.vdz1p6y.mongodb.net/?retryWrites=true&w=majority",).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`no connection`);
})

module.exports = mongoose
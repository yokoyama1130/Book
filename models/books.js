const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/books')
    .then(() => {
        console.log("コネクションOK");
    })
    .catch((err) => {
        console.error("コネクションエラー");
        console.error(err);
    });

const bookSchema = new Schema({
    name: String,
    author: String,
    price: String,
    comment: String
});

module.exports = mongoose.model("book", bookSchema);
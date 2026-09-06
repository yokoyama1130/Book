const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: String,
    author: String,
    price: String,
    comment: String
});

module.exports = mongoose.model("book", bookSchema);
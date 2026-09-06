const books = require("./books");
const Book = require("../models/books");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/books')
    .then(() => {
        console.log("コネクションOK");
    })
    .catch((err) => {
        console.error("コネクションエラー");
        console.error(err);
    });

const bookDB = async () => {
    await Book.deleteMany({});
    await Book.insertMany(books);
};

bookDB()
    .then(() => {
        console.log("保存しました");})
    .catch((e) => {
        console.log("DBに保存に失敗しました");
        console.log(e);});


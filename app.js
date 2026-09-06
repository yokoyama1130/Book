const express = require("express");
const app = express();
const PORT = 8081;
const Book = require("./models/books");

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/books')
    .then(() => {
        console.log("コネクションOK");
    })
    .catch((err) => {
        console.error("コネクションエラー");
        console.error(err);
    });

app.set("view engine", "ejs");

// 一覧画面のルーティング
app.get("/", async (req, res) => {
    const books = await Book.find({});
    res.render("books/index", { books });
});

app.listen(PORT, () => {
    console.log("ポート8081でサーバー起動");
});

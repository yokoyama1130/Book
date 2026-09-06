const express = require("express");
const app = express();
const PORT = 8081;
const Book = require("./models/books");
const path = require("path");

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
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));

// 一覧画面のルーティング
app.get("/", async (req, res) => {
    const books = await Book.find({});
    res.render("books/index", { books });
});

// 新規登録画面へのルーティング
app.get("/new", (req, res) => {
    res.render("books/new");
});

// 新規登録ロジック
app.post("/book/new", async (req, res) => {
    const book = await req.body.book;
    const newBook = new Book({
        name: book.name,
        author: book.author
    });
    await newBook.save();
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log("ポート8081でサーバー起動");
});

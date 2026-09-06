const express = require("express");
const app = express();
const PORT = 8081;
const Book = require("./models/books");
const path = require("path");
const methodOverride = require("method-override");

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
app.use(methodOverride("_method"));

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

// 本詳細ページのルーティング
app.get("/books/:id", async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.render("books/show", { book });
});

// 編集画面へのルーティング
app.get("/books/:id/edit", async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.render("books/edit", { book });
});

// 編集機能
app.put("/books/:id/edit", async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, {
        name: req.body.book.name,
        author: req.body.book.author
    });
    res.redirect(`/books/${book._id}`);
});

// 削除
app.delete("/books/:id/delete", async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect("/");
})

app.listen(PORT, () => {
    console.log("ポート8081でサーバー起動");
});

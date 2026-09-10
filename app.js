const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const Book = require("./models/books");

const app = express();
const PORT = process.env.PORT || 8081;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/books";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const statuses = ["未読", "読書中", "読了"];
const genres = ["小説", "ビジネス", "技術", "エッセイ", "その他"];
const messages = { created: "本を本棚に追加しました。", updated: "本の情報を更新しました。", deleted: "本を本棚から削除しました。" };

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const bookFormData = (body) => ({
    name: body.name?.trim(), author: body.author?.trim(), genre: body.genre,
    status: body.status, price: body.price === "" ? null : body.price,
    rating: body.rating === "" ? null : body.rating, comment: body.comment?.trim(),
    favorite: body.favorite === "on"
});

app.get("/", (req, res) => res.redirect("/books"));

app.get("/books", async (req, res) => {
    const q = req.query.q?.trim() || "";
    const status = statuses.includes(req.query.status) ? req.query.status : "";
    const filter = {};
    if (q) {
        const pattern = new RegExp(escapeRegExp(q), "i");
        filter.$or = [{ name: pattern }, { author: pattern }, { comment: pattern }];
    }
    if (status) filter.status = status;
    const [books, allBooks] = await Promise.all([
        Book.find(filter).sort({ favorite: -1, updatedAt: -1 }).lean(),
        Book.find({}).select("status favorite").lean()
    ]);
    const stats = {
        total: allBooks.length,
        reading: allBooks.filter((book) => book.status === "読書中").length,
        finished: allBooks.filter((book) => book.status === "読了").length,
        favorites: allBooks.filter((book) => book.favorite).length
    };
    res.render("books/index", { books, stats, filters: { q, status }, statuses, notice: messages[req.query.notice] });
});

app.get("/books/new", (req, res) => res.render("books/new", { book: {}, statuses, genres, errors: [] }));

app.post("/books", async (req, res) => {
    try {
        const book = new Book(bookFormData(req.body.book || {}));
        await book.save();
        res.redirect(`/books/${book._id}?notice=created`);
    } catch (error) {
        if (error.name !== "ValidationError") throw error;
        res.status(422).render("books/new", { book: req.body.book || {}, statuses, genres, errors: Object.values(error.errors).map((item) => item.message) });
    }
});

app.get("/books/:id", async (req, res) => {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).render("404");
    res.render("books/show", { book, notice: messages[req.query.notice] });
});

app.get("/books/:id/edit", async (req, res) => {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).render("404");
    res.render("books/edit", { book, statuses, genres, errors: [] });
});

app.put("/books/:id", async (req, res) => {
    const formBook = bookFormData(req.body.book || {});
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, formBook, { new: true, runValidators: true });
        if (!book) return res.status(404).render("404");
        res.redirect(`/books/${book._id}?notice=updated`);
    } catch (error) {
        if (error.name !== "ValidationError") throw error;
        res.status(422).render("books/edit", { book: { ...formBook, _id: req.params.id }, statuses, genres, errors: Object.values(error.errors).map((item) => item.message) });
    }
});

app.delete("/books/:id", async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).render("404");
    res.redirect("/books?notice=deleted");
});

app.use((req, res) => res.status(404).render("404"));
app.use((error, req, res, next) => {
    if (error.name === "CastError") return res.status(404).render("404");
    console.error(error);
    res.status(500).render("error");
});

const start = async () => {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    app.listen(PORT, () => console.log(`Bookloom: http://localhost:${PORT}`));
};

if (require.main === module) {
    start().catch((error) => {
        console.error("MongoDBに接続できませんでした。MongoDBが起動しているか確認してください。");
        console.error(error.message);
        process.exitCode = 1;
    });
}

module.exports = { app, start };

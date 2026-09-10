const books = require("./books");
const Book = require("../models/books");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/books";

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        await Book.deleteMany({});
        await Book.insertMany(books);
        console.log(`${books.length}冊のサンプルデータを保存しました。`);
    } catch (error) {
        console.error("サンプルデータの保存に失敗しました。", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seed();

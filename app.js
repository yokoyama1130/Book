const express = require("express");
const app = express();
const PORT = 8081;

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/books')
    .then(() => {
        console.log("コネクションOK");
    })
    .catch((err) => {
        console.error("コネクションエラー");
        console.error(err);
    });

app.listen(PORT, () => {
    console.log("ポート8081でサーバー起動");
});

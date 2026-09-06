const express = require("express");
const app = express();
const PORT = 8081;

app.listen(PORT, () => {
    console.log("ポート8081でサーバー起動");
});

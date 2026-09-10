const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "タイトルを入力してください。"], trim: true, maxlength: [120, "タイトルは120文字以内で入力してください。"] },
        author: { type: String, required: [true, "著者名を入力してください。"], trim: true, maxlength: [80, "著者名は80文字以内で入力してください。"] },
        genre: { type: String, enum: ["小説", "ビジネス", "技術", "エッセイ", "その他"], default: "その他" },
        status: { type: String, enum: ["未読", "読書中", "読了"], default: "未読" },
        price: { type: Number, min: [0, "価格は0円以上で入力してください。"], default: null },
        rating: { type: Number, min: 1, max: 5, default: null },
        comment: { type: String, trim: true, maxlength: [1000, "メモは1000文字以内で入力してください。"] },
        favorite: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

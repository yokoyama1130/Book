const test = require("node:test");
const assert = require("node:assert/strict");
const Book = require("../models/books");

test("タイトルと著者は必須", async () => {
    await assert.rejects(new Book({}).validate(), (error) => {
        assert.ok(error.errors.name);
        assert.ok(error.errors.author);
        return true;
    });
});

test("価格に負の数は指定できない", async () => {
    await assert.rejects(new Book({ name: "本", author: "著者", price: -1 }).validate(), (error) => {
        assert.equal(error.errors.price.message, "価格は0円以上で入力してください。");
        return true;
    });
});

test("初期値は未読・その他・お気に入りではない", () => {
    const book = new Book({ name: "本", author: "著者" });
    assert.equal(book.status, "未読");
    assert.equal(book.genre, "その他");
    assert.equal(book.favorite, false);
});

const mongoose = require("mongoose");

// creamos el schema
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
});

// creamos el modelo
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

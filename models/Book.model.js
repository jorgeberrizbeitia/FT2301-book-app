const mongoose = require("mongoose");

// creamos el schema
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  // author: {
  //   type: mongoose.Schema.Types.ObjectId, // el valor de esta propiedad será un id de mongo
  //   ref: "Author"// El nombre del MODELO de la collección donde deberia buscar esta relación
  // },
  // AHORA ESTO VA A SER UN ARRAY DE AUTORES
  author: [
    {
      type: mongoose.Schema.Types.ObjectId, // el valor de esta propiedad será un id de mongo
      ref: "Author"// El nombre del MODELO de la collección donde deberia buscar esta relación
    }
  ],
  image: String // el url de cloudinary
});

// creamos el modelo
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

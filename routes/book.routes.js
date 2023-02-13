const express = require("express");
const router = express.Router();

const Book = require("../models/Book.model.js")

// nuestras rutas
// GET "/book" => renderizar una vista con los titulos de los libros
router.get("/", (req, res, next) => {
  
  Book.find()
  .select({title: 1})
  // .select("title")
    .then((response) => {
      console.log(response);

      res.render("book/list.hbs", {
        allBooks: response
      });
    })
    .catch((error) => {
      next(error);
    });
});

// GET "/book/:bookId/details" => renderizar los detalles de un libro por su id
router.get("/:bookId/details", async (req, res, next) => {

  console.log(req.params)

  try {

    const { bookId } = req.params;
    // const bookId = req.params.bookId

    // Book.findById(bookId)
    const bookDetails = await Book.findById(bookId)
    console.log(bookDetails)

    res.render("book/details.hbs", {
      bookDetails: bookDetails
    })

    // opcional
    // res.render("book/details.hbs", bookDetails)
    // dentro del hbs no hace falta hacer target a bookDetails

  } catch(error) {
    next(error)
  }
})

// GET "/book/create" => renderizar un formulario para que el usuario pueda crear un libro en la DB
router.get("/create", (req, res, next) => {

  res.render("book/create-form.hbs")

})


router.post("/create-new-book", async (req, res, next) => {

  console.log(req.body)

  // cojer la info
  try {
    
    // crear el elemento en la DB
    const response = await Book.create({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author
    })

    // decir al user todo ok
    res.render("book/create-form.hbs") // ahora lo cambiamos

  } catch(err) {
    next(err)
  }




})


module.exports = router;
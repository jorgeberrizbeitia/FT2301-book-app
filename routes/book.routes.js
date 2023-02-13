const express = require("express");
const router = express.Router();

const Book = require("../models/Book.model.js");

// nuestras rutas
// GET "/book" => renderizar una vista con los titulos de los libros
router.get("/", (req, res, next) => {
  Book.find()
    .select({ title: 1 })
    // .select("title")
    .then((response) => {
      console.log(response);

      res.render("book/list.hbs", {
        allBooks: response,
      });
    })
    .catch((error) => {
      next(error);
    });
});

// GET "/book/:bookId/details" => renderizar los detalles de un libro por su id
router.get("/:bookId/details", async (req, res, next) => {
  console.log(req.params);

  try {
    const { bookId } = req.params;
    // const bookId = req.params.bookId

    // Book.findById(bookId)
    const bookDetails = await Book.findById(bookId);
    console.log(bookDetails);

    res.render("book/details.hbs", {
      bookDetails: bookDetails,
    });

    // opcional
    // res.render("book/details.hbs", bookDetails)
    // dentro del hbs no hace falta hacer target a bookDetails
  } catch (error) {
    next(error);
  }
});

// GET "/book/create" => renderizar un formulario para que el usuario pueda crear un libro en la DB
router.get("/create", (req, res, next) => {
  res.render("book/create-form.hbs");
});

// POST "/book/create" => crear un libro en la DB y redireccionar al usuario
router.post("/create", async (req, res, next) => {
  console.log(req.body);

  // cojer la info
  try {
    // crear el elemento en la DB
    const response = await Book.create({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
    });

    // decir al user todo ok
    // res.render("book/create-form.hbs"); // ahora lo cambiamos
    res.redirect("/book") // redirecciona al usuario a otro URL
    // res.redirect(`/book/${response._id}/details`)
    // res.render("index.hbs")
  } catch (err) {
    next(err);
  }
});


// GET "/book/:bookId/edit" => renderizar el formulario de editar (vendrá con la informacion actual del libro)
router.get("/:bookId/edit", async (req, res, next) => {

  try {

    // buscar info del libro de la DB aqui
    const { bookId } = req.params;

    const bookToUpdate = await Book.findById(bookId)
    console.log(bookToUpdate)
  
    res.render("book/edit-form.hbs", {
      bookToUpdate: bookToUpdate
    })
  } catch(err) {
    next(err)
  }
})

// POST "/book/:bookId/edit" => editar el libro con los valores del campo
router.post("/:bookId/edit", async (req, res, next) => {

  console.log("intentando actualizar el libro", req.body)
  console.log(req.params.bookId)


  try {

    const {bookId} = req.params

    const response = await Book.findByIdAndUpdate(bookId, {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author
    })

    // res.redirect("/book")
    res.redirect(`/book/${bookId}/details`)

  } catch(err){
    next(err)
  }

})

// POST "/book/:bookId/delete" => borrar un libro por su id
router.post("/:bookId/delete", async (req, res, next) => {

  // recibiremos un id
  console.log(req.params.bookId)
  const { bookId } = req.params

  try {
    
    // usamos un metodo para borrar un documento por su id
    const response = await Book.findByIdAndDelete(bookId)

    res.redirect("/book")


  } catch(err) {
    next(err)
  }

})


module.exports = router;

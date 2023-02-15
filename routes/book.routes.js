const express = require("express");
const router = express.Router();

const Book = require("../models/Book.model.js");
const Author = require("../models/Author.model.js")

const uploader = require("../middlewares/cloudinary.js") // este es el middleware que enviar la imagen a cloudinary y nos da el URL

// nuestras rutas
// GET "/book" => renderizar una vista con los titulos de los libros
router.get("/", (req, res, next) => {
  Book.find()
    .select({ title: 1, author:1 })
    // .populate("author") // ejemplo de hacer populate en array de data
    // .select("title")
    .then((response) => {
      // console.log(response);

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
  // console.log(req.params);

  try {
    const { bookId } = req.params;
    // const bookId = req.params.bookId

    // Book.findById(bookId)
    // const bookDetails = await Book.findById(bookId);

    // .populate() es un metodo de llamadas a BD y nos da todos los detalles de una propiedad que tenga una relación
    // .populate("nombre de la propiedad")

    const bookDetails = await Book.findById(bookId).populate("author") // .todo en la misma llamada
    // const bookDetails = await Book.findById(bookId).populate("author", "name") // ejemplo de como seleccionar una propiedad especifica con el populate y no traer toda la data

    // console.log(bookDetails);
    // console.log(bookDetails.author)
    // const authorDetails = await Author.findById(bookDetails.author)
    // console.log(authorDetails)

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
router.get("/create", async (req, res, next) => {

  // res.render("book/create-form.hbs");

  try {
    
    // ahora esta ruta busca todos los autores de la BD y los pasa al cliente
    const response = await Author.find().select("name") // select como buena practica. Solo necesitamos el nombre y el id

    res.render("book/create-form.hbs", {
      allAuthors: response
    });

  } catch (error) {
    next(error)
  }

});

// POST "/book/create" => crear un libro en la DB y redireccionar al usuario
//          esto ejecuta el middleware justo antes de entrar en la ruta
//                            |
router.post("/create", uploader.single("image"), async (req, res, next) => {
  console.log(req.body);

  // pasar por el proceso de cloudinary para enviar la imagen a cloudinary y recibir el URL
  // console.log(req.file.path) // el url de cloudinary

  let image;
  if (req.file !== undefined) {
    image = req.file.path
  }

  // cojer la info
  try {
    // crear el elemento en la DB
    const response = await Book.create({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      image: image // el url de cloudinary
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

    const allAuthors = await Author.find().select("name")
    
    // const cloneAllAuthors = JSON.parse( JSON.stringify(allAuthors) )
    // const cloneAllAuthors = structuredClone(allAuthors)
    // const cloneAllAuthors = [...allAuthors] // con clone shallow funciona


    allAuthors.forEach((eachAuthor) => {
      if (bookToUpdate.author.includes(eachAuthor._id) === true) {
        eachAuthor.isOnBook = true
      } else {
        eachAuthor.isOnBook = false
      }
    })
    
    console.log(allAuthors)

    // object1._id === object2._id // false
    // object1._id == object2._id // true
    // JSON.stringify(object1._id) === JSON.stringify(object2._id) // true

  
    res.render("book/edit-form.hbs", {
      bookToUpdate: bookToUpdate,
      allAuthors: allAuthors
    })
  } catch(err) {
    next(err)
  }
})

// POST "/book/:bookId/edit" => editar el libro con los valores del campo
router.post("/:bookId/edit", async (req, res, next) => {

  // console.log("intentando actualizar el libro", req.body)
  // console.log(req.params.bookId)


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
  // console.log(req.params.bookId)
  const { bookId } = req.params

  try {
    
    // usamos un metodo para borrar un documento por su id
    // const response = await Book.findByIdAndDelete(bookId)
    await Book.findByIdAndDelete(bookId)

    res.redirect("/book")


  } catch(err) {
    next(err)
  }

})


module.exports = router;

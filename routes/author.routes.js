const express = require("express");
const router = express.Router();

const Author = require("../models/Author.model.js")

// todas nuestras rutas de autores

// Create
// GET "/author/create" => para renderizar formulario de creacion de autor
router.get("/create", (req, res, next) => {

  res.render("author/create-form.hbs")

})

// POST "/author/create" => recibe data de formulario y crea el autor en la DB
router.post("/create", async (req, res, next) => {

  console.log(req.body)

  const { name, country, yearBorn } = req.body

  try {

   await Author.create({
    name,
    country,
    yearBorn,
   })

   res.redirect("/")

  } catch (err) {
    next(err)
  }

})

// Read
// GET "/author" => listar todos los autores de la DB
router.get("/", async (req, res, next) => {

  try {
    
    const response = await Author.find()
    res.render("author/list.hbs", {
      allAuthors: response
    })

  } catch (error) {
    next(error)
  }


})


// Edit
// Delete

module.exports = router;
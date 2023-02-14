const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// aqui tenemos nuestras rutas de libros
const bookRoutes = require("./book.routes.js")
router.use("/book", bookRoutes)

const authorRoutes = require("./author.routes.js")
router.use("/author", authorRoutes)


module.exports = router;

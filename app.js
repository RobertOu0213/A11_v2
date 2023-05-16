const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const generatePassword = require("./randomPassword");
const URL = require("./models/url");
const port = 3000;

require("./config/mongoose");

app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/url/new", (req, res) => {
  res.render("new");
});

app.post("/", (req, res) => {
  const shortURL = generatePassword();

  URL.findOne({ originalURL: req.body.originalURL })
    .then(
      URL.create({
        shortURL,
        originalURL: req.body.originalURL,
      })
    )
    .then(res.render("index", { renderPassword: shortURL }))
    .catch((error) => console.log(error));
});

app.get("http://www.plus.com/:id", (req, res) => {
  const domain = "http://www.plus.com/";
  const { id } = req.params;
  const shortURL = domain + id;
  URL.findOne({ shortURL })
    .then(res.redirect(originalURL))
    .catch((error) => console.log(error));
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

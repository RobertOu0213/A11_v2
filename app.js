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

//寫法一
// app.post("/", (req, res) => {
//   const shortURL = generatePassword();

//   URL.findOne({ originalURL: req.body.originalURL })
//     .then((data) => {
//       if (data) return data;
//       else
//         URL.create({
//           shortURL,
//           originalURL: req.body.originalURL,
//         });
//     })
//     .then(res.render("index", { renderPassword: shortURL }))
//     .catch((error) => console.log(error));
// });

// app.post("/", (req, res) => {
//   const shortURL = generatePassword();

//   URL.findOne({ originalURL: req.body.originalURL })
//     .then((data) =>
//       data ? data : URL.create({ shortURL, originalURL: req.body.originalURL })
//     )
//     .then(res.render("index", { renderPassword: shortURL }))
//     .catch((error) => console.log(error));
// });

// app.get("/:id", (req, res) => {
//   const { id } = req.params;
//   URL.findOne({ id })
//     .then((data) => {
//       res.redirect(data.originalURL);
//     })
//     .catch((error) => console.log(error));
// });

// app.get("/:shortURL", (req, res) => {
//   const { shortURL } = req.params;

//   URL.findOne({ shortURL })
//     .then((data) => {
//       res.redirect(data.originalURL);
//     })
//     .catch((error) => console.error(error));
// });

//寫法二
app.post("/", (req, res) => {
  if (!req.body.originalURL) return res.redirect("/");
  const shortURL = generatePassword();

  URL.findOne({ originalURL: req.body.originalURL })
    .then((data) =>
      data ? data : URL.create({ shortURL, originalURL: req.body.originalURL })
    )
    .then((data) =>
      res.render("index", {
        shortURL: data.shortURL,
      })
    )
    .catch((error) => console.error(error));
});

app.get("/:shortURL", (req, res) => {
  const { shortURL } = req.params;

  URL.findOne({ shortURL })
    .then((data) => {
      res.redirect(data.originalURL);
    })
    .catch((error) => console.error(error));
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

const express = require("express");
const router = express.Router();

const genres = [
  { id: 1, name: "action" },
  { id: 2, name: "romance" },
  { id: 3, name: "comedy" },
];

//Handling Get requests
router.get("/", (req, res) => {
  res.send(genres);
});

//Handling Get requests and with params
router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === +req.params.id);
  if (!genre)
    return res.status(404).send("The genre with that id was not found");
  res.send(genre);
});

//Handling post requests and Input vaidation with Joi
router.post("/", (req, res) => {
  const { error } = validateWithJoi(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.send(genre);
});

//Handling Put requests
router.put("/:id", (req, res) => {
  //check if genre exists
  const genre = genres.find((c) => c.id === +req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  //validate input
  const { error } = validateWithJoi(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  //update genre
  genre.name = req.body.name;

  //display
  res.send(genre);
});

//Handling Delete requests
router.delete("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === +req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

function validateWithJoi(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

module.exports = router;

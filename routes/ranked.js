const express = require('express');
const con = require('../db');
const router = express.Router();

//Get all Ranks
router.get('/', (req, res) => {
  con.query("SELECT * FROM players", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get rank for player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM players WHERE id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;

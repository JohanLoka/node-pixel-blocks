const express = require('express');
const pool = require('../db');
const bodyParser = require('body-parser');
const router = express.Router();

const app = require('../app');
const formatDate = require('../lib/date');

//Get all rounds for this player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM dungeon WHERE player_id= ? ORDER BY id DESC", [id], function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all
router.get('/', (req, res) => {
  pool.query("SELECT * FROM dungeon ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Post new score
router.post('/', (req, res) => {
  var sql = "INSERT INTO dungeon (player_id, floor, level, date, tier) VALUES ?";

  const date = formatDate(new Date());

  var values = [
    [req.body.id, req.body.floor, req.body.level, date, req.body.tier]
  ];
  pool.query(sql, [values], function(err, result, fields) {
    res.send(result);
  });
});

module.exports = router;

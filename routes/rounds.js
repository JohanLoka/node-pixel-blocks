const express = require('express');
const con = require('../db');
const router = express.Router();

const joinSql = "INNER JOIN players ON players.id = rounds.player_id";

//Get all
router.get('/', (req, res) => {
  con.query("SELECT * FROM rounds ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all rounds for this player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM rounds WHERE player_id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Todays best
router.get('/todays', (req, res) => {
  con.query("SELECT players.username, score, player_id, level FROM rounds " + joinSql +" ORDER BY rounds.id DESC LIMIT 1", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Todays best
router.post('/', (req, res) => {
    res.send('Add round');
});

module.exports = router;

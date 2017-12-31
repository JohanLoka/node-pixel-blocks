const express = require('express');
const con = require('../db');
const bodyParser = require('body-parser');
const router = express.Router();

const app = require('../app');

//Todays best player
router.get('/todays', (req, res) => {
  console.log('todays!');
  con.query("SELECT * FROM rounds ORDER BY score DESC LIMIT 1", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Players best today
router.get('/todays/:id', (req, res) => {
  console.log('todays with ID: ' + req.params.id);
  con.query("SELECT *, players.username, players.id FROM rounds INNER JOIN players ON players.id = rounds.player_id WHERE rounds.player_id=" + req.params.id + " ORDER BY score DESC LIMIT 1", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all rounds for this player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM rounds WHERE player_id=" + id + " ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all
router.get('/', (req, res) => {
  con.query("SELECT * FROM rounds ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Todays best
router.post('/', (req, res) => {
  var sql = "INSERT INTO rounds (player_id, score, level, date, ranked) VALUES ?";

  var dt = new Date();
  var date = dt.getFullYear() + "/" + (
  dt.getMonth() + 1) + "/" + dt.getDate() + "  " + dt.getHours() + "-" + dt.getMinutes() + "-" + dt.getSeconds();

  var values = [
    [req.body.id, req.body.score, req.body.level, date, req.body.ranked]
  ];
  console.log(values);
  con.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting row ' + err);
    res.send(result);
  });
});

module.exports = router;

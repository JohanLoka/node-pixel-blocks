const express = require('express');
const pool = require('../db');
const router = express.Router();

const todayDate = () => {
  var dt = new Date();
  var month = dt.getMonth() + 1;
  month = month >= 10
    ? month
    : "0" + month;

  var day = dt.getDate();
  day = day >= 10
    ? day
    : "0" + day;
  var date = dt.getFullYear() + "-" + month + "-" + day;
  return date;
};

//Get all players progress
router.get('/progression', (req, res) => {
  pool.query("SELECT *, players.username AS username FROM progress INNER JOIN players ON players.id=progress.player_id", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});


//Get rank for player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT *, (SELECT COUNT(DISTINCT(level_title)) FROM progress WHERE player_id=" + id + ") AS levels_completed FROM players WHERE id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all Ranks
router.get('/', (req, res) => {
  pool.query("SELECT *,  (SELECT COUNT(DISTINCT(level_title)) FROM progress WHERE progress.player_id=players.id) AS levels_completed FROM players", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Insert progress for player
router.post('/progress', (req, res) => {
  var sql = "INSERT INTO progress (player_id, level_title, deaths, time_spent, date_cleared) VALUES ?";
  var date = todayDate();
  var values = [
    [req.body.id, req.body.level, req.body.deaths, req.body.time_spent, date]
  ];
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting progress ' + err);
    res.send('Success inserting progress');
  });
});

module.exports = router;

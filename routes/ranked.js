const express = require('express');
const pool = require('../db');
const router = express.Router();

const todayDate = () => {
  var dt = new Date();
  var month = dt.getMonth() + 1;
  month = month >= 10 ?
    month :
    "0" + month;

  var day = dt.getDate();
  day = day >= 10 ?
    day :
    "0" + day;
  var date = dt.getFullYear() + "-" + month + "-" + day;
  return date;
};

//Get all Ranks
router.get('/', (req, res) => {
  pool.query("SELECT *,  (SELECT COUNT(progress.id) FROM progress WHERE progress.player_id=players.id) AS levels_completed FROM players", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get rank for player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT *, (SELECT COUNT(id) FROM progress WHERE player_id="+ id + ") AS levels_completed FROM players WHERE id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Update progress for player
router.post('/progress', (req, res) => {
  var sql = "INSERT INTO progress (player_id, level_title, deaths, time_spent, date_cleared) VALUES ?";

  var dt = new Date();
  var date = dt.getFullYear() + "/" + (
  dt.getMonth() + 1) + "/" + dt.getDate() + "  " + dt.getHours() + "-" + dt.getMinutes() + "-" + dt.getSeconds();

  var values = [
    [req.body.id, req.body.level, req.body.deaths, req.body.time_spent, date]
  ];
  console.log(values);
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting progress ' + err);
    res.send('Success inserting progress');
  });
});

module.exports = router;

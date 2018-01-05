const express = require('express');
const con = require('../db');
const router = express.Router();

//Get all Ranks
router.get('/', (req, res) => {
  pool.query("SELECT * FROM players", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get rank for player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM players WHERE id=" + id, function(err, result, fields) {
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

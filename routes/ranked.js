const express = require('express');
const pool = require('../db');
const router = express.Router();
const formatDate = require('../lib/date');


//Get all players progress
router.get('/progression', (req, res) => {
  pool.query("SELECT *, players.username AS username FROM progress INNER JOIN players ON players.id=progress.player_id", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});


//Get reward from rankings for specidif player
router.get('/rewards/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM rewards WHERE player_id= ?", [id], function(err, result, fields) {
    if (err)
      throw err;

    var rank = result.length > 0
      ? result[0].rank
      : 0;
    var players = result.length > 0
      ? result[0].segment
      : 0;
    var score = result.length > 0
      ? result[0].score
      : 0;
    var status = result.length > 0
      ? 'OK'
      : 'NO GAMES';

    if (result.length > 0) {
      status = result[0].claimed == 1
        ? 'ALLREADY_LOOTED'
        : status;
    }
    let resp = {
      rank,
      status,
      score,
      players
    };

    res.send(resp);
  });
});

//Get all rewards
router.get('/rewards', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM rewards", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get todays ranked map
router.get('/map', (req, res) => {
  pool.query("SELECT enemy_force AS map_id FROM map_settings WHERE map_name='DailyDungeon' LIMIT 1", function(err, result, fields) {
    if (err)
      throw err;
    res.send({map_id: result[0].map_id});
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

//Get all Players
router.get('/', (req, res) => {
  pool.query("SELECT *,  (SELECT COUNT(DISTINCT(level_title)) FROM progress WHERE progress.player_id=players.id) AS levels_completed FROM players", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Update rewards table
router.post("/rewards/update", (req, res) => {
  const id = req.body.id;
  var sql = "UPDATE rewards SET claimed= 1 WHERE player_id= ?";
  pool.query(sql, [id], function(err, result, fields) {
    if (err)
      res.send('error');
    res.send('ok');
  });
});

//Insert progress for player
router.post('/progress', (req, res) => {
  var sql = "INSERT INTO progress (player_id, level_title, deaths, time_spent, date_cleared) VALUES ?";
  var date = formatDate(new Date());
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

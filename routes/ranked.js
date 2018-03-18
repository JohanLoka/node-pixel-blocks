const express = require('express');
const pool = require('../db');
const router = express.Router();

const formatDate = (input) => {
  var dt = input;
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

//Get all players progress
router.get('/rewards/calculate', (req, res) => {

  //Clear old rewards
  pool.query("DELETE FROM rewards", function(err, result, fields) {

    var yester = new Date();
    yester.setDate(yester.getDate() - 1);
    const date = formatDate(yester);

    let arr = [];

    var sql = `SELECT rounds.player_id AS player_id, MAX(score) AS score, COUNT(DISTINCT(player_id)) AS count, players.username AS username FROM rounds
  INNER JOIN players ON players.id=rounds.player_id
  WHERE date='${date}' AND ranked='True' GROUP BY player_id ORDER BY score DESC`;

    //Calclulate reward
    pool.query(sql, function(err, result, fields) {
      if (err)
        throw err;
      let placement = 1;

      result.forEach(function(row) {
        const players = row.count;
        var newArr = {
          player_id: row.player_id,
          rank: placement,
          segment: players,
          score: row.score
        }
        arr.push(newArr);
        placement++;
      });
      //Insert into rewards table
      arr.forEach(function(row) {
        var sql = "INSERT INTO rewards (player_id, rank, claimed, segment,score) VALUES ?";
        var values = [
          [row.player_id, row.rank, false, row.segment, row.score]
        ];
        pool.query(sql, [values], function(err, result, fields) {
          console.log('Player inserted: ' + row.player_id);
        });
      });
      res.send('Records Inserted');
    });
  });
});

//Get reward from rankings for specidif player
router.get('/rewards/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM rewards WHERE player_id= ? AND claimed = 0", [id], function(err, result, fields) {
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

//Update rewards table
router.post("/rewards/:id", (req, res) => {
  var sql = "UPDATE rewards SET claimed= 1 WHERE player_id= ?";
  pool.query(sql, [req.params.id], function(err, result, fields) {
    if (err)
      res.send('error');
    res.send('ok');
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

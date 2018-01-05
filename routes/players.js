const express = require('express');
const pool = require('../db');
const router = express.Router();

//
router.get('/', (req, res) => {
  pool.query("SELECT * FROM players WHERE highscore > 0 ORDER BY highscore DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

router.get('/admin/rollback', (req, res) => {
  //Levels
  pool.query("SELECT MAX(score) AS best, id FROM players GROUP BY player_id", function(err, result, fields) {
    if (err)
      throw err;
    result.map(player => {
      var sql = `UPDATE players SET highscore=${player.best} WHERE id=${player.id}`;
      pool.query(sql, function(err, result, fields) {
        console.log('Success updating highscore');
      });
    });

  });

  pool.query("SELECT COUNT(DISTINCT(level_title)) AS levelsCleared, player_id FROM progress GROUP BY player_id", function(err, result, fields) {
    if (err)
      throw err;
    result.map(player => {
      var sql = `UPDATE players SET levels_completed=${player.levelsCleared} WHERE id=${player.player_id}`;

      pool.query(sql, function(err, result, fields) {
        console.log('Success updating levels');
      });
    });

  });
});

//Todays best
router.post('/update', (req, res) => {
  var dt = new Date();
  var date = dt.getFullYear() + "/" + (
  dt.getMonth() + 1) + "/" + dt.getDate() + "  " + dt.getHours() + "-" + dt.getMinutes() + "-" + dt.getSeconds();

  var sql = `UPDATE players SET highscore=${req.body.score} WHERE id=${req.body.id}`;

  pool.query(sql, function(err, result, fields) {
    if (err)
      res.send('Error');
    res.send('Success updating Hs');
  });
});

//Todays best
router.post('/create', (req, res) => {
  var values = [
    [req.body.username]
  ];
  pool.query("SELECT username FROM players WHERE username=?", [values], function(err, result, fields) {

    if (result.length > 0) {
      res.send('taken');
    } else {
      var sql = "INSERT INTO players (username, joined) VALUES ?";

      var dt = new Date();
      var date = dt.getFullYear() + "-" + (
      dt.getMonth() + 1) + "-" + dt.getDate() + "  " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

      var values = [
        [req.body.username, date]
      ];
      pool.query(sql, [values], function(err, result, fields) {
        if (err)
          throw err;
        res.send('' + result.insertId);
      });
    }
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM players WHERE id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;

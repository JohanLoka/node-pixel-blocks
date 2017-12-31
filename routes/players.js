const express = require('express');
const con = require('../db');
const router = express.Router();

//
router.get('/', (req, res) => {
  con.query("SELECT * FROM players WHERE highscore > 0 ORDER BY highscore DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

router.get('/admin/rollback', (req, res) => {
return;//For security
  //Levels
  con.query("SELECT COUNT(DISTINCT(level_title)) AS levelsCleared, player_id FROM progress GROUP BY player_id", function(err, result, fields) {
    if (err)
      throw err;
    result.map(player => {
      var sql = `UPDATE players SET levels_completed=${player.levelsCleared} WHERE id=${player.player_id}`;

      con.query(sql, function(err, result, fields) {
        res.send('Success updating levels');
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

  con.query(sql, function(err, result, fields) {
    if (err)
      res.send('Error');
    res.send('Success updating Hs');
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM players WHERE id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;

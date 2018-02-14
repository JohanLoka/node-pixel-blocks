const express = require('express');
const pool = require('../db');
const router = express.Router();

//
//

//Todays best
router.patch('/settings/:id', (req, res) => {
    const id = `'${req.params.id}'`;
  var sql = "UPDATE map_settings SET enemy_force= ? WHERE id="+ id;

  var values = [
    [req.body.enemy_force]
  ];
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send(err);
    res.send(result);
  });
});

router.get('/settings/:id', (req, res) => {
  const id = `'${req.params.id}'`;
  pool.query("SELECT * FROM map_settings WHERE map_name=" + id, function(err, result, fields) {
    if (err)
      throw err;

    var items = [];
    var arr = [];
    result.forEach(function(row) {
      var newarr = {
        id: row.id,
        map_name: row.map_name,
        enemy_force: row.enemy_force,
        max_crates: row.max_crates,
        reward_crystals: row.reward_crystals
      }
      arr.push(newarr);
    });
    items['items'] = arr;
    res.send(arr);
  });
});

router.get('/waves/:id', (req, res) => {
  const id = `'${req.params.id}'`;
  pool.query("SELECT * FROM map_waves WHERE map_name=" + id, function(err, result, fields) {
    if (err)
      throw err;

    var items = [];
    var arr = [];
    result.forEach(function(row) {
      var newarr = {
        id: row.id,
        map_name: row.map_name,
        score_to_advance: row.score_to_advance,
        enemy_count: row.enemy_count,
        medium_count: row.medium_count,
        miniboss_count: row.miniboss_count,
        boss_count: row.boss_count
      }
      arr.push(newarr);
    });
    items['items'] = arr;
    res.send(items['items']);
  });
});

router.get('/', (req, res) => {
  pool.query("SELECT * FROM map_settings", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;

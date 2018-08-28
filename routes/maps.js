const express = require('express');
const pool = require('../db');
const router = express.Router();
const { today } = require('../lib/date');


//Update settings
router.post('/waves', (req, res) => {
  var sql = "INSERT INTO map_waves (map_name) VALUES ?";

  const values = [
    [req.body.map_name]
  ];
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Update settings
router.patch('/settings/:id', (req, res) => {
  const id = `'${req.params.id}'`;
  var sql = "UPDATE map_settings SET enemy_force= ? WHERE id=" + id;

  const values = [
    [req.body.enemy_force]
  ];
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Update enemy count
router.patch('/waves/:id', (req, res) => {
  const id = `${req.params.id}`;
  var sql = `UPDATE map_waves SET score_to_advance = ${req.body.score_to_advance}, enemy_count= ${req.body.enemy_count}, medium_count= ${req.body.medium_count}, miniboss_count= ${req.body.miniboss_count}, boss_count= ${req.body.boss_count} WHERE id=${id}`;
  pool.query(sql, function(err, result, fields) {
    res.send(result);
  });
});

//Used for ingame data getting
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

//Used for ingame data getting
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
        boss_count: row.boss_count,
        increase_difficulty: row.increase_difficulty
      }
      arr.push(newarr);
    });
    items['items'] = arr;
    res.send(items['items']);
  });
});

//Get all waves
router.get('/waves', (req, res) => {
  pool.query("SELECT * FROM map_waves", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all maps with settings
router.get('/', (req, res) => {
  pool.query("SELECT * FROM map_settings", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;

const express = require('express');
const pool = require('../db');
const bodyParser = require('body-parser');
const router = express.Router();

const app = require('../app');

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
//Todays best player
router.get('/todays', (req, res) => {

  const today = todayDate();

  var sql = `SELECT score, players.username AS username FROM rounds INNER JOIN players ON players.id=rounds.player_id WHERE date='${today}' AND ranked='True' ORDER BY score DESC LIMIT 1`;
  pool.query(sql, function(err, result, fields) {
    if (err)
      throw err;
    var items = [];
    var arr = [];
    result.forEach(function(row) {
      var newarr = {
        username: row.username,
        score: row.score
      }
      arr.push(newarr);
    });

    items['items'] = arr;
    console.log(arr[0]);
    res.send(arr[0]);
  });
});

//Players best today
router.get('/todays/:id', (req, res) => {
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

  var sql = `SELECT score, players.username AS username FROM rounds INNER JOIN players ON players.id=rounds.player_id WHERE date='${date}' AND ranked='True' AND rounds.player_id=${req.params.id} ORDER BY score DESC LIMIT 1`;
  pool.query(sql, function(err, result, fields) {
    if (err)
      throw err;
    var items = [];
    var arr = [];
    result.forEach(function(row) {
      var newarr = {
        username: row.username,
        score: row.score
      }
      arr.push(newarr);
    });

    items['items'] = arr;
    console.log(arr[0]);
    res.send(arr[0]);
  });
});

//Get all rounds for this player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM rounds WHERE player_id=" + id + " ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all
router.get('/', (req, res) => {

  pool.query("SELECT * FROM rounds ORDER BY id DESC", function(err, result, fields) {
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
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting row ' + err);
    res.send(result);
  });
});

module.exports = router;

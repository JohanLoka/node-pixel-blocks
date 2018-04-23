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


//Todays best player
router.get('/todays/top', (req, res) => {
  const date = todayDate();

  var sql = `SELECT player_id, MAX(score) AS score, players.username AS username FROM rounds INNER JOIN players ON players.id=rounds.player_id WHERE date='${date}' AND ranked='True' GROUP BY player_id ORDER BY score DESC LIMIT 5`;
  pool.query(sql, function(err, result, fields) {
    if (err)
      throw err;

    var items = [];
    var arr = [];
    result.forEach(function(row) {
      var newarr = {
        username: row.username,
        score: row.score,
        count: 0
      }
      arr.push(newarr);
    });

    items['items'] = arr;
    res.send(arr);
  });
});

//Todays best player
router.get('/todays', (req, res) => {
  const date = todayDate();

  var sql = `SELECT score, players.username AS username FROM rounds INNER JOIN players ON players.id=rounds.player_id WHERE date='${date}' AND ranked='True' ORDER BY score DESC LIMIT 1`;
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
    res.send(arr[0]);
  });
});
const getYesterdaysDate = () => {
    var date = new Date();
    date.setDate(date.getDate()-1);
    return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
};

//Todays best player
router.get('/yesterday', (req, res) => {

  var yester = new Date();
  yester.setDate(yester.getDate()-1);

  const date = formatDate(yester);

  var sql = `SELECT score, players.username AS username FROM rounds INNER JOIN players ON players.id=rounds.player_id WHERE date='${date}' AND ranked='True' ORDER BY score DESC LIMIT 1`;
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
    res.send(arr[0]);
  });
});

//Top players all time
router.get('/toplist/today', (req, res) => {
  var date = todayDate();

  var sql = `SELECT MAX(score) AS score, players.username AS username, SUBSTRING(rounds.date,1,10) AS date FROM rounds INNER JOIN players ON players.id=rounds.player_id WHERE rounds.date='${date}' GROUP BY username ORDER BY score DESC LIMIT 5`;
  pool.query(sql, function(err, result, fields) {
    res.send(result);
  });
});

//Top players all time
router.get('/toplist', (req, res) => {
  var sql = `SELECT MAX(score) AS score, players.username AS username, SUBSTRING(rounds.date,1,10) AS date FROM rounds INNER JOIN players ON players.id=rounds.player_id WHERE ranked='True' GROUP BY username ORDER BY score DESC LIMIT 5`;
  pool.query(sql, function(err, result, fields) {
    res.send(result);
  });
});

//Players best today
router.get('/todays/:id', (req, res) => {
  const date = todayDate();

  var sql = `SELECT score, players.username AS username FROM rounds INNER JOIN players ON players.id=rounds.player_id WHERE date='${date}' AND ranked='True' AND rounds.player_id=${req.params.id} ORDER BY score`;
  pool.query(sql, function(err, result, fields) {
    if (err)
      throw err;

    var items = [];
    var arr = [];
    if (result.length > 0) {
      var newarr = {
        username: result[0].username,
        score: result[0].score,
        count: result.length
      };
    } else {
      var newarr = {
        username: "NO_GAMES",
        score: 0,
        count: 0
      };
    }
    arr.push(newarr);
    items['items'] = arr;
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

  const date = todayDate();

  var values = [
    [req.body.id, req.body.score, req.body.level, date, req.body.ranked]
  ];
  pool.query(sql, [values], function(err, result, fields) {
    res.send(result);
  });
});

module.exports = router;

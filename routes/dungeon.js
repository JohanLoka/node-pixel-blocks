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

const getYesterdaysDate = () => {
    var date = new Date();
    date.setDate(date.getDate()-1);
    return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
};

//Get all rounds for this player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM dungeon WHERE player_id=" + id + " ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all
router.get('/', (req, res) => {
  pool.query("SELECT * FROM dungeon ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Todays best
router.post('/', (req, res) => {
  var sql = "INSERT INTO dungeon (player_id, floor, level, date, tier) VALUES ?";

  const date = todayDate();

  var values = [
    [req.body.id, req.body.floor, req.body.level, date, req.body.tier]
  ];
  pool.query(sql, [values], function(err, result, fields) {
    res.send(result);
  });
});

module.exports = router;

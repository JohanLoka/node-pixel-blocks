const express = require('express');
const pool = require('../db');
const router = express.Router();
const { today } = require('../lib/date');

//Get all events
router.get('/', (req, res) => {
  pool.query("SELECT * FROM events ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Update progress for player
router.post('/', (req, res) => {
  var sql = "INSERT INTO events (player_id, event_type, event_value, event_date) VALUES ?";

  var values = [
    [req.body.id, req.body.event_type, req.body.event_value, today]
  ];
  console.log(values);
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting event ' + err);
    res.send('Success inserting event');
  });
});

router.get('/daily/:id', (req, res) => {
  const id = req.params.id;

  var sql = `SELECT player_id FROM daily WHERE date='${today}' AND player_id=` + req.params.id;
  pool.query(sql, function(err, result, fields) {
    var resp = result.length > 0
      ? 'ALLREADY_LOOTED'
      : 'NO_GAMES';
    res.send(resp);
  });
});

//Update progress for player
router.post('/daily', (req, res) => {
  var sql = "INSERT INTO daily (player_id, rank, date) VALUES ?";

  var values = [
    [req.body.id, req.body.rank, today]
  ];
  console.log(values);
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting daily ' + err);
    res.send('Success inserting daily');
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM events WHERE player_id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;

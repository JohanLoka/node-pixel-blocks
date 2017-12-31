const express = require('express');
const con = require('../db');
const router = express.Router();

//
router.get('/', (req, res) => {
  con.query("SELECT * FROM events ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Update progress for player
router.post('/', (req, res) => {
  var sql = "INSERT INTO events (player_id, event_type, event_value, event_date) VALUES ?";

  var dt = new Date();
  var date = dt.getFullYear() + "/" + (
  dt.getMonth() + 1) + "/" + dt.getDate() + "  " + dt.getHours() + "-" + dt.getMinutes() + "-" + dt.getSeconds();

  var values = [
    [req.body.id, req.body.event_type, req.body.event_value, date]
  ];
  console.log(values);
  con.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting event ' + err);
    res.send('Success inserting event');
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM events WHERE player_id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;

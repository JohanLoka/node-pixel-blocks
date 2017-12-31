const express = require('express');
const con = require('../db');
const router = express.Router();

//
router.get('/settings/:id', (req, res) => {
    const id = "" +req.params.id;
  con.query("SELECT * FROM map_settings WHERE map_name=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});


router.get('/waves/:id', (req, res) => {
    const id = `'${req.params.id}'`;
  con.query("SELECT * FROM map_waves WHERE map_name=" + id, function(err, result, fields) {
    if (err)
      throw err;

    res.send(result);
  });
});

module.exports = router;

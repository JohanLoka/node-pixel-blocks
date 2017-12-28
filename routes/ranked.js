const express = require('express');
const con = require('../db');
const router = express.Router();

// Projects Route
router.get('/', (req, res) => {
  con.query("SELECT * FROM projects", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM projects WHERE id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;

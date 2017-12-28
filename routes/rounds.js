const express = require('express');
const con = require('../db');
const bodyParser = require('body-parser');
const router = express.Router();

const app = express();
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Get all
router.get('/', (req, res) => {
  con.query("SELECT * FROM rounds ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Get all rounds for this player
router.get('/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM rounds WHERE player_id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Todays best
router.get('/todays', (req, res) => {
  //con.query("SELECT score, player_id, level, players.username FROM rounds INNER JOIN players ON players.id = rounds.player_id ORDER BY rounds.id DESC LIMIT 1", function(err, result, fields) {
  con.query("SELECT * FROM rounds ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Todays best
router.post('/', (req, res) => {

  var sql = "INSERT INTO rounds (player_id, score, level, date, ranked) VALUES ?";
  var values = [
    [5284, 13, "Ranked_1", "2017-12-28", "True"]
  ];
  con.query(sql, [values]);
});

module.exports = router;

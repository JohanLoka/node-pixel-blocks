const express = require('express');
const pool = require('./db');
const router = express.Router();

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

//Clear old rewards
pool.query("DELETE FROM rewards", function(err, result, fields) {

  var yester = new Date();
  yester.setDate(yester.getDate() - 1);
  const date = formatDate(yester);

  let arr = [];

  var sql = `SELECT rounds.player_id AS player_id, MAX(score) AS score, COUNT(DISTINCT(player_id)) AS count, players.username AS username FROM rounds
INNER JOIN players ON players.id=rounds.player_id
WHERE date='${date}' AND ranked='True' GROUP BY player_id ORDER BY score DESC`;

  //Calclulate reward
  pool.query(sql, function(err, result, fields) {
    if (err)
      throw err;
    let placement = 1;
    const players = result.length;

    result.forEach(function(row) {
      var newArr = {
        player_id: row.player_id,
        rank: placement,
        segment: players,
        score: row.score
      }
      arr.push(newArr);
      placement++;
    });
    //Insert into rewards table
    arr.forEach(function(row) {
      var sql = "INSERT INTO rewards (player_id, rank, claimed, segment,score) VALUES ?";
      var values = [
        [row.player_id, row.rank, false, row.segment, row.score]
      ];
      pool.query(sql, [values], function(err, result, fields) {
        console.log('Player inserted: ' + row.player_id);
      });
    });
    //res.send(players + ' records inserted');
  });
});

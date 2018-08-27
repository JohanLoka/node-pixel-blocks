const express = require("express");
const router = express.Router();
const pool = require("../db");

const {today, yesterday, sinceDays} = require("../lib/date");
const {
  scoreMax,
  score,
  select,
  joinName,
  groupBy,
  orderBy
} = require("../lib/querys");

//  Insert new round
router.post("/", (req, res) => {
  const {id, score, level, tier, seconds} = req.body;
  const values = [
    [
      id,
      score,
      level,
      tier,
      seconds,
      today
    ]
  ];
  const sql = 'INSERT INTO proc_rounds (player_id, score, level, tier, seconds, date) VALUES ?';

  pool.query(sql, [values], (err, result, fields) => {
    res.send(
      err
      ? 'error'
      : 'success');
  });
});

//  Get all rounds today
router.get("/today", (req, res) => {
  const sql = `SELECT ${score}, ${select} ${joinName} WHERE date = ? ${groupBy} ${orderBy}`;

  pool.query(sql, [today], (err, result, fields) => {
    const arr = result.map((row) => {
      return ({username: row.username, score: row.score, date: row.date});
    });

    let items = [];
    items['items'] = arr;
    res.send(items['items']);
  });
});

//  Get all rounds
router.get("/alltime", (req, res) => {
  const sql = `SELECT ${scoreMax}, ${select} ${joinName} ${groupBy} ${orderBy}`;

  pool.query(sql, [today], (err, result, fields) => {
    const arr = result.map((row) => {
      return ({username: row.username, score: row.score, date: row.date});
    });

    let items = [];
    items['items'] = arr;
    res.send(items['items']);
  });
});

//  Get all rounds today
router.get("/today/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT COUNT(player_id) AS count FROM proc_rounds WHERE player_id = ?`;

  pool.query(sql, [id], (err, result, fields) => {
    const count = result[0];
    res.send(count);
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();

const { query } = require("../lib/db");
const { today } = require("../lib/date");

//  Compile all Intro-data for player and send in bulk
router.get("/intro", (req, res) => {
  const sql = "SELECT * FROM proc_rounds ORDER BY id DESC";

  query(sql, [], result => {
    res.send(result);
  });
});

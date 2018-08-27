const scoreMax = 'MAX(proc_rounds.score) AS score';
const score = 'proc_rounds.score AS score';

const select = 'tier, level, seconds, date, players.username AS username FROM proc_rounds';
const joinName = 'INNER JOIN players ON players.id = proc_rounds.player_id';

const groupBy = 'GROUP BY username';
const orderBy = 'ORDER BY score DESC';

module.exports = {
  scoreMax,
  score,
  select,
  joinName,
  groupBy,
  orderBy
}

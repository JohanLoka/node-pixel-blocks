const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Routes
//const players = require('./routes/players');
const rounds = require('./routes/rounds');
//const ranked = require('./routes/ranked');
//const events = require('./routes/events');
//const maps = require('./routes/maps');

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if ('OPTIONS' === req.method) {
    res.send(204);
  } else {
    next();
  }
});

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
//app.use('/players', players);
app.use('/rounds', rounds);
//app.use('/ranked', ranked);
//app.use('/events', events);
//app.use('/maps', maps);

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node server is running on port ' + app.get('port'));
});

module.exports = app;

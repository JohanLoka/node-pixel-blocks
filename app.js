const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();


//Routes
const players = require('./routes/players');
const rounds = require('./routes/rounds');
const ranked = require('./routes/ranked');
const events = require('./routes/events');
const maps = require('./routes/maps');

app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use('/players', players);
app.use('/rounds', rounds);
app.use('/ranked', ranked);
app.use('/events', events);
app.use('/maps', maps);
const port = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});

module.exports = app;

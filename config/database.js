if (process.env.NODE_ENV === 'production') {
  module.exports = {
    connectionLimit : 100,
    host: "us-cdbr-iron-east-05.cleardb.net",
    user: "b5b3efd609fdb9",
    password: "47ef201f",
    database: "heroku_dc6bacb23343e74"
  }
} else {
  module.exports = {
    connectionLimit : 100,
    host: "localhost",
    user: "root",
    password: "",
    database: "pixelblocks"
  }
}

//mysql://b0641897008ce9:ba1be25e@us-cdbr-iron-east-05.cleardb.net/heroku_2239e301724fcc2?reconnect=true
//mysql://b5b3efd609fdb9:47ef201f@us-cdbr-iron-east-05.cleardb.net/heroku_dc6bacb23343e74?reconnect=true

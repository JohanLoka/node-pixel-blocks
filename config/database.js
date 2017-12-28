if (process.env.NODE_ENV === 'production') {
  module.exports = {
    host: "us-cdbr-iron-east-05.cleardb.net",
    user: "b0641897008ce9",
    password: "ba1be25e",
    database: "heroku_2239e301724fcc2"
  }
} else {
  module.exports = {
    host: "localhost",
    user: "root",
    password: "",
    database: "pixelblocks"
  }
}

//mysql://b0641897008ce9:ba1be25e@us-cdbr-iron-east-05.cleardb.net/heroku_2239e301724fcc2?reconnect=true

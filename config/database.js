if (process.env.NODE_ENV === 'production') {
  module.exports = {
    host: "mysql.domain99.com",
    user: "bloodybl",
    password: "8e8UukSo18",
    database: "bloodybl_wp"
  }
} else {
  module.exports = {
    host: "localhost",
    user: "root",
    password: "",
    database: "pixelblocks"
  }
}

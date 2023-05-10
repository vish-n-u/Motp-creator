const DB_URL = require("./db.config");

if (process.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}

PORT = process.env.port;
ORIGIN = process.env.ORIGIN;
DB_URL 
module.exports = {PORT,ORIGIN};

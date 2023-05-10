const express = require("express");
const app = express();
const cors = require("cors");
const { PORT, ORIGIN } = require("./config/server.config");
const mongoose = require("mongoose");
const DB_URL = require("./config/db.config");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: ORIGIN,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow these methods
  allowedHeaders: ["Content-Type"], // allow these headers
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.status(200).send("Successfully created!");
});

async function connectDb() {
  const conn = await mongoose.connect(DB_URL);
  const db = mongoose.connection;
  db.on("error", () => {
    console.log("#### Error while connecting to mongoDB ####");
  });
  db.once("open", () => {
    console.log("#### Connected to mongoDB ####");
  });

  require("./route/otp.route")(app);
  app.listen(PORT, () => {
    console.log("reached");
  });
}

connectDb();

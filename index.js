const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const userRouter = require("./routes/trello-router");

const app = express();
const apiPort = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://clonetrello.s3-website.ap-northeast-2.amazonaws.com"],
    method: ["*"],
    credentials: true
  })
);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", userRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));

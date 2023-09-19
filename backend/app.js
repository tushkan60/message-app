const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose").default;
const dotenv = require("dotenv");
const postsRoutes = require("./routes/postsRoutes");

const app = express();
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

async function main() {
  await mongoose.connect(DB);
}

main()
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => console.log(err));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB!");
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept",
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;

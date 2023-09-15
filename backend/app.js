const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

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

app.post("/api/posts", (req, res, next) => {
  const post = req.body;

  console.log(post);

  res.status(201).json({
    message: "posts added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "123",
      title: "post 1",
      content: "this is a 1 post",
    },
    {
      id: "124",
      title: "post 2",
      content: "this is a 2 post",
    },
  ];
  res.status(200).json({
    message: "posts fetched successfully",
    posts,
  });
});

module.exports = app;

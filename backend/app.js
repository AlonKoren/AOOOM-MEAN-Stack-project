const express = require('express');

const app = express();

app.use((req,res,next) => {
  console.log("1");
  next();
});

app.use((req,res,next) => {
  res.send('hello from alon');
});

module.exports = app;

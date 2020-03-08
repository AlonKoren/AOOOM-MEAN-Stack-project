const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");

const app = express();

mongoose.connect("mongodb+srv://alon:bomSeALXCrJOrbkW@cluster0-ypci1.mongodb.net/node-angular?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=>{
    console.log("Connected to database!")
  })
  .catch(()=>{
    console.log("Connected failed!")
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;

// alon
// bomSeALXCrJOrbkW
// mongodb+srv://alon:<password>@cluster0-ypci1.mongodb.net/test?retryWrites=true&w=majority

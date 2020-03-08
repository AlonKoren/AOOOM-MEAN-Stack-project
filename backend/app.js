const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://alon:bomSeALXCrJOrbkW@cluster0-ypci1.mongodb.net/test?retryWrites=true&w=majority",
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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// alon
// bomSeALXCrJOrbkW
// mongodb+srv://alon:<password>@cluster0-ypci1.mongodb.net/test?retryWrites=true&w=majority

app.post('/api/posts',(req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  console.log(post);
  res.status(201).json({
    message: 'Post added successfully!',
  });
});

app.get('/api/posts',(req,res,next) => {
  const posts = [
    {
      id:'fadf12421l',
      title:'First server-side post',
      content: 'This is coming from the server'
    },
    {
      id:'kadf12421l',
      title:'Second server-side post',
      content: 'This is coming from the server!'
    },
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts,
  });
});

module.exports = app;

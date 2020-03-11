const express = require("express");
const multer = require("multer");

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, callback)=>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = null;
    if (!isValid){
      err = new Error("Invalid mime type");
    }
   callback(err,"backend/images");
  },
  filename :(req, file, callback)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  },
});

router.post("", checkAuth, multer({storage: storage}).single("image"),(req,res,next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath:url + "/images/"+req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost =>{
    res.status(201).json({
      message: 'Post added successfully!',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
      }
    });
  });
});

router.put("/:id", checkAuth, multer({storage: storage}).single("image"),(req,res,next) => {
  let imagePath = req.body.imagePath;
  if (req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/"+req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
  });
  Post.updateOne({_id: req.params.id},post).then(result =>{
    res.status(200).json({
      message: 'Update successful!',
    });
  });
});

router.get("",(req,res,next) => {
  const pagesize = +req.query.pagesize;
  const currentpage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pagesize && currentpage){
    postQuery
      .skip(pagesize * (currentpage - 1))
      .limit(pagesize);
  }

  postQuery
    .then((documents)=>{
      fetchedPosts = documents;
      return Post.count();
    }).then(count =>{
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    });

});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post)=>{
      if (post){
        res.status(200).json(post);
      }else {
        res.status(404).json({
          message: 'Post not found!',
        });
      }
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;

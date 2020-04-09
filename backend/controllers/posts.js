const Post = require('../models/post');
const Comment = require("../models/comment");

const {
  CountMinSketch
} = require('bloom-filters')

exports.sketch = sketch = new CountMinSketch(0.001, 0.99);

//creat post function
exports.createPost = (req,res,next) => {
  const url = req.protocol + "://" + req.get("host");
  sketch.update('create');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath:url + "/images/"+req.file.filename,
    creator: req.userData.userId,
    userName: req.userData.email.split('@')[0],
    postDate: new Date(),
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });
  post.save().then(createdPost =>{
    res.status(201).json({
      message: 'Post added successfully!',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
        userName: createdPost.userName,
        postDate: createdPost.postDate,
        latitude: createdPost.latitude,
        longitude: createdPost.longitude
      }
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

//update post function
exports.updatePost = (req,res,next) => {
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
    creator: req.userData.userId,
    userName: req.userData.email.split('@')[0],
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId },post).then(result =>{
    if(result.n > 0) {
      res.status(200).json({
        message: 'Update successful!',
      });
    }else{
      res.status(401).json({
        message: 'Not authorized!',
      });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post!"
      });
    });
};

exports.getPosts = (req,res,next) => {
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
      let sketchs = [];
      for (let post of fetchedPosts){
        const count = sketch.count(`post:${post._id}`);
        sketchs.push({
          key : post._id,
          count : count
        });
      }
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count,
        sketchs:sketchs,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        const count = sketch.count(`post:${req.params.postId}`);
        res.status(200).json({
          post : post,
          count : count,
        });
      } else {
        res.status(404).json({
          message: 'Post not found!',
        });
      }
    }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if (result.n > 0) {
      sketch.update('delete');
      res.status(200).json({
        message: "Post deleted!"
      });
    } else {
      res.status(401).json({
        message: 'Not authorized!',
      });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });

  //delete the comments of the post
  Comment.deleteMany({
    postId: req.params.id,
  }).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Comment successful!"
      });
    }
  }).catch(error => {
  });
};

exports.getAllPosts = (req, res, next) => {

  const postQuery = Post.find();
  let fetchedPosts;
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    }).catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
};

//return the sketch counter
exports.getCMS = (req, res, next) => {
  doc = [sketch.count('create'), doc = sketch.count('delete')];
  return res.status(200).json({ doc });
};

//group by of the posts creator to d3 graph
exports.getpostCreatorD3 = (req, res, next) => {
  Post.aggregate([{
    "$group": {
      _id: "$userName",
      count: {
        $sum: 1
      }
    }
  }]).then(docs => {
    return res.status(200).json({ docs });
  })
};

//group by of the posts title to d3 graph
exports.getpostTitleD3 = (req, res, next) => {
  Post.aggregate([{
    "$group": {
      _id: "$title",
      count: {
        $sum: 1
      }
    }
  }]).then(docs => {
    return res.status(200).json({ docs });
  })
};

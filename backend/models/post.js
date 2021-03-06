const mongoose = require('mongoose');
const postScheme = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    red: "User",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  postDate: {
    type: Date,
    required: true
  },
  latitude: {
    type: String,
    require: false
  },
  longitude: {
    type: String,
    require: false
  }
});
module.exports = mongoose.model('Post', postScheme);

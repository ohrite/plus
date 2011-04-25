var mongoose = require("mongoose");
var sys = require("sys");

var Images = new mongoose.Schema({
  created     : { type: Date, default: Date.now, index: true },
  modified    : { type: Date, default: Date.now },
  type        : { type: String },
  filename    : { type: String },
  size        : { type: Number },
  path        : { type: String },
  name        : { type: String, default: 'Untitled Image' }
});

var ImageGallery = new mongoose.Schema({
  created     : { type: Date, default: Date.now },
  updated     : { type: Date, default: Date.now, index: true },
  name        : { type: String, default: 'Untitled Gallery' },
  description : { type: String, default: '' },
  images      : [Images]
});

mongoose.model('ImageGallery', ImageGallery);

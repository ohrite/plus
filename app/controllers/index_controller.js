var actions = {},
    mongoose = require('mongoose'),
    ImageGallery = mongoose.model('ImageGallery');

actions.index = function(request, response) {
  ImageGallery.find({}, function(err, galleries) {
    response.render('index', {
      total: galleries.length
    })
  });
};

module.exports = actions;
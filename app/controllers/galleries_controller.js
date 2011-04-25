var actions = {},
    mongoose = require('mongoose'),
    ImageGallery = mongoose.model('ImageGallery');

actions.index = function(request, response){
  ImageGallery.find({}, function(err, galleries){
    response.send(galleries);
  });
};

actions.read = function(request, response){
  ImageGallery.findById(request.params.gallery_id, function(err, gallery) {
    response.send(err ? { error: err } : gallery);
  });
};

actions.update = function(request, response){
  var json = [];
  request.on('data', function(data) {
    json.push(data);
  });
  
  request.on('end', function() {
    json = JSON.parse(json.join(''));
  
    ImageGallery.findById(json._id, function(err, gallery) {
      var body;

      if (!gallery || err) {
         response.send({ error: err });
      } else {
        if (json.name !== gallery.name) {
          gallery.name = json.name;
          gallery.updated = new Date();
        }
        
        if (json.description !== gallery.description) {
          gallery.description = json.description;
          gallery.updated = new Date();
        }

        gallery.save(function(err) {
          response.send(err ? { error: err } : gallery);
        });
      }
    });
  });
};

module.exports = actions;
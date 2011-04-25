var actions = {},
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    ImageGallery = mongoose.model('ImageGallery'),
    formidable = require('formidable');

// POST /gallery/:gallery_id/image
actions.create = function(request, response, next) {
  var gallery = null,
      files = [],
      form,
      fileStream,
      content_type = request.headers['content-type'],
      target = path.join(Server.root, 'public', 'uploads');
  
  if (content_type.match(/multipart\/form-data/i)) {
    form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = target;
  
    // parse the request
    form.parse(request);
    form.addListener('file', function(file) {
      files.push(file);
    });

    form.addListener('end', function() {
      // identify and assign the gallery
      ImageGallery.findById(request.params.gallery_id, function(err, g) {
        gallery = g ? g : new ImageGallery();
      
        // jam each file onto the gallery
        _.each(files, function(file) {
          gallery.images.push({
            filename: file.name,
            size: file.size,
            path: path.join('uploads', file.name),
            type: file.type
          });
        });
      
        // attempt to save the gallery object
        gallery.save(function(err) {
          response.send(err ? { error: err } : { success: true });
        });
      });
    });
  
  // handle an octet stream (multipart fail)
  } else if (content_type.match(/application\/octet-stream/i)) {
    source = request.headers['x-file-name'];
    target = path.join(Server.root, 'public', 'uploads', source);
    fileStream = fs.createWriteStream(target);
    
    // handle an incoming data chunk
    request.on('data', function(chunk) {
      request.pause();
      fileStream.write(chunk);
      fileStream.on('drain', function() { request.resume(); });
    });
    
    request.on('end', function() {
      request.resume();
      fileStream.destroySoon();
      
      // identify and assign the gallery
      ImageGallery.findById(request.params.gallery_id, function(err, g) {
        gallery = g ? g : new ImageGallery();
    
        // jam each file onto the gallery
        gallery.images.push({
          filename: source,
          path: path.join('uploads', source)
        });
      
        // attempt to save the gallery object
        gallery.save(function(err) {
          response.send(err ? { error: err } : { success: true });
        });
      });
    });
    
    // handle a filestream error (eg out-of-space)
    fileStream.on('error', function(err){
      response.send({ error: err });
    });
  }
};

actions.read = function(request, response){
  ImageGallery.findById(request.params.gallery_id, function(err, gallery) {
    response.send(err ? { error: err } : _.select(gallery.images, function(image) {
      return image._id == request.params.gallery_id;
    }));
  });
};

actions.update = function(request, response){
  var json = [];
  
  request.on('data', function(data) {
    json.push(data);
  });
  
  request.on('end', function() {
    json = JSON.parse(json.join(''));
    
    ImageGallery.findById(request.params.gallery_id, function(err, gallery) {
      if (err) {
        response.send({ error: err })
      }
      
      var image = _.detect(gallery.images, function(image) {
        return image._id == request.params.image_id;
      });
      
      if (image) {
        if (json.name !== image.name) {
          image.name = json.name;
          image.updated = new Date();
        }

        gallery.save(function(err) {
          response.send(err ? { error: err } : image);
        });
      }
    });
  });
};

module.exports = actions;

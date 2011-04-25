(function(){
  var GalleryImage = Backbone.Model.extend({
    initialize: function(attrs) {
      this.id = attrs._id;
      if (!attrs || !attrs.name) {
        attrs = _.extend({ name: "Untitled" }, attrs);
      }
    },
    validate: function(attrs) {
      if (attrs.name) {
        if (!_.isString(attrs.name) || attrs.name.length === "0") {
          return "The gallery title cannot be empty.";
        }
      }
    }
  });
  
  var GalleryImageList = Backbone.Collection.extend({
    model: GalleryImage
  })
  
  var Gallery = Backbone.Model.extend({
    initialize: function(attrs) {
      this.id = attrs._id;
      if (!attrs || !attrs.name) {
        attrs = _.extend({ name: "Untitled" }, attrs);
      }
      _.forEach(this.attributes.images, function(image) {
        image.gallery = attrs._id;
      });
      this.attributes.images = new GalleryImageList(attrs.images);
      this.attributes.images.url = this.url() + '/images';
    },
    validate: function(attrs) {
      if (attrs.name) {
        if (!_.isString(attrs.name) || attrs.name.length === "0") {
          return "The gallery title cannot be empty.";
        }
      }
    }
  });
  
  var GalleryList = Backbone.Collection.extend({
    model: Gallery,
    url: '/galleries'
  });
  
  var IndexView = Backbone.View.extend({
    el: "#wrapper .home",
    galleryEl: "#gallery_container",
    template: _.template($('#featured-gallery-item').html()),
    galleryList: null,
    
    initialize: function(list) {
      var self = this;
      this.galleryList = list;
      this.galleryList.bind('all', function(){ self.render(); });
      this.galleryList.fetch();
      this.render();
    },
    render: function() {
      var self = this,
          items = this.galleryList.first(5);
      console.log('rendering index', items)
      $(this.galleryEl).html(items.map(this.template).join(''));
    },
    hide: function() {
      $(this.el).hide();
    },
    show: function() {
      $(this.el).show();
    }
  });
  
  var GalleryView = Backbone.View.extend({
    el: "#wrapper .gallery-view",
    uploadEl: "#wrapper .gallery-view .upload-area",
    galleryEl: "#wrapper .gallery-view .gallery-images",
    template: _.template($('#gallery-view').html()),
    imageTemplate: _.template($('#gallery-image-item').html()),
    gallery: null,
    
    events: {
      "change #wrapper .gallery-view h2 input": "name_changed",
      "change #wrapper .gallery-view h5 input": "description_changed"
    },
    
    initialize: function(gallery) {
      var self = this;
      this.gallery = gallery;
      this.gallery.bind('all', function(){ self.render(); });
      this.render();
    },
    name_changed: function(e) {
      this.gallery.set({ name: e.target.value });
      this.gallery.save();
    },
    description_changed: function(e) {
      this.gallery.set({ description: e.target.value });
      this.gallery.save();
    },
    render: function() {
      console.log('okay, so we render this view', this.gallery)
      $(this.el).html(this.template(this.gallery));
      $(this.galleryEl).html(this.gallery.get('images').map(this.imageTemplate).join(''));
      
      var uploader = new qq.FileUploader({
        element: $(this.uploadEl)[0],
        action: '/gallery/' + this.gallery.id + '/image'
      });
    }
  });
  
  var ImageView = Backbone.View.extend({
    el: "#wrapper .image-view",
    template: _.template($('#image-view').html()),
    image: null,
    
    events: {
      "change #wrapper .image-view h2 input": "name_changed"
    },
    
    initialize: function(image) {
      var self = this;
      this.image = image;
      this.image.bind('all', function(){ self.render(); });
      this.render();
    },
    name_changed: function(e) {
      this.image.set({ name: e.target.value });
      this.image.save();
    },
    render: function() {
      $(this.el).html(this.template(this.image));
    }
  });
  
  var PlusController = Backbone.Controller.extend({
    routes: {
      "": "index",
      "about": "about",
      "gallery/:id": "gallery",
      "gallery/:gallery_id/image/:image_id": "image"
    },
    
    indexView: null,
    currentView: null,
    galleryList: null,
    
    initialize: function() {
      this.galleryList = new GalleryList();
      this.indexView = new IndexView(this.galleryList);
    },
    _purge: function(){
      if (this.currentView) {
        $(this.currentView.el).empty();
        this.currentView = null;
      }
    },
    index: function() {
      this._purge();
      this.indexView.show();
    },
    about: function() {
      this.index();
      while(confirm("<blink>THIS IS A <marquee>WEB 2.0 HOME PAGE</marquee> ON THE <font size=3>INFORMATION SUPERHIGHWAY</blink> uncle jeff you should remove this before you upload it to angelfire")){}
    },
    gallery: function(id) {
      var self = this;
      this._purge();
      this.indexView.hide();
      
      this.galleryList.fetch({
        success: function(){
          self.currentView = new GalleryView(self.galleryList.get(id));
        }
      });
    },
    image: function(gallery_id, image_id) {
      var self = this;
      this._purge();
      this.indexView.hide();
      
      this.galleryList.fetch({
        success: function(){
          self.currentView = new ImageView(self.galleryList.get(gallery_id).get('images').get(image_id));
        }
      });
    }
  });
  
  $(function() {
    new PlusController();
    Backbone.history.start();
  });
})();
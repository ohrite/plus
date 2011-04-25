module.exports.setup = function(o){
  var sys = require("sys"),
      app = o.app,
      mongoose = o.mongoose,
      io = o.io,
      express = o.express;
  
  Server.paths = o.paths;
  
  global.db = mongoose.connect("mongodb://localhost/photo");
  
  require("./models.js").autoload(db);
  require("./controllers.js").autoload(app);
  require("./routes.js").draw(app);
  
  app.configure(function(){
  	app.set('view engine', o.view_engine);
    app.set('views', o.paths.views);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({ src: o.paths.root }));
    app.use(app.router);
    app.use(express.static(o.paths.root));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });

  app.configure('production', function(){
    app.use(express.errorHandler()); 
  });
  
  app.listen(o.port || 3000);
};
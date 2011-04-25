var Server = {},
    express = require("express"),
    path = require("path"),
    sys = require("sys"),
    application_root = __dirname,
    _ = require(path.join(application_root, 'lib', 'underscore'))._;

global._ = _;
global.Server = Server;
Server.root = application_root;
global.app = express.createServer();

Server.setup = require("./lib/setup.js").setup({
  view_engine: 'jade',
  app: app, 
  mongoose : require("mongoose"),
  express : express,
  paths : {
    root : path.join(application_root, "public"),
    views :  path.join(application_root, "app", "views"),
    controllers : path.join(application_root, "app", "controllers"),
    models : path.join(application_root, "app", "models"),
    uploads: path.join(application_root, "public", "uploads")
  }
});

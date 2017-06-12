var finalhandler = require('finalhandler');
var http = require('http');
var Router = require('router');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var parseUrl = require('parseurl');
var qs = require('qs');
var app = {};
var router = Router();
var env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'development';
// Getting configuration
var config = require('./config');

var authentication = require('./utility/authentication.js');
var mongoClient = require('./utility/mongoClient.js');
// Create mongodb Connection
var db = mongoClient.createConnection(config.mongo[env]);

app.db = db;
app.jwt = jwt;
app.config = config;

// Add a body parsing middleware to our API
router.use(bodyParser.json());

// Request parser
router.use(reqParser);

// Authentication for Each Route
router.use(function(req, res, next) {
  if(req.url == '/users/login' || req.url == '/users/register') {
    next();
  } else {
    if(req.headers && req.headers.authorization) {
      var token = req.headers.authorization;
      authentication.verifyAccessToken(app.jwt, token, config.jwt)
      .then(function() {
        next();
      })
      .catch(function(err) {
        res.statusCode = 401;
        next(err);
      }).done();
    } else {
      var err = new Error('Authorization header is not specified');
      res.statusCode = 401;
      next(err);
    }
  }
});

// Routes/Endpoints for products
require('./web/products.js')(router, app);

// Routes/Endpoints for users
require('./web/users.js')(router, app);

var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res))
});
var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log('Service listening on port ' + port + '!')
});

// Not Error handler
router.use(function (req, res, next) {
  var err = new Error('Not Found');
  res.statusCode = 404;
  next(err);
});

// Error handler
router.use(function (err, req, res, next) {
  if(res.statusCode === 200) {
    res.statusCode = 400;
  }
  res.end(err.toString());
});

function reqParser(req, res, next) {
  var val = parseUrl(req).query;
  var queryparse = qs.parse;
  req.query = queryparse(val);
  next();
}

module.exports.server = server;
module.exports.app = app;

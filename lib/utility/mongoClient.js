var mongoose = require('mongoose');

// Create Mongo Connection
module.exports.createConnection = function(config) {
  mongoose.connect('mongodb://' + config.host + '/' + config.db);

  // Set Schema differnt Collection
  var productSchema = require('./productSchema.js');
  var userSchema = require('./userSchema.js');
  mongoose.productModel = productSchema(mongoose);
  mongoose.userModel = userSchema(mongoose);

  return mongoose;
};


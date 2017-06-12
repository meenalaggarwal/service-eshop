var Q = require('q');

function createUserModel(mongoose) {
  var Schema = mongoose.Schema;

  // Schema of product
  var users = new Schema({
    username: String,
    password: String,
    email: String
  }, {
    versionKey: false
  });

  var userModel = mongoose.model('users', users);

  // Create a user
  userModel.create = function(data) {
    var deferred = Q.defer();
    var user = new userModel({
      username: data.username,
      password: data.password,
      email: data.email
    });
    user.save(function(err, user) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(user);
      }
    });
    return deferred.promise;
  };

  // search a product
  userModel.search = function(searchObject) {
    var deferred = Q.defer();
    userModel.find(searchObject, function(err, user) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(user);
      }
    });
    return deferred.promise;
  };

  return userModel;
}

module.exports = createUserModel;

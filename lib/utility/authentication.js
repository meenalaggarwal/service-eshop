var Q = require('q');

module.exports.getAccessToken = function(jwt, user, config) {
  var access_token = jwt.sign(user, config.secret, {});
  return access_token;
};

module.exports.verifyAccessToken = function(jwt, token, config) {
  var deferred = Q.defer();
  jwt.verify(token, config.secret, function(err, decode) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(decode);
    }
  });
  return deferred.promise;
};

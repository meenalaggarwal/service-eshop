var authentication = require('../utility/authentication.js');

module.exports = function(router, app) {
  router.post('/users/register', registerUser);
  router.post('/users/login', loginUser);

  function registerUser(req, res, next) {
    console.log('Entering registerUser function');
    if(req.body && req.body.username && req.body.password && req.body.email) {
      app.db.userModel.search({'username': req.body.username})
      .then(function(user) {
        if(user.length) {
          var err = new Error('User with username ' + req.body.username + ' is already registered');
          res.statusCode = 400;
          next(err);
        } else {
          app.db.userModel.create(req.body)
          .then(function(user) {
            res.end(JSON.stringify(user));
          }).catch(function(err) {
            next(err);
          }).done();
        }
      }).catch(function(err) {
        next(err);
      }).done();
    } else {
      var err = new Error('Required fields username, passowrd, email not specified');
      res.statusCode = 400;
      next(err);
    }
  }

  function loginUser(req, res, next) {
    console.log('Entering loginUser function');
    if(req.body && req.body.username && req.body.password) {
      app.db.userModel.search(req.body)
      .then(function(user) {
        if(user.length) {
          var token = {
            access_token: authentication.getAccessToken(app.jwt, user[0], app.config.jwt)
          };
          res.end(JSON.stringify(token));
        } else {
          var err = new Error('User is not registered')
          res.statusCode = 400;
          next(err);
        }
      }).catch(function(err) {
        next(err);
      }).done();
    } else {
      var err = new Error('Required fields username, passowrd, email not specified');
      res.statusCode = 400;
      next(err);
    }
  }
};


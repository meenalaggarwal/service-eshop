var server = require('../lib/server.js').server;
var app = require('../lib/server.js').app;
var request = require('supertest');
var uuid = require('uuid');
var authentication = require('../lib/utility/authentication.js');

describe('Route Testing', function () {
  this.timeout(25000);
  var testUser = 'test' + uuid();
  var token;
  before(function(done) {
    app.db.userModel.create({"username": testUser, "password": testUser, "email": testUser})
    .then(function(user) {
      token = authentication.getAccessToken(app.jwt, user, app.config.jwt)
      done();
    })
    .catch(function(err) {
      throw err;
    }).done();
  });

  describe('Users API', function () {

    describe('Register User', function() {
      it('Register User with Correct data', function (done) {
        function matchResponse(res) {
          if(!JSON.parse(res.text).username) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/register';
        var data = {
          username: 'test' + uuid(),
          password: 'test',
          email: 'test@gmail.com'
        };
        testRequest(server, endpoint, 'post', null, data, 200, matchResponse, done);
      });

      it('Register User without Username', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/register';
        var data = {
          password: 'test',
          email: 'test@gmail.com'
        };
        testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Register User without Password', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/register';
        var data = {
          username: 'test',
          email: 'test@gmail.com'
        };
        testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Register User without Email', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/register';
        var data = {
          username: 'test',
          password: 'test'
        };
        testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Register User without request data', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/register';
        var data = null;
        testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Register existing User', function (done) {
        var testUser = 'test' + uuid();
        app.db.userModel.create({"username": testUser, "password": testUser, "email": testUser})
        .then(function() {
          function matchResponse(res) {
            if(res.text && !res.text.startsWith('Error')) {
              throw new Error('Incorrect Information');
            }
          }
          var endpoint = '/users/register';
          var data = {
            username: testUser,
            password: testUser,
            email: testUser
          };
          testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
        })
        .catch(function(err) {
          throw err;
        }).done();
      });
    });

    describe('Login User', function() {

      it('Login User with Correct data', function (done) {
        function matchResponse(res) {
          if(!JSON.parse(res.text).access_token) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/login';
        var data = {
          username: testUser,
          password: testUser
        };
        testRequest(server, endpoint, 'post', null, data, 200, matchResponse, done);
      });

      it('Login User without Username', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/login';
        var data = {
          password: testUser
        };
        testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Login User without Password', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/login';
        var data = {
          username: testUser
        };
        testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Login User without request data', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/login';
        var data = null;
        testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
      });

      it('Login non existing User', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/users/register';
        var data = {
          username: testUser + '11',
          password: testUser
        };
        testRequest(server, endpoint, 'post', null, data, 400, matchResponse, done);
      });
    });
  });

  describe('Products API', function () {

    describe('Add Product', function() {

      it('Add Product with Correct data', function (done) {
        function matchResponse(res) {
          if(!JSON.parse(res.text).name) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products';
        var data = {
          "name": "printed top",
          "quantity": 1,
          "brand": "vero moda",
          "price": 100,
          "details": "designer",
          "category": "women",
          "color": "blue"
        };
        testRequest(server, endpoint, 'post', token, data, 200, matchResponse, done);
      });

      it('Add Product with Incorrect token', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('JsonWebTokenError')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products';
        var data = {
          "name": "printed top",
          "quantity": 1,
          "brand": "vero moda",
          "price": 100,
          "details": "designer",
          "category": "women",
          "color": "blue"
        };
        testRequest(server, endpoint, 'post', uuid(), data, 401, matchResponse, done);
      });
    });

    describe('Get Products', function() {
      before(function(done) {
        app.db.productModel.create({
          "name": "Solid top",
          "quantity": 1,
          "brand": "vero moda",
          "price": 100,
          "details": "designer",
          "category": "women",
          "color": "white"
        })
        .then(function(product) {
          done();
        }).catch(function(err) {
          throw err;
        }).done();
      });

      it('Get Products with correct token', function (done) {
        function matchResponse(res) {
          if(JSON.parse(res.text).length <= 0) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products';
        testRequest(server, endpoint, 'get', token, null, 200, matchResponse, done);
      });

      it('Get Products with Incorrect token', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('JsonWebTokenError')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products';
        testRequest(server, endpoint, 'get', uuid(), null, 401, matchResponse, done);
      });

      it('Get Products with search query', function (done) {
        function matchResponse(res) {
          if(JSON.parse(res.text).length <= 0) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products?search=category:women';
        testRequest(server, endpoint, 'get', token, null, 200, matchResponse, done);
      });

      it('Get Products with wrong search query', function (done) {
        function matchResponse(res) {
          if(JSON.parse(res.text).length > 0) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products?search=category:incorrectdata';
        testRequest(server, endpoint, 'get', token, null, 200, matchResponse, done);
      });
    });

    describe('Get a Product', function() {
      var productid;
      before(function(done) {
        app.db.productModel.create({
          "name": "Solid top",
          "quantity": 1,
          "brand": "vero moda",
          "price": 100,
          "details": "designer",
          "category": "women",
          "color": "white"
        })
        .then(function(product) {
          productid = product._id;
          done();
        }).catch(function(err) {
          throw err;
        }).done();
      });

      it('Get a Product with correct id', function (done) {
        function matchResponse(res) {
          if(res.text && res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + productid;
        testRequest(server, endpoint, 'get', token, null, 200, matchResponse, done);
      });

      it('Get a Product with incorrect id', function (done) {
        function matchResponse(res) {
          console.log('*******************')
          console.log(res.text)
          if(res.text && !res.text.includes('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + uuid();
        testRequest(server, endpoint, 'get', token, null, 400, matchResponse, done);
      });

      it('Get a Product with incorrect token', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('JsonWebTokenError')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + productid;
        testRequest(server, endpoint, 'get', uuid(), null, 401, matchResponse, done);
      });
    });

    describe('Update a Product', function() {
      var productid;
      before(function(done) {
        app.db.productModel.create({
          "name": "Solid top",
          "quantity": 1,
          "brand": "vero moda",
          "price": 100,
          "details": "designer",
          "category": "women",
          "color": "white"
        })
        .then(function(product) {
          productid = product._id;
          done();
        }).catch(function(err) {
          throw err;
        }).done();
      });

      it('Update Product with correct id', function (done) {
        function matchResponse(res) {
          if(res.text && res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + productid;
        var data = {
          color: "blue"
        };
        testRequest(server, endpoint, 'put', token, data, 200, matchResponse, done);
      });

      it('Update Product with incorrect id', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.includes('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + uuid();
        var data = {
          color: "blue"
        };
        testRequest(server, endpoint, 'put', token, data, 400, matchResponse, done);
      });

      it('Update Product with incorrect token', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('JsonWebTokenError')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + productid;
        var data = {
          color: "blue"
        };
        testRequest(server, endpoint, 'put', uuid(), data, 401, matchResponse, done);
      });
    });

    describe('Delete a Product', function() {
      var productid;
      before(function(done) {
        app.db.productModel.create({
          "name": "Solid top",
          "quantity": 1,
          "brand": "vero moda",
          "price": 100,
          "details": "designer",
          "category": "women",
          "color": "white"
        })
        .then(function(product) {
          productid = product._id;
          done();
        }).catch(function(err) {
          throw err;
        }).done();
      });

      it('Delete Product with correct id', function (done) {
        function matchResponse(res) {
          if(res.text && res.text.startsWith('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + productid;
        testRequest(server, endpoint, 'delete', token, null, 204, matchResponse, done);
      });

      it('Delete Product with incorrect id', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.includes('Error')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + uuid();
        testRequest(server, endpoint, 'delete', token, null, 400, matchResponse, done);
      });

      it('Delete Product with incorrect token', function (done) {
        function matchResponse(res) {
          if(res.text && !res.text.startsWith('JsonWebTokenError')) {
            throw new Error('Incorrect Information');
          }
        }
        var endpoint = '/products/' + productid;
        testRequest(server, endpoint, 'delete', uuid(), null, 401, matchResponse, done);
      });
    });
  });
});

function testRequest(server, endpoint, method, token, body,
 responseCode, matchResponse, done)
{
  if(matchResponse == null) { matchResponse = function() {}; }
  request(server)[method](endpoint)
  .set('Authorization', token).send(body)
  .expect(responseCode)
  .expect(matchResponse)
  .end(function(err) {
    if(err) { return done(err); }
    done();
  });
};

module.exports = function(router, app) {

  router.post('/products', addProduct);
  router.get('/products', getProducts);
  router.get('/products/:productid', getProduct);
  router.put('/products/:productid', updateProduct);
  router.delete('/products/:productid', deleteProduct);

  function addProduct(req, res, next) {
    console.log('Entering addProduct function');
    app.db.productModel.create(req.body)
    .then(function(product) {
      res.end(JSON.stringify(product));
    }).catch(function(err) {
      next(err);
    }).done();
  }

  function getProducts(req, res, next) {
    console.log('Entering getProducts function');
    var searchObj = {};
    if(req.query && req.query.search) {
      var searchFields = req.query.search.split(',');
      if(searchFields) {
        for(var i in searchFields) {
          if(searchFields[i].split(':').length === 2)
            searchObj[searchFields[i].split(':')[0]] = searchFields[i].split(':')[1];
        }
      } else {
        if(req.query.search.split(':').length === 2)
          searchObj[req.query.search.split(':')[0]] = req.query.search.split(':')[1];
      }
    }
    app.db.productModel.search(null, searchObj)
    .then(function(product) {
      res.end(JSON.stringify(product));
    }).catch(function(err) {
      next(err);
    }).done();
  }

  function getProduct(req, res, next) {
    console.log('Entering getProduct function');
    app.db.productModel.search(req.params.productid)
    .then(function(product) {
      if(product) {
        res.end(JSON.stringify(product));
      } else {
        var err = new Error('Product with productid: ' + req.params.productid + ' doesnt exists');
        next(err);
      }
    }).catch(function(err) {
      next(err);
    }).done();
  }

  function updateProduct(req, res, next) {
    console.log('Entering updateProduct function');
    app.db.productModel.edit(req.params.productid, req.body)
    .then(function(product) {
      if(product) {
        res.end(JSON.stringify(product));
      } else {
        var err = new Error('Product with productid: ' + req.params.productid + ' doesnt exists');
        next(err);
      }
    }).catch(function(err) {
      next(err);
    }).done();
  }

  function deleteProduct(req, res, next) {
    console.log('Entering deleteProduct function');
    app.db.productModel.delete(req.params.productid)
    .then(function() {
      res.statusCode = 204;
      res.end();
    }).catch(function(err) {
      next(err);
    }).done();
  }
};

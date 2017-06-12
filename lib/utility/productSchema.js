var Q = require('q');

function createProductModel(mongoose) {
  var Schema = mongoose.Schema;

  // Schema of product
  var products = new Schema({
    name: String,
    quantity: Number,
    brand: String,
    price: Number,
    details: String,
    category: String,
    color: String,
    sizeAvail: []
  }, {
    versionKey: false
  });

  var productModel = mongoose.model('products', products);

  // Create a product
  productModel.create = function(data) {
    var deferred = Q.defer();
    var product = new productModel({
      name: data.name,
      quantity: data.quantity,
      brand: data.brand,
      price: data.price,
      details: data.details,
      category: data.category,
      color: data.color,
      sizeAvail: data.sizeAvail
    });
    product.save(function(err, product) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(product);
      }
    });
    return deferred.promise;
  };

  // Delete a product
  productModel.delete = function(productId) {
    var deferred = Q.defer();
    productModel.remove({_id: productId}, function(err, product) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(product);
      }
    });
    return deferred.promise;
  };

  // search a product
  productModel.search = function(productId, searchObject) {
    var deferred = Q.defer();
    if(productId) {
      productModel.findById(productId, function(err, product) {
        if(err) {
          deferred.reject(err);
        } else {
          deferred.resolve(product);
        }
      });
    } else {
      productModel.find(searchObject, function(err, product) {
        if(err) {
          deferred.reject(err);
        } else {
          deferred.resolve(product);
        }
      });
    }
    return deferred.promise;
  };

  // Update a products
  productModel.edit = function(productId, data) {
    var deferred = Q.defer();
    productModel.findOneAndUpdate({_id: productId}, {$set: data},  {new: true}, function(err, products) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(products);
      }
    });
    return deferred.promise;
  };
  return productModel;
}

module.exports = createProductModel;

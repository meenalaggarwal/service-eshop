module.exports = {
  mongo: {
    development: {
      host: 'localhost:27017',
      db: 'eshop'
    },
    production: {
      host: process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT,
      db: 'eshop'
    }
  },
  jwt: {
    secret: 'eShopeShop'
  }
};


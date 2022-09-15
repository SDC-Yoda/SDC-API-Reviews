const models = require('../models/modelIndex.js');

exports.getProduct = (req, res) => {
  // models.products.findOneProduct(req.params.productId)
  //   .then((product) => {
  //     res.send(product);
  //   })
  res.send(models.products,findOneProduct);
}
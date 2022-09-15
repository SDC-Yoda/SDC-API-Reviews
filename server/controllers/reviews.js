const reviews = require('../models/reviews.js')


module.exports.getReviews = (req, res) => {
  reviews.findAll()

}
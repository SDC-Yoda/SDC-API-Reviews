const client = require("../db.js");


module.exports.findAll = ({ product_id }) => {
  let queryText = `SELECT * FROM reviews WHERE product_id = ${product_id}`
  return client.query(queryText)
  .then(queryResult => {
    console.log('DB result for findAll:', queryResult)
  })
  .catch(err => {
    console.log('Error retrieving from DD:', err)
  })
}
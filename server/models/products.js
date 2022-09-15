const client = require("../db/index.js")

exports.findOneProduct = (id) => {
  client.query(`SELECT * FROM products WHERE id = ${id}`)
  .then((response) => {
    return response;
  })
}

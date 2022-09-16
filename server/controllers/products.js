const pool = require('../db.js')
module.exports = {
  getProduct: (req, res) => {

  },
  getProducts: (req, res) => {
    //invoke findProducts model with parameters
  },
  getStyle: (req, res) => {
    //invoke findStyle model with id
    const query = {
      text: `select * from styles where product_id = $1`,
      values: [req.params.product_id]
    }
    pool.query(query)
      .then((response) => {
        res.send(response.rows);
      })
  },
  getRelated: (req, res) => {
  }
}
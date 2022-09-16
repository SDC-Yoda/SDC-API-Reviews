const prodCont = require('./controllers/products.js')
const express = require('express');

const app = express();

app.get('/products/:product_id', (req, res) => {
  const query = {
    text: `select * from products where id = $1`,
    values: [req.params.product_id]
  }
  client.query(query)
    .then((response) => {
      res.send(response.rows[0]);
    })
})
app.get('/products/:product_id/styles', (req, res) => { prodCont.getStyle(req, res); })

app.listen(8000, () => {
  console.log('Server listening on 8000');
})
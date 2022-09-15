require('dotenv').config();
const express = require('express');
const cors = require('cors');
const controllers = require('./controllers/controllerIndex.js');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`LISTENING ON PORT ${PORT}`);

// ROUTES - PRODUCT
// app.get('/products/:productId', (req, res) => {
//   controllers.products.getProduct(req, res);
// });

// ROUTES - RATINGS
app.get('/reviews', (req, res) => {
  reviewsCtrl.getReviews(req, res)
})

// ROUTES - QNA
app.get('/qa/questions', (req, res) => {
  client.qna.getQuestions(req, res)});
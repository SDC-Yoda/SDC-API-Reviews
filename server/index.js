require('dotenv').config();
const PORT = process.env.PORT
const reviewsCntl = require('./controllers/reviews.js')
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/reviews', (req, res) => {
  return reviewsCntl.getReviews(req, res)
})

app.get('/reviews/meta', (req, res) => {
  return reviewsCntl.getReviewsMeta(req, res)
})

app.post('/reviews/', (req, res) => {
  return reviewsCntl.postReview(req, res)
})


app.listen(8000, () => {
  console.log(`Server listening on ${PORT}`);
})
require('dotenv').config();
const PORT = process.env.PORT
const reviewsCntl = require('./controllers/reviews.js')
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/loaderio-956e4ceecb4e59cbe5174f246347115d.txt", (req, res) => {
  return res.status(200).send("loaderio-956e4ceecb4e59cbe5174f246347115d")
})

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

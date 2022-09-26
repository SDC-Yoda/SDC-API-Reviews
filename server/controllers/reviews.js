const pool = require('../db.js')

module.exports = {
  getReviews: (req, res) => {
    let finalResponse = {
      product_id: req.query.product_id,
      page: req.query.page,
      count: req.query.count || 5,
      results: undefined
    }

    const query =`
    SELECT
      reviews.id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
      json_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) AS photos
    FROM
      reviews
    LEFT JOIN
      reviews_photos
    ON
      reviews.id = reviews_photos.review_id
    WHERE
      reviews.product_id = ($1)
    GROUP BY
      reviews.id
    LIMIT
      ($2);`
    const values = [finalResponse.product_id, finalResponse.count]
    pool
      .query(query, values)
      .then(response => {
        finalResponse.results = response.rows
      })
      .then(() => {
        for (var currReview of finalResponse.results) {
          if (currReview.photos.length === 1) {
            if (currReview.photos[0].id === null) {
              currReview.photos = []
            }
          }
        }
      })
      .then(() => {
        res.status(200).send(finalResponse)
      })
      .catch(err => {
        res.status(500).send('Internal Server Error')
        console.log('Error retrieving from DB:', err)
      })
  },

  getReviewsMeta: (req, res) => {
    console.log('req.query.product_id:', req.query.product_id)
    const values = [req.query.product_id]
    const getReveiewsMeta =
    `SELECT json_build_object(
      'product_id', $1::integer,
      'ratings', json_build_object(
        '1', (SELECT COUNT(*) FROM reviews WHERE rating = 1 AND product_id = $1::integer),
        '2', (SELECT COUNT(*) FROM reviews WHERE rating = 2 AND product_id = $1::integer),
        '3', (SELECT COUNT(*) FROM reviews WHERE rating = 3 AND product_id = $1::integer),
        '4', (SELECT COUNT(*) FROM reviews WHERE rating = 4 AND product_id = $1::integer),
        '5', (SELECT COUNT(*) FROM reviews WHERE rating = 5 AND product_id = $1::integer)
          ),
      'recommended', json_build_object(
        '0', (SELECT COUNT(*) FROM reviews WHERE recommend = false AND product_id = $1::integer),
        '1', (SELECT COUNT(*) FROM reviews WHERE recommend = true AND product_id = $1::integer)
        ),
      'characteristics', json_build_object(
        'Size', json_build_object(
          'id', (SELECT id FROM characteristics WHERE name = 'Size' AND product_id = $1::integer),
          'value', (SELECT AVG(value)::numeric(10,2) FROM characteristic_reviews JOIN characteristics ON characteristic_reviews.id = characteristics.id WHERE product_id = $1::integer AND name = 'Size')
          ),
        'Width', json_build_object(
          'id', (SELECT id FROM characteristics WHERE name = 'Width' AND product_id = $1::integer),
          'value', (SELECT AVG(value)::numeric(10,2) FROM characteristic_reviews JOIN characteristics ON characteristic_reviews.id = characteristics.id WHERE product_id = $1::integer AND name = 'Width')
          ),
        'Fit', json_build_object(
          'id', (SELECT id FROM characteristics WHERE name = 'Fit' AND product_id = $1::integer),
          'value', (SELECT AVG(value)::numeric(10,2) FROM characteristic_reviews JOIN characteristics ON characteristic_reviews.id = characteristics.id WHERE product_id = $1::integer AND name = 'Fit')
          ),
        'Length', json_build_object(
          'id', (SELECT id FROM characteristics WHERE name = 'Length' AND product_id = $1::integer),
          'value', (SELECT AVG(value)::numeric(10,2) FROM characteristic_reviews JOIN characteristics ON characteristic_reviews.id = characteristics.id WHERE product_id = $1::integer AND name = 'Length')
          ),
        'Comfort', json_build_object(
          'id', (SELECT id FROM characteristics WHERE name = 'Comfort' AND product_id = $1::integer),
          'value', (SELECT AVG(value)::numeric(10,2) FROM characteristic_reviews JOIN characteristics ON characteristic_reviews.id = characteristics.id WHERE product_id = $1::integer AND name = 'Comfort')
          ),
        'Quality', json_build_object(
          'id', (SELECT id FROM characteristics WHERE name = 'Quality' AND product_id = $1::integer),
          'value', (SELECT AVG(value)::numeric(10,2) FROM characteristic_reviews JOIN characteristics ON characteristic_reviews.id = characteristics.id WHERE product_id = $1::integer AND name = 'Quality')
        )
      )
    ) AS characteristics`

    pool
      .query(getReveiewsMeta, values)
      .then((response) => {
        res.sendStatus(200)
      })
      .catch(err => {
        res.status(500).send('Error retrieving meta from DB')
        console.log('Error retrieving meta from DB:', err)
      })
  },


  postReview: (req, res) => {
    let review_id = 0
    let finalResponse = {
      product_id: req.body.product_id,
      rating: req.body.rating,
      date: Date.now(),
      summary: req.body.summary,
      body: req.body.body,
      recommend: Boolean(req.body.recommend),
      name: req.body.name,
      email: req.body.email,
      photos: req.body.photos,
      characteristics: {}
    }

    const postReviewQuery =
      `INSERT INTO
        reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
      VALUES
        (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))
      RETURNING id`
      const postValues = [
      finalResponse.product_id,
      finalResponse.rating,
      finalResponse.date,
      finalResponse.summary,
      finalResponse.body,
      finalResponse.recommend,
      finalResponse.name,
      finalResponse.email
    ]

    let populatePhotos = function() {
      for (let currPhoto of req.body.photos) {
        const addPhotosQuery =`
          INSERT INTO
            reviews_photos (review_id, url)
          VALUES
            (($1), ($2))`
        const addPhotoValues = [review_id, finalResponse.photos[currPhoto]]
        pool
          .query(addPhotosQuery, addPhotoValues)
          .then((response) => {
          })
      }
    }

    let populateChars = function() {
      for (let charID in req.body.characteristics) {
        finalResponse.characteristics[charID] = req.body.characteristics[charID]
        const addCharsQuery =`
          INSERT INTO
            characteristic_reviews (characteristic_id, value, review_id)
          VALUES
            (($1), ($2), ($3))`
        const addCharsValues = [charID, req.body.characteristics[charID], review_id]
        pool
          .query(addCharsQuery, addCharsValues)
          .then((response) => {
          })
      }
    }

    pool
        .query(postReviewQuery, postValues)
        .then(response => {
          review_id = response.rows[0].id
          populatePhotos()
          populateChars()
      })
      .then(() => {
        res.sendStatus(201)
      })
      .catch(err => {
        console.log('Error inserting into DB:', err)
        res.status(400).send('Bad Request')
      })
  }
}

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
      .catch(err => {
        console.log('Error retrieving from DB:', err)
      })
  },

  getReviewsMeta: (req, res) => {
    let finalResponse = {
      product_id: req.query.product_id,
      ratings: {},
      recommended: {},
      characteristics: {}
    }

    const ratingsQuery =
      `SELECT
        json_build_object(rating, count(*)) AS ratings
      FROM
        reviews
      WHERE
        product_id = ($1)
      GROUP BY
        rating`

    const recQuery = `
      SELECT
        json_build_object(recommend, count(*)) AS recommended
      FROM
        reviews
      WHERE
        product_id = ($1)
      GROUP BY
        recommend`
    const values = [finalResponse.product_id]

    pool.query(ratingsQuery, values)
      .then(response => {
        for (var stars of response.rows) {
          for (var key in stars['ratings']) {
            finalResponse.ratings[key] = stars['ratings'][key]
          }
        }
      })
      .then(() => {
        return pool.query(recQuery, values)
      })
      .then(response => {
        console.log(response.rows)
        for (var bool of response.rows) {
          for (var key in bool['recommended']) {
            if (key === 'true') {
              finalResponse.recommended[1] = bool['recommended'][key]
            } else {
              finalResponse.recommended[0] = bool['recommended'][key]
            }
          }
        }
      })
      .then(() => {
        res.sendStatus(200)
      })
      .catch(err => {
        console.log('Error retrieving from DB:', err)
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

    const postQuery =
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
            console.log('addPhotosResponse:', response)
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
            console.log('AddCharsResponse:', response)
          })
      }
    }

    pool
      .query(postQuery, postValues)
      .then(response => {
        console.log('response:', response)
        review_id = response.rows[0].id
        console.log('review_id:', review_id)
        populatePhotos()
        populateChars()
      })
      .then(() => {
        res.sendStatus(201)
      })
      .catch(err => {
        console.log('Error inserting into DB:', err)
      })
  }
}




// pageHelper: () => {
//   return 5

// }

// sortHelper: () => {

// }

// getReviews: (req, res) => {
//   let finalResponse = {
//     product_id: req.query.product_id,
//     page: req.query.page || pageHelper(),
//     count: req.query.count || 5,
//     results: undefined
//   }

//   const query =`
//   SELECT
//     reviews.id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
//     json_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) AS photos
//   FROM
//     reviews
//   LEFT JOIN
//     reviews_photos
//   ON
//     reviews.id = reviews_photos.review_id
//   WHERE
//     reviews.product_id = ($4)
//   GROUP BY
//     reviews.id
//   ORDER BY
//     ($3)
//   LIMIT
//     ($2)
//   OFFSET
//     ($1);`
//   const values = [finalResponse.page, finalResponse.count, req.query.sort, finalResponse.product_id]
//   pool.query(query, values)
//     .then(response => {
//       finalResponse.results = response.rows
//     })
//     .then(() => {
//       for (var currReview of finalResponse.results) {
//         if (currReview.photos.length === 1) {
//           if (currReview.photos[0].id === null) {
//             currReview.photos = []
//           }
//         }
//       }
//       // console.log(finalResponse)
//     })
//     .catch(err => {
//       console.log('Error retrieving from DB:', err)
//     })
// }
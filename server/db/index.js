require('dotenv').config();
const { Pool, Client } = require('pg');

const pool = new Pool ({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: 'practice',
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.query('SELECT NOW()')
  .then(() => console.log('connected'))
  // .catch((err) => console.log(err))
  // .end()
  .then(() => {
    pool.end();
    console.log('pool has disconnected')
  });

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: 'practice',
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})
client.connect()
  .then(() => {
    console.log('connected as client');
  });

client.query(`CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  slogan VARCHAR,
  description VARCHAR,
  category VARCHAR,
  default_price VARCHAR
)`)
  .then((response) => { console.log('created products table'); })
  .catch((err) => { console.log(err); });

client.query(`CREATE TABLE IF NOT EXISTS styles (
  id SERIAL PRIMARY KEY,
  product_id SERIAL REFERENCES products(id),
  name VARCHAR,
  sale_price TEXT,
  original_price VARCHAR,
  default_style BOOL
)`)
    .then((response) => { console.log('created styles table'); })
    .catch((err) => { console.log(err); });

client.query(`CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  styleId SERIAL REFERENCES styles(id),
  thumbnail_url TEXT,
  url TEXT
)`)
    .then((response) => { console.log('created photos table'); })
    .catch((err) => { console.log(err); });

client.query(`CREATE TABLE IF NOT EXISTS skus (
  id SERIAL PRIMARY KEY,
  styleId SERIAL REFERENCES styles(id),
  size VARCHAR,
  quantity SMALLINT
)`)
    .then((response) => { console.log('created skus table'); })
    .catch((err) => { console.log(err); });
client.query(`CREATE TABLE IF NOT EXISTS features (
  id SERIAL PRIMARY KEY,
  product_id SERIAL REFERENCES products(id),
  feature VARCHAR,
  value VARCHAR
)`)
    .then((response) => { console.log('created features table'); })
    .catch((err) => { console.log(err); });
client.query(`CREATE TABLE IF NOT EXISTS related (
  id SERIAL PRIMARY KEY,
  current_product_id INT,
  related_product_id INT
)`)
    .then((response) => { console.log('created related table'); })
    .catch((err) => { console.log(err); });



// -----------------------Questions and Answers----------------------------
// * Questions *
client.query(`CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  product_id SERIAL,
  body VARCHAR,
  date_written TEXT,
  asker_name VARCHAR,
  asker_email VARCHAR,
  reported BOOL,
  helpful SERIAL
);`)
  .then((response) => { console.log('Table: Questions'); })
  .catch((err) => { console.log(err); });

// * Answers *
client.query(`CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id SERIAL REFERENCES questions (id),
  body VARCHAR,
  date_written TEXT,
  answerer_name VARCHAR,
  answerer_email VARCHAR,
  reported BOOL,
  helpful SERIAL
);`)
  .then((response) => { console.log('Table: Answers'); })
  .catch((err) => { console.log(err); });

// * Answer_Photos *
client.query(`CREATE TABLE IF NOT EXISTS answer_photos (
  id SERIAL PRIMARY KEY,
  answer_id SERIAL REFERENCES answers (id),
  url TEXT
);`)
  .then((response) => { console.log('Table: Answer_Photos'); })
  .catch((err) => { console.log(err); });
// ------------------------------------------------------------------------


// Ratings & Reviews
  client.query(`CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id SERIAL REFERENCES products (id),
    rating SMALLINT,
    date VARCHAR,
    summary VARCHAR,
    body VARCHAR,
    recommend BOOLEAN,
    reported BOOLEAN,
    reviewer_name VARCHAR,
    reviewer_email VARCHAR,
    response VARCHAR,
    helpfulness SMALLINT);`
  )
  .then((response) => { console.log('Created reviews table') })
  .catch((err) => { console.log(err); });

  client.query(`CREATE TABLE IF NOT EXISTS reviews_photos (
    id SERIAL PRIMARY KEY,
    review_id SERIAL REFERENCES reviews (id),
    url VARCHAR);`
  )
  .then((response) => { console.log('Created reviews_photos table') })
  .catch((err) => { console.log(err); });

  client.query(`CREATE TABLE IF NOT EXISTS characteristics (
    id SERIAL PRIMARY KEY,
    product_id SERIAL REFERENCES products (id),
    name VARCHAR);`
  )
  .then((response) => { console.log('created characteristics table') })
  .catch((err) => { console.log(err); });

  client.query(`CREATE TABLE IF NOT EXISTS characteristic_reviews (
    id SERIAL PRIMARY KEY,
    characteristic_id SERIAL REFERENCES characteristics (id),
    review_id SERIAL REFERENCES reviews (id),
    value VARCHAR);`
  )
  .then((response) => { console.log('created characteristic_reviews table') })
  .catch((err) => { console.log(err); });

  module.exports = client;


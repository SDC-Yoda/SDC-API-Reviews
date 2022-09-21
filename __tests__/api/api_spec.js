const frisby = require('frisby');

// GET reviews tests
it ('GET should return a status of 200 OK', function () {
  return frisby
    .get('http://localhost:8000/reviews/?product_id=14')
    .expect('status', 200);
});

it('should have a JSON Content-Type header', function () {
  return frisby.get('http://localhost:8000/reviews/?product_id=14')
    // expect('header', key [, value])
    .expect('header', 'Content-Type', 'application/json; charset=utf-8');
});

// GET reviews meta tests
it ('GET should return a status of 200 OK', function () {
  return frisby
    .get('http://localhost:8000/reviews/meta?product_id=14')
    .expect('status', 200);
});

it('should have a JSON Content-Type header', function () {
  return frisby.get('http://localhost:8000/reviews/meta?product_id=14')
    .expect('header', 'Content-Type', 'application/json; charset=utf-8');
});


// POST Review Test
it('fetch with POST should return a status of 201 Created', function () {
  return frisby
    .fetch('http://localhost:8000/reviews/', {
      method: 'POST',
      body: JSON.stringify({
        "product_id": 25,
        "rating": 4,
        "summary": "This is a test summary",
        "body": "This is my test body! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "recommend": "true",
        "name": "Frisby",
        "email": "tiger@gmail.com",
        "photos": [
            "https://www.color-meanings.com/wp-content/uploads/colored-rainbow-over-forest-mountains.jpeg",
            "https://pyxis.nymag.com/v1/imgs/388/cda/a896a62ed3f7e2b9b36230ea5617f8abcd-11---.rsquare.w600.jpg"],
        "characteristics": {
            "88": 3,
            "89": 2,
            "90": 5,
            "91": 1
        }
      })
    })
    .expect('status', 201);
});



// // https://joi.dev/api/?v=17.6.0
// // Insert your joi schema here
// Joi.object({
//   username: Joi.string().alphanum().min(3).max(30).required(),
//   password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
//   repeat_password: Joi.ref("password"),
//   access_token: [Joi.string(), Joi.number()],
//   birth_year: Joi.number().integer().min(1900).max(2013),
//   email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } } )
// }).with('username', 'birth_year').xor('password', 'access_token').with('password', 'repeat_password')

// it ('should return a list of feed items', function () {
//   return frisby
//     .get('http://localhost:8000/reviews')
//     .expect('status', 200)
//     .expect('json', 'version', 'https://jsonfeed.org/version/1')
//     .expect('json', 'title', 'JSON Feed')
//     .expect('jsonTypes', 'items.*', { // Assert *each* object in 'items' array
//       'id': Joi.string().required(),
//       'url': Joi.string().uri().required(),
//       'title': Joi.string().required(),
//       'date_published': Joi.date().iso().required(),
//     });
// });


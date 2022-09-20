const frisby = require('frisby');

it('should be a teapot', function () {
  return frisby.get('http://httpbin.org/status/418')
    .expect('status', 418);
});


it ('GET should return a status of 200 OK', function () {
  return frisby
    .get('http://localhost:3000/reviews')
    .expect('status', 200);
});
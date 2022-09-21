import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
  const url = 'http://localhost:8000/reviews/';
  const payload =
    {
      "product_id": 25,
      "rating": 4,
      "summary": "This is a test summary",
      "body": "This is my test body! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "recommend": "true",
      "name": "Frisby",
      "email": "tiger@gmail.com",
      "photos": [
        "https://www.color-meanings.com/wp-content/uploads/colored-rainbow-over-forest-mountains.jpeg",
        "https://pyxis.nymag.com/v1/imgs/388/cda/a896a62ed3f7e2b9b36230ea5617f8abcd-11---.rsquare.w600.jpg"
      ],
      "characteristics": {
        "88": 3,
        "89": 2,
        "90": 5,
        "91": 1
      }
    }


  // http.post(url, payload, params);
  var res = http.post(url, payload)
  check(res, {
    'is status 201': (r) => r.status === 201,
  })
}

  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };
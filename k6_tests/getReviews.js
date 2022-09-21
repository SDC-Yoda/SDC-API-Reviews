import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '5s',
};

export default function () {
  for (let product_id = 1; product_id <= 60000; product_id += 10000) {
    var res = http.get(`http://localhost:8000/reviews/?product_id=${product_id}`);
    check(res, {
      'is status 200': (r) => r.status === 200,
    })
    sleep(.5);
  }
}

import { getReviews } from './getReviews.js'
import { getReviewsMeta } from './getReviewsMeta.js'
import { postReview } from './postReview.js'


export default function () {
  getReviews()
  getReviewsMeta()
  postReview()
}

/*
VUS:      virtual users
Duration:
Checks:   Checks are true/false conditions that evaluate the content of some value in the JavaScript runtime.
Sleep: Suspend VU execution for the specified duration.
*/
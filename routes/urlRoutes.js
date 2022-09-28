const express = require('express');
const router = express.Router();
const {
    shortenUrl,
    getAllUrls

} = require('../controllers/urlShortener');

const { protect } = require("../controllers/users")
router.route('/shorten').post(protect, shortenUrl)
router.route('/').get(protect, getAllUrls)

module.exports = router
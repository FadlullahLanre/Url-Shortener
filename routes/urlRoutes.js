const express = require('express');
const router = express.Router();
const {
    shortenUrl,
    redirectUrl
} = require('../controllers/urlShortener');


router.route('/shorten').post(shortenUrl);
router.route('/:code').get(redirectUrl);
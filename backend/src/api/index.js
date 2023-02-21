const express = require('express');

const emojis = require('./emojis');
const search = require('./search');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

search.router.use('/emojis', emojis);
search.router.use('/search', search);

module.exports = router;

const express = require('express');

const emojis = require('./emojis');
const search = require('./search');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/search', search);

module.exports = router;

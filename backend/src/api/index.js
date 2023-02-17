const express = require('express');

const search = require('./search');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/search', search);

module.exports = router;

const fs = require("fs");
const NLU = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

require("dotenv").config();

const DEFAULT_LENGTH = 5;
function parseLength(query) {
  if (!query) {
    return DEFAULT_LENGTH;
  } 
  let x = parseInt(query);
  return !x ? DEFAULT_LENGTH : x;
}

function MSE(categories, course) {
  const labelmap = {};
  categories.forEach((obj) => {
    labelmap[obj.label] = obj.score;
  });

  let acc = 0;
  for(let i=0; i<course.categories.length; i++) {
    const label = course.categories[i].label;
    if(label in labelmap) {
      acc += Math.pow(course.categories[i].score-labelmap[label], 2);
    }
  }
  return acc;
}

const nlu = new NLU({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.API_URL,
});

const dataset = JSON.parse(fs.readFileSync('dataset.json', 'utf8'));

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.query.text) {
    res.json([]);
    return;
  }
// http://localhost:5001/api/v1/search?text=%22I%20am%20a%20computer%20scientist%20currently%20studying%20at%20Durham%20University%20looking%20to%20get%20into%20the%20machine%20learning%20and%20game%20development%20buisness%22

  const result = await nlu.analyze({
    text: req.query.text,
    features: {
      categories: {
        limit: 5,
      }
    }});

  let cmpList = dataset
    .map((course) => ({mse: MSE(result.result.categories, course), course}))
    .sort((a, b) => a.mse-b.mse)
    .map((mseCourse) => mseCourse.course.input);

  let length = parseLength(req.query.length);
  let searchResults = cmpList.slice(0, length);
  res.json(searchResults);
  return;
});

module.exports = router;
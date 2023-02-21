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

function getEmbeddings(cats) {
  embeddings = {};
  for (let cat of data.categories) {
    embeddings[cat] = 0.0;
  }

  for (let cat of cats) {
    labels = cat.label.slice(1).split("/")
    for (let label of labels) {
      embeddings[label] = Math.max(embeddings[label], cat.score);
    }
  }
  return embeddings;
}

function MSE(user, course) {
  cat_emb = getEmbeddings(user);
  course_emb = getEmbeddings(course.categories);

  let acc = 0;
  for (let cat of data.categories) {
    acc += Math.pow(cat_emb[cat]-course_emb[cat], 2);
  }
  //console.log(acc, course);
  return acc / data.categories.length;
}

function embeddingSort(userEmbeddings) {
  return data.dataset
    .map((course) => ({mse: MSE(userEmbeddings, course), course}))
    .sort((a, b) => a.mse-b.mse)
    .map((mseCourse) => mseCourse.course.input);
}

const nlu = new NLU({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.API_URL,
});

const data = JSON.parse(fs.readFileSync('data_with_classes.json', 'utf8'));

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
        limit: 20,
      }
    }
  });
  if (result.error) {
    res.json([]);
    return;
  }

  let length = parseLength(req.query.length);
  let searchResults = embeddingSort(result.result.categories).slice(0, length);
  res.json(searchResults);
  return;
});

module.exports = router;
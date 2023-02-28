const fs = require('fs');
const NLU = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

require('dotenv').config();

function processCheckboxes(query) {
  return true;
}

/**
 * Checks whether a course is allowed by the checkboxes specified by the user
 * @function  checkboxAllowed
 * @param     {*}       course      a course from the dataset, including the 'Topic' attribute
 * @param     {*}       checkboxes  an object detailing which checkboxes were selected
 * @returns   {boolean}             does the course Topics match with the checkboxes
 */
function checkboxAllowed(course, checkboxes) {
  if (checkboxes.all) return true;

  return course.input.Topic
    .split(',')
    .map((topic) => topic.trim())
    .filter((topic) => checkboxes[topic])
    .length() > 0;
}

/**
 * Computes an embedding object from the categories returned by IBM watson
 * @function  getEmbeddings
 * @param     {*}  cats                 A list of categories computed by IBM watson
 * @returns   {Array.<String, number>}  An embedding object containing the category data passed
 */
function getEmbeddings(cats) {
  // first create an empty embedding object
  embeddings = {};
  for (const cat of data.categories) {
    embeddings[cat] = 0.0;
  }

  // then populate embedding object with max scores from the IBM watson categories
  for (const cat of cats) {
    labels = cat.label.slice(1).split('/');
    for (const label of labels) {
      embeddings[label] = Math.max(embeddings[label], cat.score);
    }
  }
  return embeddings;
}

/**
 * Compares the categories between the user and a course, producing a Mean Squared Error value
 * @function  MSE
 * @param     {*}       userCats  the categories returned by IBM watson given the user's HE description
 * @param     {*}       course    the pre-computed categories of a course from the dataset
 * @returns   {number}            the MSE value computed from the embeddings of the categories
 */
function MSE(userCats, course) {
  userCatsEmb = getEmbeddings(userCats);
  courseEmb = getEmbeddings(course);

  // MSE(𝚨, 𝚩) = 1/n * 𝛴 (𝚨_i - 𝚩_i)²
  // let acc = data.categories.map((cat) => Math.pow(userCatsEmb[cat]-courseEmb[cat], 2)).reduce((x, y) => x+y, 0);
  let acc = 0;
  for (const cat of data.categories) {
    acc += (userCatsEmb[cat] - courseEmb[cat]) ** 2;
  }
  return acc / data.categories.length;
}

/**
 * Sorts the Skillsbuild course dataset using the MSE values for each course
 * @function  embeddingSort
 * @param     {*}   userCats            the categories returned by IBM watson given the user's HE description
 * @returns   {Array.<String, String>}  a list of courses from the dataset in order of relevance to the user's HE description
 */
function embeddingSort(userCats, checkboxes) {
  return data.dataset
    .filter((course) => checkboxAllowed(course, checkboxes))
    .map((course) => ({
      mse: MSE(userCats, course.categories), // computing MSE value for each course
      course: course.input,
    }))
    .sort((a, b) => a.mse - b.mse)
    .map((mseCourse) => mseCourse.course); // only return the course descriptions
}

/**
 * Parses and sanitises the length query argument, or returns a default
 * @function        parseLength
 * @param   {*}     query   Any argument
 * @returns {number}      the parsed and sanitised argument, or a default value
 */
function parseLength(query) {
  if (!query) return process.env.DEFAULT_LENGTH;

  const length = parseInt(query);
  return (!length || length < 0) ? process.env.DEFAULT_LENGTH : length;
}

// NLU (Natural Language Understanding) object allows the program to interface with IBM watson
const nlu = new NLU({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.API_URL,
});

// 'data_with_classes.json' contains the SkillsBuild course dataset and a list of IBM watson categories
const data = JSON.parse(fs.readFileSync('data_with_classes.json', 'utf8'));

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.query.text) {
    res.json({ error: 'No text provided!', code: 1 });
    return;
  }

  // the nlu function 'analyze' will make the call to IBM Watson's API
  nlu.analyze({
    text: req.query.text,
    features: {
      categories: {
        limit: 20,
      },
    },
  }).then((result) => {
    if (result.error) {
      res.json({ error: 'An error occurred!', code: 2 });
      return;
    }

    const length = parseLength(req.query.length);
    const searchResults = embeddingSort(result.result.categories).slice(0, length);
    res.json(searchResults);
  }).catch((err) => {
    // {"error":"not enough text for language id","code":422}
    // let error = JSON.parse(error.body);
    res.json(err.body);
  });
});

module.exports = {
  router,
  MSE,
  parseLength,
  getEmbeddings,
  embeddingSort,
};

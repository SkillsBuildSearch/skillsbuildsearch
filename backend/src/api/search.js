const fs = require('fs');
const NLU = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

require('dotenv').config();

// loading the dataset & additional data from disk
const dataset = JSON.parse(fs.readFileSync('dataset.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('embeddings_categories.json', 'utf8'));
const checkbox_cats = JSON.parse(fs.readFileSync('checkbox_categories.json', 'utf8'));

/**
 * Parses and sanitises the offset query argument, or returns 0
 * The offset argument specifies which courses from the sorted dataset are returned
 * @function  parseOffset
 * @param   {*}   query   Any argument
 * @returns {number}      the parsed and sanitised argument, or 0
 */
function parseOffset(query) {
  if (!query) { return 0; }

  const offset = parseInt(query, 10);
  return (!offset || offset < 0) ? 0 : offset;
}

/**
 * Converts the checkbox data sent from the frontend, into a object
 * @function  parseCheckboxes
 * @param   {*}     query   Any argument
 * @returns {Object}        an object containing the parsed checkbox data from the query
 */
function parseCheckboxes(query) {
  const checkboxes = { all: true };
  if (!query) return checkboxes;

  const selected_checks = query
    .split(',')
    .map((check) => check.trim())
    .filter((check) => checkbox_cats.includes(check));

  const length = selected_checks.length(); // if either all or no checkboxes are selected
  checkboxes.all = length === 0 || length === checkbox_cats.length();

  checkbox_cats.forEach((check) => {
    checkboxes[check] = selected_checks.includes(check);
  });

  return checkboxes;
}

/**
 * Checks whether a course is allowed by the checkboxes specified by the user
 * @function  checkboxAllowed
 * @param     {*}       course      a course from the dataset, including the 'Topic' attribute
 * @param     {*}       checkboxes  an object detailing which checkboxes were selected
 * @returns   {boolean}             does the course Topics match with the checkboxes
 */
function checkboxAllowed(course, checkboxes) {
  if (checkboxes.all) { return true; }

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
  const embeddings = {};
  categories.forEach((cat) => {
    embeddings[cat] = 0.0;
  });

  // then populate embedding object with max scores from the IBM watson categories
  cats.forEach((cat) => {
    cat.label
      .slice(1) // remove first / from the cats
      .split('/')
      .forEach((label) => {
        embeddings[label] = Math.max(embeddings[label], cat.score);
      });
  });
  return embeddings;
}

/**
 * Compares the categories between the user and a course, producing a Mean Squared Error value
 * - MSE(𝚨, 𝚩) = 1/n * 𝛴 (𝚨_i - 𝚩_i)²
 * @function  MSE
 * @param     {*}       userCats  the categories returned by IBM watson from the user's input
 * @param     {*}       course    the pre-computed categories of a course from the dataset
 * @returns   {number}            the MSE value computed from the embeddings of the categories
 */
function MSE(userCats, course) {
  const userCatsEmb = getEmbeddings(userCats);
  const courseEmb = getEmbeddings(course);

  let acc = 0;
  categories.forEach((cat) => {
    acc += (userCatsEmb[cat] - courseEmb[cat]) ** 2;
  });
  return acc / categories.length;
}

/**
 * Sorts the Skillsbuild course dataset using the MSE values for each course
 * @function  embeddingSort
 * @param     {*}   userCats
 *        the categories returned by IBM watson given the user's HE description
 * @returns   {Array.<String, String>}
 *        a list of courses from the dataset in order of relevance to the user's HE description
 */
function embeddingSort(userCats, checkboxes) {
  return dataset
    .filter((course) => checkboxAllowed(course, checkboxes))
    .map((course) => ({
      mse: MSE(userCats, course.categories), // computing MSE value for each course
      course: course.input,
    }))
    .sort((a, b) => a.mse - b.mse)
    .map((mseCourse) => mseCourse.course); // only return the course descriptions
}

// NLU (Natural Language Understanding) object allows the program to interface with IBM watson
const nlu = new NLU({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.API_URL,
});

const express = require('express');

const router = express.Router();

router.get('/search', async (req, res) => {
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

    const offset = parseOffset(req.query.offset);
    const checkboxes = parseCheckboxes(req.query.categories);
    const searchResults = embeddingSort(result.result.categories, checkboxes)
      .slice(offset, offset + process.env.DEFAULT_LENGTH);
    res.json(searchResults);
  }).catch((err) => {
    // {"error":"not enough text for language id","code":422}
    // let error = JSON.parse(error.body);
    res.json(err.body);
  });
});

router.get('/categories', async (req, res) => {
  res.json(checkbox_cats);
});

module.exports = {
  router,
  MSE,
  parseOffset,
  parseCheckboxes,
  checkboxAllowed,
  getEmbeddings,
  embeddingSort,
};

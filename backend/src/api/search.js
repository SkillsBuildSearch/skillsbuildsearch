const express = require('express');
const fs = require('fs');
const multer = require('multer');
const NLU = require('ibm-watson/natural-language-understanding/v1');
const STT = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

require('dotenv').config();

const DEFAULT_LENGTH = 5;
const MIN_TEXT_LENGTH = 10;

// loading the dataset & additional data from disk
const dataset = JSON.parse(fs.readFileSync('data/dataset_with_categories.json', 'utf8'));
const embeddingCats = JSON.parse(fs.readFileSync('data/embedding_categories.json', 'utf8'));
const checkboxCats = JSON.parse(fs.readFileSync('data/checkbox_categories.json', 'utf8'));

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
 * Converts and validates the checkbox bits sent from the frontend, into a object
 * @function  parseCheckboxes
 * @param   {*}     query   Any argument
 * @returns {Object.<string, number>}
 *    an object with (Topic / checkbox clicked) pairs, parsed from the query input
 */
function parseCheckboxes(query) {
  const checkboxes = { ignore: true };
  if (!query) return checkboxes;

  const bits = parseInt(query, 10); // the checkboxes are stored as the bits of an int

  /* eslint-disable-next-line no-bitwise */
  const edgeChecks = bits <= 0 || bits >= 1 << (checkboxCats.length + 1) - 1;
  if (!bits || edgeChecks) return checkboxes;

  checkboxes.ignore = false; // if edgeChecks is true, either all or no checkboxes are checked
  checkboxCats.forEach((check, idx) => {
    /* eslint-disable-next-line no-bitwise */
    checkboxes[check] = bits & (1 << idx);
  });

  return checkboxes;
}

/**
 * Checks whether a course is allowed by the checkboxes specified by the user
 * @function  checkboxAllowed
 * @param     {Object.<string, string>} course
 *    a course from the dataset, including the 'Topic' attribute
 * @param     {Object.<string, number>} checkboxes
 *    an object containing the checkbox selection information from the search request
 * @returns   {boolean}
 *    does the course Topics match with the checkboxes;
 *    does this course need to be filtered based on the checkboxes selected
 */
function checkboxAllowed(course, checkboxes) {
  if (checkboxes.ignore) { return true; }

  return course.input.Topic
    .split(',')
    .map((topic) => topic.trim()) // clean up Topic attr into an array
    .filter((topic) => checkboxes[topic])
    .length > 0;
}

/**
 * Computes an embedding object from the categories returned by IBM watson.
 * @function  getEmbeddings
 * @param     {Array.<Object>}  cats
 *    The category results returned by IBM Watson's NLU analysis
 * @returns   {Object.<String, number>}
 *    An embedding object containing the category data passed
 */
function getEmbeddings(cats) {
  // first create an empty embedding object
  const embeddings = {};
  embeddingCats.forEach((cat) => {
    embeddings[cat] = 0.0;
  });

  // then populate embedding object with max scores from the IBM watson categories
  cats.forEach((cat) => {
    cat.label
      .slice(1) // remove first / from the cats
      .split('/')
      .forEach((label) => {
        // use the maximum confidence score for each embedding label
        embeddings[label] = Math.max(embeddings[label], cat.score);
      });
  });
  return embeddings;
}

/**
 * Compares the categories between the user and a course, producing a Mean Squared Error value
 * - MSE(𝚨, 𝚩) = 1/n * 𝛴 (𝚨_i - 𝚩_i)²
 * @function  MSE
 * @param     {Array.<Object>}  userCats
 *    The category results returned by IBM Watson's NLU analysis of the user's input
 * @param     {Array.<Object>}  courseCats
 *    The category results returned by IBM Watson's NLU analysis of a course's information
 * @returns   {number}
 *    the MSE value computed from the embeddings of the categories
 */
function MSE(userCats, courseCats) {
  const userCatsEmb = getEmbeddings(userCats);
  const courseEmb = getEmbeddings(courseCats);

  /*
  const acc = embeddingCats
    .map((cat) => (userCatsEmb[cat] - courseEmb[cat]) ** 2)
    .reduce((x, y) => x + y);
  */

  let acc = 0;
  embeddingCats.forEach((cat) => {
    acc += (userCatsEmb[cat] - courseEmb[cat]) ** 2;
  });
  return acc / embeddingCats.length;
}

/**
 * Sorts the Skillsbuild course dataset using the MSE values for each course
 * @function  embeddingSort
 * @param     {Array.<Object>}  userCats
 *    The category results returned by IBM Watson's NLU analysis of the user's input
 * @returns   {Array.<Object.<String, String>>}
 *    the IBM SkillsBuild course dataset in order of relevance to the user's input
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
    apikey: process.env.NLU_API_KEY,
  }),
  serviceUrl: process.env.NLU_API_URL,
});

const router = express.Router();
router.get('/search', async (req, res) => {
  if (!req.query.text) {
    res.status(400).json({ error: 'No text provided!', code: 1 });
    return;
  }
  // parameters sent to IBM Watson's NLU service
  const params = {
    text: req.query.text,
    features: {
      categories: {
        limit: 20,
      },
    },
  };
  // default language as en-gb if too little text
  if (params.text.length < MIN_TEXT_LENGTH) {
    params.language = 'en-gb';
  }

  // the nlu function 'analyze' will make the call to IBM Watson's API
  nlu.analyze(params).then((result) => {
    if (result.error) {
      res.status(400).json({ error: 'An error occurred!', code: 2 });
      return;
    }

    const offset = parseOffset(req.query.offset);
    const checkboxes = parseCheckboxes(req.query.checkboxes);
    const searchResults = embeddingSort(result.result.categories, checkboxes)
      .slice(offset, offset + DEFAULT_LENGTH); // if offset=0, returns top ${DEFAULT_LENGTH} courses
    res.json(searchResults);
  }).catch((error) => {
    /* eslint-disable-next-line no-console */
    console.error(`ERROR ${error}`);
    const errbody = JSON.parse(error.body);
    errbody.code = 2;
    res.status(400).json(errbody); // TODO: proper error handling
  });
});

// endpoint for the frontend to get the topic categories from the dataset
router.get('/categories', async (req, res) => {
  res.json(checkboxCats);
});

// STT (Speech to Text) object allows the program to interface with IBM watson
const stt = new STT({
  authenticator: new IamAuthenticator({
    apikey: process.env.STT_API_KEY,
  }),
  serviceUrl: process.env.STT_API_URL,
});

const upload = multer({ storage: multer.memoryStorage() });
router.post('/stt', upload.single('audio'), async (req, res) => {
  // console.log(req.file);
  stt.recognize({
    audio: req.file.buffer,
    contentType: 'audio/webm',
    model: 'en-GB_Telephony',
  }).then((result) => {
    if (!result.result || !result.result.results) {
      res.status(400).json({ error: 'An error occured! Cannot transcribe speech', code: 1 });
    }

    const finalText = result.result.results.filter((text) => text.final);
    if (!finalText.length) {
      res.status(400).json({ error: 'An error occured! Cannot transcribe speech', code: 1 });
    } else if (!finalText[0].alternatives.length) {
      res.status(400).json({ error: 'An error occured! Cannot transcribe speech', code: 1 });
    }
    // return the transcribed speech back to the frontend
    res.json({
      transcript: finalText[0].alternatives[0].transcript,
    });
  }).catch((error) => {
    /* eslint-disable-next-line no-console */
    console.error(`ERROR ${error}`);
    res.status(400).json(error);
  });
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

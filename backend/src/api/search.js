const express = require('express');
const fs = require('fs');
const multer = require('multer');
const NLU = require('ibm-watson/natural-language-understanding/v1');
const STT = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const config = require('config');
require('dotenv').config({ path: 'watson.env' });

// loading the dataset & additional data from disk
const dataset = JSON.parse(fs.readFileSync('data/dataset_with_categories.json', 'utf8'));
const embeddingCats = JSON.parse(fs.readFileSync('data/embedding_categories.json', 'utf8'));
const checkboxCats = JSON.parse(fs.readFileSync('data/checkbox_categories.json', 'utf8'));

/**
 * Parses and sanitises the offset query argument, or returns 0
 * The offset argument specifies which courses from the sorted dataset are returned
 * @function  parseOffset
 * @param     {*}   query   Any argument
 * @returns   {number}      the parsed and sanitised argument, or 0
 */
function parseOffset(query) {
  if (!query) { return 0; }

  const offset = parseInt(query, 10);
  return (!offset || offset < 0) ? 0 : offset;
}

/**
 * Converts and validates the checkbox bits sent from the frontend, into a object.
 * The number sent through the query, as binary, represents which checkboxes are selected.
 * 0 - not selected, 1 - selected
 * @function  parseCheckboxes
 * @param     {*}     query   Any argument
 * @returns   {Object.<string, number>}
 *    an object with (Topic / checkbox clicked) pairs, parsed from the query input
 */
function parseCheckboxes(query) {
  if (!query || !query.match(/^\d+$/)) return { ignore: true };

  const bits = parseInt(query, 10); // the checkboxes are stored as the bits of an int

  // ignore if bits is undefined, leq 0, or gt max possible valid integer
  //  (given number of checkbox categories)
  if (!bits || bits <= 0 || bits >= (1 << checkboxCats.length) - 1) {
    return { ignore: true };
  }

  // cannot ignore since non of the above conditions were met, user has selected checkboxes
  const checkboxes = { ignore: false };
  checkboxCats.forEach((check, idx) => {
    checkboxes[check] = bits & (1 << idx); // returns the bit ${idx}
  });

  return checkboxes;
}

/**
 * Checks whether a course is allowed by the checkbox selected by the user
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
 * The embedding object is calculated by splitting each sub-category into a new label.
 * The scores for each sub-category are multiplied by a decay factor.
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

  if (!cats) return embeddings;

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
 * @param     {Object.<String, number>}  userEmbs
 *    An embedding object created from the categories produced by IBM Watson's NLU 
 * @param     {Object.<String, number>}  courseEmbs
 *    An embedding object created from the course's information produced by IBM Watson's NLU
 * @returns   {number}
 *    the MSE value computed from the embeddings of the categories
 */
function MSE(userEmbs, courseEmbs) {
  let acc = 0;
  embeddingCats.forEach((cat) => {
    acc += (userEmbs[cat] - courseEmbs[cat]) ** 2; // squared error
  });
  return acc / embeddingCats.length; // mean of squared errors
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
  const userEmbs = getEmbeddings(userCats);
  return dataset
    .filter((course) => checkboxAllowed(course, checkboxes))
    .map((course) => ({
      mse: MSE(userEmbs, getEmbeddings(course.categories)), // computing MSE value for each course
      course: course.input,
    }))
    .sort((a, b) => a.mse - b.mse)
    .map((mseCourse) => mseCourse.course); // only return the course descriptions
}

// possible future feature
// function isValidUrl(urlStr) {
//   try {
//     /* eslint-disable-next-line no-new */
//     const url = new URL(urlStr);
//     return url.protocol === 'http:' || url.protocol === 'https:';
//   } catch (err) {
//     return false;
//   }
// }

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
    features: {
      categories: {
        limit: 20,
      },
    },
  };

  params.text = req.query.text;
  // default language as en-gb if too little text, (to avoid language id error)
  if (params.text.length < config.get('min_text_length')) {
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

    let allowedCats = result.result.categories.filter((cat) => cat.score > 0.8);
    if (!allowedCats.length) allowedCats = result.result.categories;

    const sortedDataset = embeddingSort(allowedCats, checkboxes);
    const searchResults = sortedDataset.slice(offset, offset + config.get('default_length'));
    // if offset=0, returns top ${default_length} courses

    res.status(200).json(searchResults);
  }).catch((error) => {
    console.error(`ERROR ${error}`);
    const errbody = JSON.parse(error.body);
    errbody.code = 2;
    res.status(400).json(errbody);
  });
});

// endpoint for the frontend to get the topic categories from the dataset
router.get('/categories', async (_, res) => {
  res.status(200).json(checkboxCats);
});

// STT (Speech to Text) object allows the program to interface with IBM watson
const stt = new STT({
  authenticator: new IamAuthenticator({
    apikey: process.env.STT_API_KEY,
  }),
  serviceUrl: process.env.STT_API_URL,
});

/*  using the npm multer package, the frontend can send audio files to the backend
    for IBM Watson Speech To Text transcription.
*/
const upload = multer({ storage: multer.memoryStorage() });
router.post('/stt', upload.single('audio'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    res.status(400).json({ error: 'An error occured! Invalid audio data', code: 1 });
  }

  // stt.recognize performs a call to a STT model in IBM cloud
  stt.recognize({
    audio: req.file.buffer, // contains the audio data transmitted
    contentType: req.file.mimetype,
    model: 'en-GB_Multimedia', // 'en-GB_Telephony',
    // next-gen STT model, some deprecated models include: Narrowband, BroadBand
  }).then((result) => {
    if (!result.result || !result.result.results) {
      res.status(400).json({ error: 'An error occured! Cannot transcribe speech', code: 1 });
    }

    const finalText = result.result.results.filter((text) => text.final);
    if (!finalText.length || !finalText[0].alternatives.length) {
      res.status(400).json({ error: 'An error occured! Cannot transcribe speech', code: 1 });
    }

    // return the transcribed speech back to the frontend, with the highest confidence
    res.status(200).json({
      transcript: finalText[0].alternatives[0].transcript,
    });
  }).catch((error) => {
    /* eslint-disable-next-line no-console */
    console.error(`ERROR ${error}`);
    res.status(400).json(error);
  });
});

// functions are exported for testing purposes
module.exports = {
  router,
  MSE,
  parseOffset,
  parseCheckboxes,
  checkboxAllowed,
  getEmbeddings,
  embeddingSort,
};

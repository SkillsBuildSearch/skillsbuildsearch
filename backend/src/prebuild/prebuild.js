const fs = require('fs');
const tqdm = require('tqdm');
const NLU = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

require('dotenv').config({ path: 'watson.env' });

// Course dataset containing only courses with Title, Description_short, Link, Topic

const checkboxCats = new Set();
const embeddingCats = new Set();
const datasetWithCats = [];

const nlu = new NLU({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.NLU_API_KEY,
  }),
  serviceUrl: process.env.NLU_API_URL,
});

/**
 * Generates some text based of a course's information which is given to IBM watson's NLU
 * @function  getAnalysisText
 * @param     {Object.<String, String>}  course
 *    A course object containing: Title, Desc, (Link), Topic
 * @returns   {string}
 *  A piece of text generated from the course object, representing the course
 */
function getAnalysisText(course) {
  // this prompt seems to produce the most accurate IBM watson categories
  return `${course.Title} ${course.Topic}`;
  // return `${course.Title}\n${course.Description_short}`;
}

/**
 * Takes the results from IBM watson for a specific course and extracts the relevant
 *  information to be saved to disk
 * @function  processResults
 * @param     {*} course
 *    a course object, containing: Title, Desc, Link, Topic
 * @param     {*} result
 *    the results object returned by IBM watson's `nlu.analyze`
 */
function processResults(course, result) {
  if (result.status !== 200) {
    console.error(`ERROR ${result}`);
    process.exit(1);
  }

  // add topics to the checkboxCats set
  course.Topic
    .split(',')
    .map((topic) => checkboxCats.add(topic.trim()));

  // add embedding categories to embeddingCats set
  result.result.categories.forEach((cat) => {
    cat.label
      .slice(1) // remove first / from the cats
      .split('/')
      .forEach((label) => {
        embeddingCats.add(label);
      });
  });

  // add course with IBM Watson categories to dataset_with_categories.json
  datasetWithCats.push({
    input: course,
    categories: result.result.categories,
  });
}

/**
 * Performs the request to IBM Watson NLU via their SDK provided by the NPM package.
 * The results of this NLU request is returned.
 * @function analyseCourse
 * @param    {Object} course
 * @returns  {NLU.AnalysisResults}
 */
async function analyseCourse(course) {
  return nlu.analyze({
    text: getAnalysisText(course),
    features: {
      categories: {
        limit: 20,
      },
    },
  });
}

/**
 * Writes the preprocessing results to disk.
 * `checkboxCats` and `embeddingCats` are first sorted before being written.
 * @function saveResults
 * @param   {string}  dst
 */
function saveResults(dst) {
  // after all courses have been processed, saved new datasets to disk
  fs.writeFileSync(`${dst}/checkbox_categories.json`, JSON.stringify([...checkboxCats].sort(), null, 2));
  fs.writeFileSync(`${dst}/embedding_categories.json`, JSON.stringify([...embeddingCats].sort(), null, 2));
  fs.writeFileSync(`${dst}/dataset_with_categories.json`, JSON.stringify(datasetWithCats, null, 2));
  console.log('Data saved to disk.');
}

/**
 * Iterates throught the dataset, analysing each course and saving the results.
 * The results stored in `checkboxCats`, `embeddingCats`, and `datasetWithCats`
 *   are then written to disk.
 * @function  processDataset
 * @param {*} path  the path of the dataset file
 * @param {*} dst   the directory for the processed data to be saved to
 */
async function processDataset(path, dst) {
  const dataset = JSON.parse(fs.readFileSync(path, 'utf8'));

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  // using tqdm to output a progress bar for which courses have been processed.
  for (const course of tqdm(dataset)) {
    try {
      // analyse and process results
      const result = await analyseCourse(course);
      processResults(course, result);
    } catch (err) {
      // an error may be thrown by IBM Watson in `analyseCourse`
      console.error(`ERROR processing course ${course.Title}\n${err}`);
      process.exit(1); // stop program to fix error
    }
  }

  // after dataset is processed, save results to disk
  saveResults(dst);
}

module.exports = {
  getAnalysisText,
  processResults,
  processDataset,
};

const fs = require('fs');
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
  // return `${course.Description_short}`;
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
  course.Topic
    .split(',')
    .map((topic) => checkboxCats.add(topic.trim()));

  result.result.categories.forEach((cat) => {
    cat.label
      .slice(1) // remove first / from the cats
      .split('/')
      .forEach((label) => {
        embeddingCats.add(label);
      });
  });
  datasetWithCats.push({
    input: course,
    categories: result.result.categories,
  });
}

/**
 * Processes the entire dataset by calling the `processCourse` function for each course
 * The results stored in `checkboxCats`, `embeddingCats`, and `datasetWithCats`
 *   are written to disk.
 * @function  processDataset
 * @param {*} path
 *    the path of the dataset file
 * @param {*} dst
 *    the directory for the processed data to be saved to
 */
async function processDataset(path, dst) {
  const dataset = JSON.parse(fs.readFileSync(path, 'utf8'));
  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  for (const course of dataset) {
    try {
      const result = await nlu.analyze({
        text: getAnalysisText(course),
        features: {
          categories: {
            limit: 20,
          },
        },
      });
      console.log(`Processing ${course.Title}`);
      processResults(course, result);
    } catch (err) {
      console.error(`ERROR ${err}`);
      process.exit(1);
    }
  }

  // after all courses have been processed, saved new datasets to disk
  fs.writeFileSync(`${dst}/checkbox_categories.json`, JSON.stringify([...checkboxCats].sort(), null, 2));
  fs.writeFileSync(`${dst}/embedding_categories.json`, JSON.stringify([...embeddingCats].sort(), null, 2));
  fs.writeFileSync(`${dst}/dataset_with_categories.json`, JSON.stringify(datasetWithCats, null, 2));
  console.log('Data saved to disk.');
}

module.exports = {
  getAnalysisText,
  processResults,
  processDataset,
};

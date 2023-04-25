const fs = require('fs');
const imports = require('../src/api/search');

function loadData(path) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

const tests = loadData('test/TestCases/tests.json');
const testEmbs = loadData('test/TestCases/embeddings.json');
const testDatasets = loadData('test/TestCases/sortedDataset.json');
const testCheckbox = tests.exampleCheckboxes;
const testCourses = tests.exampleCourses;

// testing the MSE function
describe('MSE - takes 2 embedding objects and returns the Mean Squared Error', () => {
  test('Sample Embeddings (1, 2)', () => {
    expect(imports.MSE(testEmbs[0], testEmbs[1])).toBe(0.07919805826747299);
  });
  test('Sample Embeddings (2, 1) [Same as (1, 2)]', () => {
    expect(imports.MSE(testEmbs[1], testEmbs[0])).toBe(imports.MSE(testEmbs[0], testEmbs[1]));
  });
  test('Sample Embeddings (3, 4)', () => {
    expect(imports.MSE(testEmbs[2], testEmbs[3])).toBe(0.08364127324262162);
  });
  test('Sample Embeddings (4, 5)', () => {
    expect(imports.MSE(testEmbs[3], testEmbs[4])).toBe(0.053844795791729724);
  });
  test('Same Embeddings, should result in [0]', () => {
    expect(imports.MSE(testEmbs[0], testEmbs[0])).toBe(0);
  });
});

// Testing the parseOffset function
describe('parseOffset - parses the query parameter "offset" passed from the frontend', () => {
  test('["-1"] should result in [0]', () => {
    expect(imports.parseOffset('0')).toBe(0);
  });
  test('["0"] should result in [0]', () => {
    expect(imports.parseOffset('0')).toBe(0);
  });
  test('["5"] should result in [5]', () => {
    expect(imports.parseOffset('5')).toBe(5);
  });
  test('["100"] should result in [100]', () => {
    expect(imports.parseOffset('100')).toBe(100);
  });
  test('[undefined] should result in [0]', () => {
    expect(imports.parseOffset(undefined)).toBe(0);
  });
  test('["abc"] should result in [0]', () => {
    expect(imports.parseOffset('abc')).toBe(0);
  });
  test('["5a"] should result in [0]', () => {
    expect(imports.parseOffset('0')).toBe(0);
  });
});

/* testing the parseCheckboxes function using the example test results
   in the TestCases/tests.json file */
describe('ParseCheckboxes - parses the query parameter "checkboxes" passed from the frontend', () => {
  test('["-1"] should result in [ignored]', () => {
    expect(imports.parseCheckboxes('0')).toStrictEqual(testCheckbox.ignore);
  });
  test('["0"] should result in [ignored]', () => {
    expect(imports.parseCheckboxes('0')).toStrictEqual(testCheckbox.ignore);
  });
  test('["1000000"] should result in [ignored]', () => {
    expect(imports.parseCheckboxes('1000000')).toStrictEqual(testCheckbox.ignore);
  });
  test('[undefined] should result in [ignored]', () => {
    expect(imports.parseCheckboxes(undefined)).toStrictEqual(testCheckbox.ignore);
  });
  test('["abc"] should result in [ignored]', () => {
    expect(imports.parseCheckboxes('abc')).toStrictEqual(testCheckbox.ignore);
  });
  test('["10a"] should result in [ignored]', () => {
    expect(imports.parseCheckboxes('10a')).toStrictEqual(testCheckbox.ignore);
  });
  test('["8"] should result in [Category Object]', () => {
    expect(imports.parseCheckboxes('8')).toStrictEqual(testCheckbox['8']);
  });
  test('["156"] should result in [Category Object]', () => {
    expect(imports.parseCheckboxes('156')).toStrictEqual(testCheckbox['156']);
  });
  test('["1022"] should result in [Category Object]', () => {
    expect(imports.parseCheckboxes('1022')).toStrictEqual(testCheckbox['1022']);
  });
  test('["1023"] should result in [Category Object]', () => {
    expect(imports.parseCheckboxes('1023')).toStrictEqual(testCheckbox['1023']);
  });
});

// testing the checkboxAllowed function
describe('checkboxAllowed - determines whether a course should/not be filtered by the given checkboxes', () => {
  test('Sample data with categories (1) [Ignored]', () => {
    expect(imports.checkboxAllowed(testCourses[0], testCheckbox.ignore)).toStrictEqual(true);
  });
  test('Sample data with categories (1) [Allowed]', () => {
    expect(imports.checkboxAllowed(testCourses[0], testCheckbox['3'])).toStrictEqual(true);
  });
  test('Sample data with categories (1) [NOT allowed]', () => {
    expect(imports.checkboxAllowed(testCourses[0], testCheckbox['8'])).toStrictEqual(false);
  });
  test('Sample data with categories (2) [Ignored]', () => {
    expect(imports.checkboxAllowed(testCourses[1], testCheckbox.ignore)).toStrictEqual(true);
  });
  test('Sample data with categories (2) [Allowed]', () => {
    expect(imports.checkboxAllowed(testCourses[1], testCheckbox['156'])).toStrictEqual(true);
  });
  test('Sample data with categories (2) [NOT allowed]', () => {
    expect(imports.checkboxAllowed(testCourses[1], testCheckbox['8'])).toStrictEqual(false);
  });
  test('Allowing everything', () => {
    expect(imports.checkboxAllowed(testCourses[0], testCheckbox['1023'])).toStrictEqual(true);
  });
});

// testing the getEmbeddings function
// note, the exampleEmbeddings in tests.json are derived from the exampleCourses in the same file
describe('getEmbeddings - converts the category data returned by IBM Watson into an embedding object', () => {
  test('Sample categories (1)', () => {
    expect(imports.getEmbeddings(testCourses[0].categories)).toStrictEqual(testEmbs[0]);
  });
  test('Sample categories (2)', () => {
    expect(imports.getEmbeddings(testCourses[1].categories)).toStrictEqual(testEmbs[1]);
  });
  test('Sample categories (3)', () => {
    expect(imports.getEmbeddings(testCourses[2].categories)).toStrictEqual(testEmbs[2]);
  });
  test('Sample categories (4)', () => {
    expect(imports.getEmbeddings(testCourses[3].categories)).toStrictEqual(testEmbs[3]);
  });
  test('Sample categories (5)', () => {
    expect(imports.getEmbeddings(testCourses[4].categories)).toStrictEqual(testEmbs[4]);
  });
  test('[empty list] should results in zero\'d embedding object', () => {
    expect(imports.getEmbeddings([])).toStrictEqual(testEmbs[5]); // testEmbs[5] is zero'd
  });
  test('[undefined] should results in zero\'d embedding object', () => {
    expect(imports.getEmbeddings(undefined)).toStrictEqual(testEmbs[5]);
  });
});

describe('embeddingSort - sorts the dataset based on the user\'s embedding object', () => {
  test('Sample User Emb (1), with checkboxes ignored', () => {
    expect(imports.embeddingSort(tests.exampleUserEmbs[0], testCheckbox.ignore))
      .toStrictEqual(testDatasets[0]);
  });
  test('Sample User Emb (2), with checkboxes ignored', () => {
    expect(imports.embeddingSort(tests.exampleUserEmbs[1], testCheckbox.ignore))
      .toStrictEqual(testDatasets[1]);
  });
  test('Sample User Emb (2), with checkboxes filtering', () => {
    expect(imports.embeddingSort(tests.exampleUserEmbs[1], testCheckbox['8']))
      .toStrictEqual(testDatasets[2]);
  });
});

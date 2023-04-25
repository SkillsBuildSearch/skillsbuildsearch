const fs = require('fs');
const imports = require('../src/prebuild/prebuild');

const dataset = JSON.parse(fs.readFileSync('data/dataset.json', 'utf8'));
const embeddingCats = JSON.parse(fs.readFileSync('data/embedding_categories.json', 'utf8'));

/*
module.exports = {
  getAnalysisText,
  processResults,
  processDataset,
};
*/

describe('GetAnalysisText', () => {
  test('Correct course object', () => {
    /* eslint-disable max-len */
    // expect(imports.getAnalysisText(dataset[0])).toBe(`${dataset[0].Title} ${dataset[0].Topic} ${dataset[0].Description_short}`);
    expect(imports.getAnalysisText(dataset[0])).toBe(`${dataset[0].Description_short}`);
  });
  test('["5"] should result in [5]', () => {
    expect(imports.parseOffset('5')).toBe(5);
  });
  test('["100"] should result in [100]', () => {
    expect(imports.parseOffset('100')).toBe(100);
  });
  test('["0"] should result in [0]', () => {
    expect(imports.parseOffset('0')).toBe(0);
  });
});

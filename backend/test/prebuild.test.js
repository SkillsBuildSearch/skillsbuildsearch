const fs = require('fs');
const imports = require('../src/prebuild/prebuild');

const dataset = JSON.parse(fs.readFileSync('data/dataset.json', 'utf8'));

// Testing the getAnalysisText function
describe('getAnalysisText - returns the text used for Watson analysis from a course object', () => {
  test('Correct course object 1', () => {
    expect(imports.getAnalysisText(dataset[0])).toBe(`${dataset[0].Title} ${dataset[0].Topic}`);
  });
  test('Correct course object 2', () => {
    expect(imports.getAnalysisText(dataset[1])).toBe(`${dataset[1].Title} ${dataset[1].Topic}`);
  });
  test('Correct course object 3', () => {
    expect(imports.getAnalysisText(dataset[2])).toBe(`${dataset[2].Title} ${dataset[2].Topic}`);
  });
  test('Correct course object 4', () => {
    expect(imports.getAnalysisText(dataset[3])).toBe(`${dataset[3].Title} ${dataset[3].Topic}`);
  });
  test('Empty object returns empty string', () => {
    expect(imports.getAnalysisText({})).toBe('');
  });
  test('[undefined]', () => {
    expect(imports.getAnalysisText(undefined)).toBe('');
  });
});

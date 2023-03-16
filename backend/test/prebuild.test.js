const fs = require('fs');
const imports = require('../src/prebuild/prebuild');

const dataset = JSON.parse(fs.readFileSync('data/dataset.json', 'utf8'));
const embeddingCats = JSON.parse(fs.readFileSync('data/embedding_categories.json', 'utf8'));


// Testing the getAnalysisText function
describe('getAnalysisText - returns the text used for Watson analysis from a course object', () => {
    test('Correct course object', () => {
      expect(imports.getAnalysisText(dataset[0])).toBe(`${dataset[0].Description_short}`);
    });
    test('Object with no description should be detected', () => {
      expect(imports.getAnalysisText({"Title": "Test", "Link": "localhost", "Topic": "Test"})).toBe(undefined);
    });
    test('[undefined]', () => {
      expect(imports.getAnalysisText(undefined)).toBe(undefined);
    });
    test('Empty object', () => {
      expect(imports.getAnalysisText({})).toBe(undefined);
    });
});

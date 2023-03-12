let imports = require('../src/prebuild/prebuild')
const fs = require('fs');
let dataset = JSON.parse(fs.readFileSync('data/dataset.json', 'utf8'))
let embeddingCats = JSON.parse(fs.readFileSync('data/embedding_categories.json', 'utf8'))

/*
module.exports = {
    timeout,
    getAnalysisText,
    processResults,
    processCourse,
    processDataset,
  };
*/

describe('GetAnalysisText', () => {
    test('Correct course object', () => {
        expect(imports.getAnalysisText(dataset[0])).toBe(`${dataset[0].Title} ${dataset[0].Topic} ${dataset[0].Description_short}`)
    });
    test('["5"] should result in [5]', () => {
        expect(imports.parseOffset("5")).toBe(5)
    });
    test('["100"] should result in [100]', () => {
        expect(imports.parseOffset("100")).toBe(100)
    });
    test('["0"] should result in [0]', () => {
        expect(imports.parseOffset("0")).toBe(0)
    });
})
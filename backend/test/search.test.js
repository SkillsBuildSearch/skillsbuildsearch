let imports = require('../src/api/search')
const fs = require('fs');
let dataset = JSON.parse(fs.readFileSync('data/dataset_with_categories.json', 'utf8'))
let embeddingCats = JSON.parse(fs.readFileSync('data/embedding_categories.json', 'utf8'))

//const checkboxCats = JSON.parse(fs.readFileSync('data/checkbox_categories.json', 'utf8'));

/*
module.exports = {
    router,
    MSE,
    parseOffset, DONE
    parseCheckboxes, DONE
    checkboxAllowed, DONE
    getEmbeddings, DONE
    embeddingSort,
  };
*/

describe('ParseOffset', () => {
    test('["-1"] should result in [0]', () => {
        expect(imports.parseOffset("0")).toBe(0)
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

describe('ParseCheckboxes', () => {
    test('["8"] should result in [Category Object]', () => {
        expect(imports.parseCheckboxes("8")).toStrictEqual(
            {"Artificial Intelligence": 0, "Capstone": 0, "Data Science": 0, "IBM Automation": 8, "IBM Cloud": 0, "IBM Engineering": 0, "IBM Quantum": 0, "IBM Security": 0, "IBM Z": 0, "Red Hat Academy": 0, "ignore": false})
    });
    test('["0"] should result in [ignored]', () => {
        expect(imports.parseCheckboxes("0")).toStrictEqual(
            {"ignore": true})
    });
    test('["-1"] should result in [ignored]', () => {
        expect(imports.parseCheckboxes("0")).toStrictEqual(
            {"ignore": true})
    });
    test('["156"] should result in [Category Object]', () => {
        expect(imports.parseCheckboxes("156")).toStrictEqual(
            {"Artificial Intelligence": 0, "Capstone": 0, "Data Science": 4, "IBM Automation": 8, "IBM Cloud": 16, "IBM Engineering": 0, "IBM Quantum": 0, "IBM Security": 0, "IBM Z": 128, "Red Hat Academy": 0, "ignore": false})
    });
    test('["1000000"] should result in [ignored]', () => {
        expect(imports.parseCheckboxes("1000000")).toStrictEqual(
            {"ignore": true})
    });
})

describe('CheckboxAllowed', () => {
    test('Sample data with categories', () => {
        expect(imports.checkboxAllowed(dataset[0], {"Artificial Intelligence": 0, "Capstone": 0, "Data Science": 4, "IBM Automation": 8, "IBM Cloud": 16, "IBM Engineering": 0, "IBM Quantum": 0, "IBM Security": 0, "IBM Z": 128, "Red Hat Academy": 0, "ignore": false})).toStrictEqual(false)
    });
    test('Allowing everything', () => {
        expect(imports.checkboxAllowed(dataset[0], {"Artificial Intelligence": 0, "Capstone": 0, "Data Science": 0, "IBM Automation": 0, "IBM Cloud": 0, "IBM Engineering": 0, "IBM Quantum": 0, "IBM Security": 0, "IBM Z": 0, "Red Hat Academy": 0, "ignore": true})).toStrictEqual(true)
    });
    test('Allowing nothing', () => {
        expect(imports.checkboxAllowed(dataset[0], {"Artificial Intelligence": 0, "Capstone": 0, "Data Science": 0, "IBM Automation": 0, "IBM Cloud": 0, "IBM Engineering": 0, "IBM Quantum": 0, "IBM Security": 0, "IBM Z": 0, "Red Hat Academy": 0, "ignore": false})).toStrictEqual(false)
    });
})

describe('GetEmbeddings', () => {
    test('Vaild category object', () => {
        expect(imports.getEmbeddings([{score: 0.8, label:'/science/artificial intelligence'}]))
        .toStrictEqual(getExpectedEmbeddings(['science', 'artificial intelligence'], [0.8, 0.8]));
    });
    test('Empty category object should result in all 0', () => {
        expect(imports.getEmbeddings([])).toStrictEqual(getExpectedEmbeddings([], []));
    });
    test('Many entry category object', () => {
        expect(imports.getEmbeddings([{score: 0.8, label:'/science/artificial intelligence'}, {score: 0.2, label:'/science/artificial intelligence/video gaming'}]))
        .toStrictEqual(getExpectedEmbeddings(['science', 'artificial intelligence', 'video gaming'], [0.8, 0.8, 0.2]));
    });
})

function getExpectedEmbeddings(categories, scores) {
    expectedEmbeddings = {};
    embeddingCats.forEach((cat) => {
        expectedEmbeddings[cat] = 0.0;
    })
    categories.forEach((cat, index) => {
        expectedEmbeddings[cat] = scores[index];
    })
    return expectedEmbeddings;
}

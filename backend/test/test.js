const fs = require('fs');
const imports = require('../src/api/search');

const tests = JSON.parse(fs.readFileSync('test/TestCases/tests.json', 'utf-8'));

const usercat1 = [{
  score: 0.974827,
  label: '/technology & computing/computing/internet/cloud computing',
}];
const usercat2 = [{
  score: 0.99996,
  label: '/technology & computing/artificial intelligence',
}];

const res1 = imports.embeddingSort(usercat1, tests.exampleCheckboxes.ignore);
const res2 = imports.embeddingSort(usercat2, tests.exampleCheckboxes.ignore);
const res3 = imports.embeddingSort(usercat2, tests.exampleCheckboxes['8']);

fs.writeFileSync('test/TestCases/sortedDataset.json', JSON.stringify([res1, res2, res3], null, 4));
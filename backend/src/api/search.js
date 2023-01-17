const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (!req.query.text) {
    res.json([]);
  } else if (req.query.text === 'example1') {
    res.json([
      {
        Title: 'Getting Started with Enterprise-grade AI',
        Description_short:
          'This course covers the foundations of Artificial Intelligence for business, including the following topics: AI Evolution, AI Industry Adoption Trends, Natural Language Processing and Virtual Agents.',
        Link: 'https://www.ibm.com/academic/topic/artificial-intelligence?ach_id=256c0f15-a1f2-4b9e-b672-63f4d8b20018',
        Topic: 'Artificial Intelligence, Capstone',
      },
    ]);
  } else if (req.query.text === 'example2') {
    res.json([
      {
        Title: 'OpenDS4All',
        Description_short:
          'OpenDS4All is a project created to accelerate the creation of data science curriculum at academic institutions. The project hosts educational modules that may be used as building blocks for a data science curriculum.',
        Link: 'https://github.com/odpi/OpenDS4All/',
        Topic: 'Artificial Intelligence, Data Science',
      },
      {
        Title: 'IBM Watson Machine Learning Essentials',
        Description_short:
          'Watson Machine Learning is a service on IBM Cloud with features for training and deploying machine learning models and neural networks. This course consists of a series of videos showing how to use the Watson Machine Learning in Watson Studio.',
        Link: 'https://www.ibm.com/academic/topic/artificial-intelligence?ach_id=463ba684-87d1-4355-853a-ec66814584d9',
        Topic: 'Artificial Intelligence',
      },
    ]);
  }
});

module.exports = router;

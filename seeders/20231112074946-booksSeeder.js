'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Stock = Math.floor(Math.random() * 21); 
    return queryInterface.bulkInsert('Books', [
      {
        title: 'Physics I For Dummies',
        isbn: '9781119872221',
        stock: Stock,
        publisher: 'For Dummies',
        image: 'https://res.cloudinary.com/dv1ub4ivc/image/upload/v1701572554/bookish/ibjkwueoelq8nlin5sdj.jpg',
        available: Stock > 0,
        description: 'physics for dummies 3rd edition',
        author: 'Steven Holzner',
        releasedate: '2022-03-29',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Atomic Habits: An Easy and Proven Way to Build Good Habits and Break Bad Ones',
        isbn: '9781847941848',
        stock: Stock,
        publisher: 'Random House Business Books',
        image: 'https://res.cloudinary.com/dv1ub4ivc/image/upload/v1701574549/bookish/y1ughootapjbskteuesl.jpg',
        available: Stock > 0,
        description: 'A supremely practical and useful book. James Clear distils the most fundamental information about habit formation, so you can accomplish more by focusing on less.',
        author: 'James Clear',
        releasedate: '2018-10-16',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Eloquent JavaScript, 3rd Edition: A Modern Introduction to Programming',
        isbn: '9781593279509',
        stock: Stock,
        publisher: 'No Starch Press',
        image: 'https://res.cloudinary.com/dv1ub4ivc/image/upload/v1702729807/bookish/n2v3dywo2rraphytvu2y.jpg',
        available: Stock > 0,
        description: 'javascript book for people.',
        author: 'Marijn Haverbeke',
        releasedate: '2018-12-04',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add more books as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Books', null, {});
  }
};

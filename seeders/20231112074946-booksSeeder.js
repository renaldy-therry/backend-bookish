'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const books = [];
    for (let i = 0; i < 10; i++) {
      const Stock = Math.floor(Math.random() * 21); 
      books.push({
        title: faker.lorem.words(3),
        stock: Stock,
        available: Stock > 0,  // Randomly assign true or false
        description: faker.lorem.paragraph(),
        author: faker.person.fullName()
      });
    }
    await queryInterface.bulkInsert('Books', books, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
};


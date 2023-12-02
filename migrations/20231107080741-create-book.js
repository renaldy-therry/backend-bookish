'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      isbn: {
        allowNull: false,
        type: Sequelize.STRING(17)
      },
      stock: {
        type: Sequelize.INTEGER
      },
      publisher: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      available: {
        type: Sequelize.BOOLEAN
      },
      description: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      releasedate: {
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATEONLY
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Books');
  }
};
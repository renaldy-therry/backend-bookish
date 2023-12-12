'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('return_books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      charge: {
        type: Sequelize.INTEGER
      },
      late_time: {
        type: Sequelize.INTEGER
      },
      returned_at: {
        type: Sequelize.DATEONLY
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // name of the source table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      book_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Books', // name of the source table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      borrow_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'borrow_books', // name of the source table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      proof_image: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('return_books');
  }
};
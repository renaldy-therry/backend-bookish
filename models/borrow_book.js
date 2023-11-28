'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class borrow_book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      borrow_book.belongsTo(models.User, {foreignKey: 'user_id'}); // Adds UserId to BorrowBook model
      borrow_book.belongsTo(models.Book, {foreignKey: 'book_id'}); // Adds BookId to BorrowBook model
      borrow_book.hasMany(models.return_book , {foreignKey: 'borrow_id'});
      // define association here
    }
  }
  borrow_book.init({
    status: DataTypes.STRING,
    deadline_at: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'borrow_book',
  });
  return borrow_book;
};
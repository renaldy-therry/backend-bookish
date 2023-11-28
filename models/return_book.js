'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class return_book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      return_book.belongsTo(models.User, {foreignKey: 'user_id'}); // Adds UserId to BorrowBook model
      return_book.belongsTo(models.Book, {foreignKey: 'book_id'}); // Adds BookId to BorrowBook model
      return_book.belongsTo(models.borrow_book, {foreignKey: 'borrow_id'});
      // define association here
    }
  }
  return_book.init({
    charge: DataTypes.INTEGER,
    late_time: DataTypes.INTEGER,
    returned_at: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER,
    borrow_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'return_book',
  });
 
  return return_book;
};
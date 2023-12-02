'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // Instance method to handle borrowing a book
   
    static associate(models) {
      // define association here
      Book.hasMany(models.borrow_book, {foreignKey: 'book_id'});
    }
  }
  Book.init({
    title: DataTypes.STRING,
    isbn: DataTypes.STRING(17),
    stock: DataTypes.INTEGER,
    publisher: DataTypes.STRING,
    image: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    author: DataTypes.STRING,
    releasedate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};

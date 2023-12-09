const {borrow_book, User, Book} = require('../models');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('book_borrow_dev', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
});

// Create a new borrow book with stock validation
exports.createBorrowBook = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Retrieve the number of different books borrowed by the user
    const userBorrowedBooks = await borrow_book.findAndCountAll({
      where: { user_id: req.body.user_id },
      distinct: true,
      col: 'book_id',
      transaction
    });

    // Check if the user has not exceeded the maximum limit of borrowing different books
    if (userBorrowedBooks.count < 5) {
      // Check if the books are not already borrowed by the user
      const booksAlreadyBorrowed = await borrow_book.findAll({
        where: {
          user_id: req.body.user_id,
          book_id: req.body.book_id
        },
        transaction
      });

      if (booksAlreadyBorrowed.length === 0) {
        // Find the books by their IDs from the request body
        const books = await Book.findAll({ where: { id: req.body.book_id }, transaction });

        // Check if the number of found books matches the number of requested book ids
        if (!books) {
          return res.status(404).json({ error: 'Book not found' });
        }

        // Verify if the stock of all books is greater than 0
        const allBooksInStock = books.every((book) => book.stock > 0);
        if (allBooksInStock) {
          // Create the borrow books
          const borrowBooks = await borrow_book.create({
                user_id: req.body.user_id,
                book_id: req.body.book_id,
                status: 'borrowed',
                deadline_at: req.body.deadline_at
              }, { transaction });

          // Decrement the stock of all books by 1
          await Book.decrement('stock', { by: 1, where: { id: req.body.book_id }, transaction });

          // Commit the transaction
          await transaction.commit();

          res.status(201).json(borrowBooks);
        } else {
          res.status(400).json({ error: 'Book is out of stock' });
        }
      } else {
        res.status(400).json({ error: 'User has already borrowed  books' });
      }
    } else {
      // If the user has exceeded the maximum limit of borrowing different books, handle this scenario
      res.status(400).json({ error: 'User has exceeded the maximum limit of borrowing books' });
    }
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

  // Get all books
  exports.getAllBorrowBooks = async (req, res) => {
    try {
      const borrowBooks = await borrow_book.findAll({
        include: [{
          model: User,
          required: true, 
        }, {
          model: Book,
          required: true, 
        }]
      });

      const formattedBorrowBooks = borrowBooks.map(borrowBook => {
        const { User: user, Book: book, ...otherProps } = borrowBook.get();
        return {
          ...otherProps,
          user,
          book
        };
      });

      res.json(formattedBorrowBooks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };
  
  
  // Get a single book by ID
  exports.getBorrowBookById = async (req, res) => {
    try {
      const borrowBook = await borrow_book.findByPk(req.params.id, {
        include: [{
          model: User,
          required: true, 
         }, {
          model: Book,
          required: true, 
        }]
      });
      if (borrowBook) {
        res.json(borrowBook);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a book by ID
  exports.updateBorrowBook = async (req, res) => {
    try {
      const borrowBook = await borrow_book.findByPk(req.params.id);
      if (borrowBook) {
        await book.update(req.body);
        res.json(borrowBook);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Delete a book by ID
  exports.deleteBorrowBook = async (req, res) => {
    try {
      const borrowBook  = await borrow_book.findByPk(req.params.id);
      if (borrowBook ) {
        await borrowBook.destroy();
        res.json({ message: 'Book deleted' });
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
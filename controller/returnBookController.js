const {return_book,borrow_book, User, Book} = require('../models');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('book_borrow_dev', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
});

exports.createReturnBook = async (req, res) => {
  let transaction;
  try {
    const { borrow_id, returned_at } = req.body;

    // Validate required fields
    if (!borrow_id || !returned_at) {
      return res.status(400).json({ error: 'Borrow ID and Return Date are required.' });
    }

    // Validate borrow_id
    if (!(Number.isInteger(borrow_id) || (typeof borrow_id === 'string' && Number.isInteger(Number(borrow_id))))) {
      return res.status(400).json({ error: 'Borrow ID must be an integer or a string that can be converted to an integer.' });
    }

    // Validate returned_at
    if (isNaN(Date.parse(returned_at))) {
      return res.status(400).json({ error: 'Invalid return date.' });
    }

    // Find the borrow_book entry to check if the return_book can be created
    const borrowBook = await borrow_book.findOne({ where: { id: Number(borrow_id) } });

    if (!borrowBook) {
      return res.status(400).json({ error: 'Corresponding borrow_book entry not found. Unable to create return_book.' });
    }

    transaction = await sequelize.transaction();

    // Calculate the late time in days
    const deadlineDate = new Date(borrowBook.deadline_at);
    const currentDate = new Date();
    const lateTime = Math.max(Math.ceil((currentDate - deadlineDate) / (1000 * 60 * 60 * 24)), 0);

    // Calculate the charge
    const charge = (lateTime * 1000) - 1000;

    // Check if file was uploaded
    const { file } = req;
    if (!file) {
      return res.status(400).send({ error: 'No file uploaded.' });
    }

    // Create the return_book entry including the calculated late time
    const createdReturnBook = await return_book.create({
      user_id: borrowBook.user_id,
      book_id: borrowBook.book_id,
      borrow_id: borrowBook.id,
      returned_at: returned_at,
      late_time: lateTime,
      charge: charge,
      proof_image: file.path  // Save the URL of the uploaded file
    }, { transaction });

    const returnBookData = await return_book.findOne({
      where: { id: createdReturnBook.id },
      include: Book,
      transaction: transaction
    });
    // Increment the stock of the associated book by 1
    const returnBook = await Book.findByPk(borrowBook.book_id);
    if (returnBook) {
      await returnBook.increment('stock', { by: 1, transaction });
    } else {
      res.status(404).json({ error: 'Book record not found' });
    }

    // Delete the corresponding borrow_book entry
    await borrow_book.destroy({ where: { 
      book_id: borrowBook.book_id, 
      user_id: borrowBook.user_id 
    }, transaction });

    // Commit the transaction
    await transaction.commit();

    // Include the book data in the response
    res.status(201).json({ returnBookData });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};



// Get all return_books
exports.getAllReturnBooks = async (req, res) => {
  try {
    const returnBooks = await return_book.findAll();
    res.json(returnBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single return_book by ID
exports.getReturnBookById = async (req, res) => {
  try {
    const returnBook = await return_book.findByPk(req.params.id);
    if (returnBook) {
      res.json(returnBook);
    } else {
      res.status(404).json({ error: 'Return book record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a return_book by ID
exports.updateReturnBook = async (req, res) => {
  try {
    const returnBook = await return_book.findByPk(req.params.id);
    if (returnBook) {
      await returnBook.update(req.body);
      res.json(returnBook);
    } else {
      res.status(404).json({ error: 'Return book record not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a return_book by ID
exports.deleteReturnBook = async (req, res) => {
  try {
    const returnBook  = await return_book.findByPk(req.params.id);
    if (returnBook) {
      await returnBook.destroy();
      res.json({ message: 'Return book record deleted' });
    } else {
      res.status(404).json({ error: 'Return book record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const express = require('express');
const router = express.Router();
const borrowController = require('../controller/borrowBookController');

// Create a new book
router.post('/', borrowController.createBorrowBook);

// Get all books
router.get('/', borrowController.getAllBorrowBooks);

// Get a single book by ID
router.get('/:id', borrowController.getBorrowBookById);

// Update a book by ID
router.put('/:id', borrowController.updateBorrowBook);

// Delete a book by ID
router.delete('/:id', borrowController.deleteBorrowBook);

module.exports = router;

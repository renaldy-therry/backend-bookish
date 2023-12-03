const express = require('express');
const router = express.Router();
const booksController = require('../controller/booksController');

// Create a new book
router.post('/', booksController.createBook);

// Get all books
router.get('/', booksController.getAllBooks);

router.get('/isbn/:isbn', booksController.getBookByIsbn);

// Get a single book by ID
router.get('/:id', booksController.getBookById);

// Update a book by ID
router.put('/:id', booksController.updateBook);

// Delete a book by ID
router.delete('/:id', booksController.deleteBook);

module.exports = router;

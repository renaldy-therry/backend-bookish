const express = require('express');
const router = express.Router();
const returnController = require('../controller/returnBookController');
const imageControl = require('../src/middleware/image');

// Create a new book
router.post('/', imageControl.uploadFile, returnController.createReturnBook);

// Get all books
router.get('/', returnController.getAllReturnBooks);

// Get a single book by ID
router.get('/:id', returnController.getReturnBookById);

// Update a book by ID
router.put('/:id', returnController.updateReturnBook);

// Delete a book by ID
router.delete('/:id', returnController.deleteReturnBook);

module.exports = router;
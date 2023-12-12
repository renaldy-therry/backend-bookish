const { Book } = require('../models');
const cloudinary = require('cloudinary').v2;



exports.createBook = async (req, res) => {
  try {
    const { title, isbn, stock, publisher, image, description, author, releasedate } = req.body;

    // Validate required fields
    if (!title || !isbn || !publisher || !author) {
      return res.status(400).json({ error: 'Title, ISBN, publisher, and author are required.' });
    }

    if (typeof title !== 'string') {
      return res.status(400).json({ error: 'Title must be a string' });
    }

    // Validate ISBN
    if (typeof isbn !== 'string' || isbn.length > 17) {
      return res.status(400).json({ error: 'ISBN must be a string of maximum 17 characters.' });
    }

    // Validate stock
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative number.' });
    }

    // Validate release date
    if (releasedate && isNaN(Date.parse(releasedate))) {
      return res.status(400).json({ error: 'Invalid release date.' });
    }

    // If stock is more than 0, set available to true, otherwise set it to false.
    const available = stock > 0;

    const book = await Book.create({
      title,
      isbn,
      stock,
      publisher,
      image,
      description,
      author,
      releasedate,
      available
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a book by isbn
exports.getBookByIsbn = async (req, res) => {
  try {
    const book = await Book.findOne({ where: { isbn: req.params.isbn } });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a book by ID
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a book by ID
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.json({ message: 'Book deleted' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

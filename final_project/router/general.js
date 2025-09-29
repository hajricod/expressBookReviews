const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  // const titles = Object.values(books).map(book => book.title);
  // res.json(titles);
  // res.send(JSON.stringify(books,null,4));
    try {

    // Using local books object for demonstration
    const titles = Object.values(books).map(book => book.title);
    res.json(titles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    // const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    // const book = response.data;

    // Using local books object for demonstration
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  /*
    const requestedAuthor = req.params.author.toLowerCase().normalize("NFC");
    const matchingBooks = Object.values(books).filter(book => 
      book.author.toLowerCase().normalize("NFC") === requestedAuthor
    );
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({message: "No books found for this author"});
    }
  */

    try {
    // Using local books object for demonstration
    const requestedAuthor = req.params.author.toLowerCase().normalize("NFC");
    const matchingBooks = Object.values(books).filter(book =>
      book.author.toLowerCase().normalize("NFC") === requestedAuthor
    );
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const requestedTitle = req.params.title.toLowerCase().normalize("NFC");
  const matchingBooks = Object.values(books).filter(book =>
    book.title.toLowerCase().normalize("NFC") === requestedTitle
  );
  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

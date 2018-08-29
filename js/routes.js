// Routing declarations
const express = require('express');
const router = express.Router();
const Book = require("../models").books;

// Render home page route
router.get('/', (req, res) => {
    res.render('home');
});

// Book Routes
router.get('/books', (req, res) => {
    Book.findAll().then(function(books){
        res.render('all_books', {books:books});
    });
});
router.get('/new_book', (req, res) => {
    res.render('new_book', {
        book: Book.build(req.body)
    });
});
router.post('/new_book', function(req, res, next) {
    Book.create(req.body).then(function(){
        res.redirect('/books');
    }).catch(function(err){
        if(err.name === "SequelizeValidationError") {
            res.render("new_book", {
              book: Book.build(req.body),
              errors: err.errors
            });
          } else {
            throw err;
          }
    }).catch(function(err){
        res.status(500).send(err);
    });
});

router.get('/loans', (req, res) => {
    res.render('all_loans');
});
router.get('/patrons', (req, res) => {
    res.render('all_patrons');
});
router.get('/overdue_books', (req, res) => {
    res.render('overdue_books');
});
router.get('/checked_books', (req, res) => {
    res.render('checked_books');
});
router.get('/new_patron', (req, res) => {
    res.render('new_patron');
});
router.get('/new_loan', (req, res) => {
    res.render('new_loan');
});
router.get('/overdue_loans', (req, res) => {
    res.render('overdue_loans');
});
router.get('/checked_loans', (req, res) => {
    res.render('checked_loans');
});
router.get('/book_detail', (req, res) => {
    res.render('book_detail');
});
router.get('/return_book', (req, res) => {
    res.render('return_book');
});
router.get('/patron_detail', (req, res) => {
    res.render('patron_detail');
});

module.exports = router;

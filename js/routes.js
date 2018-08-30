// Routing declarations
const express = require('express');
const router = express.Router();
const Book = require("../models").books;
const Loan = require("../models").loans;
const Patron = require("../models").patrons;

// Render home page route
router.get('/', (req, res) => {
    res.render('home');
});

// Book routes
router.get('/books', (req, res) => {
    Book.findAll().then(function(books){
        res.render('all_books', {books:books});
    }).catch(function(err) {
        res.status(500);
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
        res.status(500);
    });
});
router.get('/overdue_books', (req, res) => {
    res.render('overdue_books');
});
router.get('/checked_books', (req, res) => {
    res.render('checked_books');
});
router.get('/book_detail', (req, res) => {
    res.render('book_detail');
});
router.get('/return_book', (req, res) => {
    res.render('return_book');
});

// Loan routes
router.get('/loans', (req, res) => {
    Loan.findAll().then(function(loans){
        res.render('all_loans', {loans:loans});
    }).catch(function(err) {
        res.status(500);
    });
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

// Patron routes
router.get('/patrons', (req, res) => {
    Patron.findAll().then(function(patrons){
        res.render('all_patrons', {patrons:patrons});
    }).catch(function(err) {
        res.status(500);
    });
});
router.get('/new_patron', (req, res) => {
    res.render('new_patron');
});
router.get('/patron_detail', (req, res) => {
    res.render('patron_detail');
});

module.exports = router;

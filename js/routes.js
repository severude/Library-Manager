// Routing declarations
const express = require('express');
const router = express.Router();
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;
// const Op = Sequelize.Op;

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
    Loan.findAll({
        include: [
            {model: Book},
            {model: Patron}
        ]
    }).then(function(loans){
        res.render('all_loans', {loans:loans});
    }).catch(function(err) {
        res.status(500);
    });
});
router.get('/new_loan', (req, res) => {
    const date = new Date();
    const today = date.toLocaleDateString();
    date.setDate(date.getDate() + 7);
    const dueDate = date.toLocaleDateString();    
    
    Book.findAll()
    .then(books => {
        Patron.findAll()
        .then(patrons => {
            res.render('new_loan', {
                books: books,
                patrons: patrons,
                today: today,
                dueDate: dueDate
            });
        });
    }).catch(function(err) {
        res.status(500);
    });
});
router.post('/new_loan', (req, res) => {
    Loan.create(req.body).then(function(){
        res.redirect('/loans');
    }).catch(function(err){
        if(err.name === "SequelizeValidationError") {
            res.render("new_loan", {
              loan: Loan.build(req.body),
              errors: err.errors
            });
          } else {
            throw err;
          }
    }).catch(function(err){
        res.status(500);
    });
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
    res.render('new_patron', {
        patron: Patron.build(req.body)
    });
});
router.post('/new_patron', (req, res) => {
    Patron.create(req.body).then(function(){
        res.redirect('/patrons');
    }).catch(function(err){
        if(err.name === "SequelizeValidationError") {
            res.render("new_patron", {
              patron: Patron.build(req.body),
              errors: err.errors
            });
          } else {
            throw err;
          }
    }).catch(function(err){
        res.status(500);
    });
});
router.get('/patron_detail', (req, res) => {
    res.render('patron_detail');
});

module.exports = router;

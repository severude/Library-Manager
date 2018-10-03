// Routing declarations
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;

// Book routes

// Show all books
router.get('/', (req, res) => {
    Book.findAll().then(books => {
        res.render('all_books', {books});
    }).catch(err => {
        res.status(500);
    });
});

// Show form for new book
router.get('/new_book', (req, res) => {
    res.render('new_book', {
        book: Book.build(req.body)
    });
});

// Post new book and redirect to books page
router.post('/new_book', (req, res, next) => {
    Book.create(req.body).then(() => {
        res.redirect('/books');
    }).catch(err => {
        if(err.name === "SequelizeValidationError") {
            res.render("new_book", {
              book: Book.build(req.body),
              errors: err.errors
            });
          } else {
            throw err;
          }
    }).catch(err => {
        res.status(500);
    });
});

// Show all checked out books
router.get('/checked_books', (req, res) => {
    Book.findAll({
        include: [{
            model: Loan,
            where: {
                loaned_on: { 
                    [Op.lt]: Date.now() 
                },
                returned_on: { 
                    [Op.eq]: null 
                }
            }
        }]
    }).then(books => {
        res.render('checked_books', {books});
    }).catch(err => {
        res.status(500);
    });
});

// Show all overdue books
router.get('/overdue_books', (req, res) => {
    Book.findAll({
        include: [{
            model: Loan,
            where: {
                return_by: { 
                    [Op.lt]: Date.now() 
                },
                returned_on: { 
                    [Op.eq]: null
                }
            }
        }]
    }).then(books => {
        res.render('overdue_books', {books});
    }).catch(err => {
        res.status(500);
    });
});

// Show individual book detail
router.get('/book_detail/:id', (req, res) => {
    Book.findById(req.params.id)
    .then(book => {
        Loan.findAll({
            include: [
                {model: Book},
                {model: Patron}
            ],
            where: {
                book_id: req.params.id
            }
        }).then(loans => {
            res.render('book_detail', {book, loans});
        })
    })
});

// Update individual book detail
router.put('/book_detail/:id', (req, res, next) => {
    Book.findById(req.params.id)
    .then(book => book.update(req.body))
    .then(() => res.redirect('/books'))
    .catch(err => {
        if(err.name === "SequelizeValidationError") {
            Book.findById(req.params.id)
            .then(book => {
                Loan.findAll({
                    include: [
                        {model: Book},
                        {model: Patron}
                    ],
                    where: {
                        book_id: req.params.id
                    }
                }).then(loans => {
                    res.render('book_detail', {book, loans, errors:err.errors});
                })
            })
        } else {
            throw(err);
        }
    });
});

module.exports = router;

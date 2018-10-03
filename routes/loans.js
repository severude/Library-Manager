// Routing declarations
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;

// Loan routes

// Show all loans
router.get('/', (req, res) => {
    Loan.findAll({
        include: [
            {model: Book},
            {model: Patron}
        ]
    }).then(loans => {
        res.render('all_loans', {loans});
    }).catch(err => {
        res.status(500);
    });
});

// Form for new loan
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
                loaned_on: today,
                return_by: dueDate
            });
        });
    }).catch(err => {
        res.status(500);
    });
});

// Post new loan and redirect to loans page
router.post('/new_loan', (req, res, next) => {
    const {loaned_on, return_by} = req.body;
    Loan.create(req.body).then(loan => {
        res.redirect('/loans');
    }).catch(err => {
        if(err.name === "SequelizeValidationError") {
            Book.findAll()
            .then(books => {
                Patron.findAll()
                .then(patrons => {
                    res.render('new_loan', {
                        errors: err.errors,
                        books,
                        patrons,
                        loaned_on,
                        return_by
                    });
                });
            }).catch(err => {
                res.status(500);
            });
        } else {
            throw err;
          }
    }).catch(err => {
        res.status(500);
    });
});

// Show all overdue loans
router.get('/overdue_loans', (req, res) => {
    Loan.findAll({
        include: [
            {model: Book},
            {model: Patron}
        ],
        where: {
            return_by: { 
                [Op.lt]: Date.now() 
            },
            returned_on: {
                [Op.eq]: null
            }
        }
    }).then(loans => {
        res.render('overdue_loans', {loans});
    }).catch(err => {
        res.status(500);
    });
});

// Show all checked out loans
router.get('/checked_loans', (req, res) => {
    Loan.findAll({
        include: [
            {model: Book},
            {model: Patron}
        ],
        where : {
            returned_on: {
                [Op.eq]: null
            }
        }
    }).then(loans => {
        res.render('checked_loans', {loans});
    }).catch(err => {
        res.status(500);
    });
});

// Show form to return an individual book
router.get('/return_book/:id', (req, res) => {
    const date = new Date();
    const today = date.toLocaleDateString();
    Loan.findOne({
        include: [
            {model: Book},
            {model: Patron}
        ],
        where: {
            id: req.params.id
        }
    }).then(loan => {
        res.render('return_book', {loan, returned_on:today});
    }).catch(err => {
        res.status(500);
    });
});

// Return an individual book
router.put('/return_book/:id', (req, res, next) => {
    Loan.findById(req.params.id)
    .then(loan => loan.update(req.body))
    .then(() => res.redirect('/loans'))
    .catch(err => {
        if(err.name === "SequelizeValidationError") {
            Loan.findOne({
                include: [
                    {model: Book},
                    {model: Patron}
                ],
                where: {
                    id: req.params.id
                }
            }).then(loan => {
                const date = new Date();
                const today = date.toLocaleDateString();
                res.render('return_book', {loan, returned_on:today, errors:err.errors});
            });
        } else {
            throw(err);
        }
    });
});

module.exports = router;

// Routing declarations
const express = require('express');
const router = express.Router();
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Render home page route
router.get('/', (req, res) => {
    res.render('home');
});

// Book routes
router.get('/books', (req, res) => {
    Book.findAll().then(books => {
        res.render('all_books', {books});
    }).catch(err => {
        res.status(500);
    });
});
router.get('/new_book', (req, res) => {
    res.render('new_book', {
        book: Book.build(req.body)
    });
});
router.post('/new_book', (req, res, next) => {
    Book.create(req.body).then(book => {
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
router.get('/overdue_books', (req, res) => {
    Book.findAll({
        include: [{
            model: Loan,
            where: {
                return_by: { 
                    [Op.lt]: Date.now() 
                },
                returned_on: { 
                    [Op.eq]:  null
                }
            }
        }]
    }).then(books => {
        res.render('overdue_books', {books});
    }).catch(err => {
        res.status(500);
    });
});
router.get('/book_detail/:id', (req, res) => {
    Book.findById(req.params.id)
    .then(book => {
        Loan.findAll({
            include: [
                {model: Book},
                {model: Patron}
            ],
            where: {
                id: req.params.id
            }
        }).then(loans => {
            res.render('book_detail', {book, loans});
        })
    })
});

// Loan routes
router.get('/loans', (req, res) => {
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
        res.render('return_book', {loan, today});
    }).catch(err => {
        res.status(500);
    });
});

// Patron routes
router.get('/patrons', (req, res) => {
    Patron.findAll().then(patrons => {
        res.render('all_patrons', {patrons});
    }).catch(err => {
        res.status(500);
    });
});
router.get('/new_patron', (req, res) => {
    res.render('new_patron', {
        patron: Patron.build(req.body)
    });
});
router.post('/new_patron', (req, res) => {
    Patron.create(req.body).then(patron => {
        res.redirect('/patrons');
    }).catch(err => {
        if(err.name === "SequelizeValidationError") {
            res.render("new_patron", {
              patron: Patron.build(req.body),
              errors: err.errors
            });
          } else {
            throw err;
          }
    }).catch(err => {
        res.status(500);
    });
});
router.get('/patron_detail/:id', (req, res) => {
    Patron.findById(req.params.id)
    .then(patron => {
        res.render('patron_detail', {patron});
    })
});

module.exports = router;

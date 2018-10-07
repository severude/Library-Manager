// Routing declarations
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;
let limit = 5;  // Default page limit

// Book routes

// Show all books
router.get('/', (req, res) => {
    res.redirect('/books/page-1');
});

// Show all books with paging
router.get('/page-:page', (req, res) => {
    Book.findAndCountAll().then(books => {
        let activePage = req.params.page;
        let totalPages = Math.ceil(books.count / limit);
        let offset = limit * (activePage - 1);
        let pages = [];
        for(let index = 1; index <= totalPages; index++) {
            pages.push(index);
        }
        Book.findAll({
            limit: limit,
            offset: offset
        })
        .then(books => {
            res.render('all_books', {books, activePage, pages});
        })
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
    res.redirect('/books/checked_books/page-1');
});

// Show all checked out books with paging
router.get('/checked_books/page-:page', (req, res) => {
    Book.findAndCountAll({
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
        let activePage = req.params.page;
        let totalPages = Math.ceil(books.count / limit);
        let offset = limit * (activePage - 1);
        let pages = [];
        for(let index = 1; index <= totalPages; index++) {
            pages.push(index);
        }
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
            }],
            limit: limit,
            offset: offset
        })
        .then(books => {
            res.render('checked_books', {books, activePage, pages});
        })
    }).catch(err => {
        res.status(500);
    });
});

// Show all overdue books
router.get('/overdue_books', (req, res) => {
    res.redirect('/books/overdue_books/page-1');
});

// Show all overdue books with paging
router.get('/overdue_books/page-:page', (req, res) => {
    Book.findAndCountAll({
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
        let activePage = req.params.page;
        let totalPages = Math.ceil(books.count / limit);
        let offset = limit * (activePage - 1);
        let pages = [];
        for(let index = 1; index <= totalPages; index++) {
            pages.push(index);
        }
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
                }],
            limit: limit,
            offset: offset
        })
        .then(books => {
            res.render('overdue_books', {books, activePage, pages});
        })
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

// Show book search results
router.post('/search', (req, res, next) => {
    const {search} = req.body;
    Book.findAll({
        where: {
            [Op.or]: [
                {
                    title: { 
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    author: { 
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    genre: { 
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    first_published: { 
                        [Op.like]: `%${search}%`
                    }
                }
            ]
        }
    }).then(books => {
        res.render('search_books', {books, search});
    }).catch(err => {
        res.status(500);
    });
});

module.exports = router;

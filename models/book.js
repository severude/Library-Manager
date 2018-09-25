'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required"
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Genre is required"
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "First Published should be a year"
        }
      }
    }
  }, { 
    timestamps: false
  });
  Book.associate = function(models) {
    // associations can be defined here
    Book.hasMany(models.Loan, {foreignKey: 'book_id', targetKey: 'id'});
  };
  return Book;
};
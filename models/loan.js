'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: "Book ID should be numeric"
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: "Patron ID should be numeric"
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Loaned On should be a date YYYY-MM-DD"
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Return By should be a date YYYY-MM-DD"
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Returned On should be a date YYYY-MM-DD"
        }
      }
  }
  }, { 
    timestamps: false
  });
  Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Patron, {foreignKey: 'patron_id', targetKey: 'id'});
    Loan.belongsTo(models.Book, {foreignKey: 'book_id', targetKey: 'id'});  
  };
  return Loan;
};
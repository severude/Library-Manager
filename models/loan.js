'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      required: true
    },
    patron_id: {
      type: DataTypes.INTEGER,
      required: true
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "Date is required"
        }
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "Date is required"
        }
      }
    },
    returned_on: {
      type: DataTypes.DATE
    }
  }, { 
    timestamps: false,
    underscored: true
  });
  Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Patron, {foreignKey: 'patron_id'});
    Loan.belongsTo(models.Book, {foreignKey: 'book_id'});  };
  return Loan;
};
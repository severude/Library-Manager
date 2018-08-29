'use strict';
module.exports = (sequelize, DataTypes) => {
  var loans = sequelize.define('loans', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, { 
    timestamps: false
  });
  loans.associate = function(models) {
    // associations can be defined here
  };
  return loans;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define('books', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, { 
    timestamps: false
  });
  books.associate = function(models) {
    // associations can be defined here
  };
  return books;
};
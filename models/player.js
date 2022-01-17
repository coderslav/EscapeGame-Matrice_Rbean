'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  };
  Player.init({
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    dob: {
      allowNull: false,
      type: DataTypes.DATE
    },
    bookingId: {
      type: DataTypes.INTEGER,
      references: {
        model: "bookings", // Can be both a string representing the table name or a Sequelize model
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Player',
    tableName: 'players'
  });
  return Player;
};
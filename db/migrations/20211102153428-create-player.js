'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: { notEmpty: true }
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: { notEmpty: true }
      },
      dob: {
        allowNull: false,
        type: Sequelize.DATE
      },
      bookingId: {
        type: Sequelize.INTEGER,
        references: {
          model: "bookings", // Can be both a string representing the table name or a Sequelize model
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('players');
  }
};
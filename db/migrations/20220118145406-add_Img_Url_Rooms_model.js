'use strict';

const { DataTypes } = require("sequelize/dist");

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'rooms',
        'imgUrl',
        {
          type: DataTypes.STRING,
          allowNull: true
        }
      )
    ])

  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('rooms', 'imgUrl')
    ])
  }
};

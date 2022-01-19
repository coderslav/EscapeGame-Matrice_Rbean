'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'rooms',
        'imgUrl',
        {
          type: Sequelize.STRING,
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

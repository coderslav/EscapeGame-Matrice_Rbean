'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'slots', // name of Source table
      'roomId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'rooms', // name of Target table
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('slots', 'roomId');

  }
};

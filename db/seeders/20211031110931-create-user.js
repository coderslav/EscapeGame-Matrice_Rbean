'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
        firstName: 'Laurie',
        lastName: 'Mezard',
        email: "laurie@gmail.com",
        password: "XZWi8wRWJkvJJgXiK8mxv09nxERsExJCpbI63455eBQ=",
        createdAt: new Date(),
        updatedAt: new Date()
      }], 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

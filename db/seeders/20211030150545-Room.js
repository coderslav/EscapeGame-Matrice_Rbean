'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'rooms', 
      [
        {
          name: 'Ghost Buster',
          description: "Venez à la chasse aux fantômes... frissons garantis !",
          price: 99,
          ageLimit: 13,
          capacity: "(4, 7)",
//          capacity: [{ value: "4", inclusive: true }, { value: "7", inclusive: true }],
          createdAt: new Date(),
          updatedAt: new Date(),
          imgUrl: 'https://freepikpsd.com/file/2019/10/ghostbusters-logo-png-picture-27-Transparent-Images.png'
        },
        {
          name: 'Inspecteur Gadget',
          description: "Faites marcher vos neurones et résolvez l'énigme du siècle !",
          price: 80,
          ageLimit: 8,
          capacity: "(3, 5)",
          imgUrl: 'https://m.media-amazon.com/images/I/51DMML9TTvL._AC_SX355_.jpg',

//          capacity: [{ value: 3, inclusive: true }, { value: 5, inclusive: true }],
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], 
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rooms', null, {});
  }
};



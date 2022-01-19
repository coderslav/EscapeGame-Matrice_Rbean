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
          imgUrl: 'https://w7.pngwing.com/pngs/523/86/png-transparent-escape-room-game-escape-the-room-goes-escape-room-palermo-thumbnail.png'
        },
        {
          name: 'Inspecteur Gadget',
          description: "Faites marcher vos neurones et résolvez l'énigme du siècle !",
          price: 80,
          ageLimit: 8,
          capacity: "(3, 5)",
          imgUrl: 'https://w7.pngwing.com/pngs/523/86/png-transparent-escape-room-game-escape-the-room-goes-escape-room-palermo-thumbnail.png',

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

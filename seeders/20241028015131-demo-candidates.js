'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const presidentPosition = 1
    const secretaryPosition = 2

    await queryInterface.bulkInsert('Candidates', [
      {
        first_name: 'Alice',
        last_name: 'Smith',
        photo: 'alice_smith.jpg',
        position_id: 1,
        voting_year_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        first_name: 'Bob',
        last_name: 'Johnson',
        photo: 'bob_johnson.jpg',
        position_id: 1,
        voting_year_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        first_name: 'Carol',
        last_name: 'Williams',
        photo: 'carol_williams.jpg',
        position_id: 2,
        voting_year_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        first_name: 'David',
        last_name: 'Brown',
        photo: 'david_brown.jpg',
        position_id: 2,
        voting_year_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more candidates if needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Candidates', null, {});
  },
};

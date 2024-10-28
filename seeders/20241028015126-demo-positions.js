'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const votingYearId = 1;

    await queryInterface.bulkInsert('Positions', [
      {
        name: 'President',
        voting_year_id: votingYearId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Secretary',
        voting_year_id: votingYearId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more positions as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Positions', null, {});
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('VotingYears', [
      {
        year: 2024,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        year: 2028,
        start_date: new Date('2028-01-01'),
        end_date: new Date('2028-12-31'),
        is_active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more voting years if needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('VotingYears', null, {});
  },
};

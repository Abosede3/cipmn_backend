'use strict';

const { all } = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Candidates', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Candidates', 'middle_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Candidates', 'title');
    await queryInterface.removeColumn('Candidates', 'middle_name');
  }
};

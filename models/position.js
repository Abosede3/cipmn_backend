'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Candidate, {
        foreignKey: 'position_id'
      });
      this.hasMany(models.Vote, {
        foreignKey: 'position_id'
      });
      this.belongsTo(models.VotingYear, {
        foreignKey: 'voting_year_id'
      });
    }
  }
  Position.init({
    name: DataTypes.STRING,
    voting_year_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Position',
  });
  return Position;
};
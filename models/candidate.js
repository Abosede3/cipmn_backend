'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Position, {
        foreignKey: 'position_id'
      });
      this.belongsTo(models.VotingYear, {
        foreignKey: 'voting_year_id'
      });
      this.hasMany(models.Vote, {
        foreignKey: 'candidate_id'
      });
    }
  }
  Candidate.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Position',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    voting_year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'VotingYear',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Candidate',
  });
  return Candidate;
};
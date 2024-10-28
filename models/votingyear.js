'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VotingYear extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Vote, {
        foreignKey: 'voting_year_id'
      });
      this.hasMany(models.Candidate, {
        foreignKey: 'voting_year_id'
      });
      this.hasMany(models.Position, {
        foreignKey: 'voting_year_id'
      });
    }
  }
  VotingYear.init({
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'VotingYear',
  });
  return VotingYear;
};
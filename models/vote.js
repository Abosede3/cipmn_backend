'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      this.belongsTo(models.Candidate, {
        foreignKey: 'candidate_id'
      });
      this.belongsTo(models.Position, {
        foreignKey: 'position_id'
      });
      this.belongsTo(models.VotingYear, {
        foreignKey: 'voting_year_id'
      });
    }
  }
  Vote.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Candidate',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    modelName: 'Vote',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'position_id', 'voting_year_id'],
        name: 'unique_vote_per_user_per_position_per_year'
      }
    ]
  });
  return Vote;
};
'use strict';
const Sequelize = require('sequelize');
const { Model } = Sequelize;

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Room.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    ageLimit: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 130 }
    },
    capacity: {
      type: Sequelize.RANGE(Sequelize.INTEGER),
      allowNull: false
    },
    imgUrl:{
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms'
  });
  return Room;
};

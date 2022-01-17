'use strict';
const Sequelize = require('sequelize')
const { Model } = Sequelize;

module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Room, { as: 'room'} );
      this.belongsToMany(models.User, { through: models.Booking, foreignKey: { name: 'slotId'} })
    }
  };
  Slot.init({
    during: Sequelize.RANGE(Sequelize.DATE)
  }, {
    sequelize,
    modelName: 'Slot',
    tableName: 'slots'
  });
  return Slot;
};
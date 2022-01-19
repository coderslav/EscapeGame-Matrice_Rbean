'use strict';
const Sequelize = require('sequelize');
const { Model } = Sequelize;

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.Player, { foreignKey: { name: 'bookingId' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        }
    }
    Booking.init(
        {
            /**
             * We define a column id because we want to add a bookingId to players.
             * By default Sequelize won't add an id attribute for junction tables
             */
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Booking',
            tableName: 'bookings',
        }
    );
    return Booking;
};

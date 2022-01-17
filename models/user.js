'use strict';
const Sequelize = require('sequelize');
const { Model } = Sequelize;
const { setAuthToken, getHashedPassword } = require('../helpers/auth');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      this.belongsToMany(models.Slot, { through: models.Booking, foreignKey: { name: 'userId'} })
    }

    static async authenticate(email, rawPassword, res) {
      const password = getHashedPassword(rawPassword);
      const result = await User.findOne({ where: { email , password }, attributes: ['id'] });

      if (result) {
        setAuthToken(result.id, res);
        return true;
      }
      else {
          throw 'Invalid username or password';
      }
    }

    static async new(userData) {
      const { email, firstName, lastName, password, confirmPassword } = userData;

      if (password === confirmPassword) {
        const hashedPassword = getHashedPassword(password);

        return User.create({ email, firstName, lastName, password: hashedPassword })
      } 
      else {
        throw 'Passwords do not match.';
      }
    }

    async bookSlot(slot, players) {
      const booking = await sequelize.models.Booking.create({ slotId: slot.id, userId: this.id })

      for (let player of players) {
        player['bookingId'] = booking.id
        await sequelize.models.Player.create(player)
      }
    }

  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    password: {
      type: DataTypes.STRING(44),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },    
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};
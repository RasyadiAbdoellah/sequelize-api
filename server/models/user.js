'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING
      },
      tokenExpiresAt: {
        type: DataTypes.DATE
      }
    },
    {
      getterMethods: {
        userObj() {
          return {
            id: this.getDataValue('id'),
            token: this.getDataValue('token'),
            username: this.getDataValue('username')
          };
        }
      }
    }
  );

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.associate = function(models) {
    User.hasMany(models.Todos, { foreignKey: 'userId' });
    // associations can be defined here
  };
  return User;
};

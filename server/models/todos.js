'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todos = sequelize.define(
    'Todos',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  Todos.associate = function(models) {
    Todos.belongsTo(models.User, { foreignKey: 'userId' });
    Todos.hasMany(models.TodoItem, { foreignKey: 'todoId' });
    // associations can be defined here
  };
  return Todos;
};

'use strict';
module.exports = (sequelize, DataTypes) => {
  const TodoItem = sequelize.define(
    'TodoItem',
    {
      content: DataTypes.STRING
    },
    {}
  );
  TodoItem.associate = function(models) {
    TodoItem.belongsTo(models.Todos, { foreignKey: 'todoId' });
    // associations can be defined here
  };
  return TodoItem;
};

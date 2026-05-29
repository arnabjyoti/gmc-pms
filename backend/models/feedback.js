"use strict";
module.exports = (sequelize, type) => {
  const feedback = sequelize.define(
    "feedback",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      project_id: type.INTEGER,
      userId: type.INTEGER,
      feedback: type.STRING
    },
    {}
  );
  feedback.associate = function(models) {
    feedback.belongsTo(models.users)
  };
  return feedback;
};

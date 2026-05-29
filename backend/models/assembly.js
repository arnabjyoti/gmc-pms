'use strict';
module.exports = (sequelize, type) => {
    const assembly = sequelize.define('assembly', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        projectId: type.INTEGER,
        query: type.STRING,
        answer: type.STRING,
        date: type.DATE,
        time: type.TIME
    }, {});
    assembly.associate = function(models) {
        // associations can be defined here
        assembly.belongsTo(models.project)
    };
    return assembly;
};
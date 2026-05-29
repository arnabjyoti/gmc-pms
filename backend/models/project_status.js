'use strict';
module.exports = (sequelize, type) => {
    const project_status = sequelize.define('project_status', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: type.INTEGER,
        status: type.STRING,
        date_updated: type.DATE,
        user_updated: type.INTEGER,
        active: {
            type: type.BOOLEAN,
            default: true
        },
        rememberToken: type.STRING
    }, {});
    project_status.associate = function(models) {
        // associations can be defined here
        project_status.belongsTo(models.users);
    };
    return project_status;
};
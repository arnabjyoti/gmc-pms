'use strict';
module.exports = (sequelize, type) => {
    const physical_progress = sequelize.define('physical_progress', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: type.INTEGER,
        project_type: type.STRING,
        step: type.STRING,
        progress: type.STRING,
        total_progress: type.STRING
    }, {});
    physical_progress.associate = function(models) {
        physical_progress.belongsTo(models.project)
    };
    return physical_progress;
};
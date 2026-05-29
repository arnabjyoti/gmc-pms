'use strict';
module.exports = (sequelize, type) => {
    const progress = sequelize.define('progress', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        progress_date: type.DATE,
        progress_percent: type.INTEGER,
        note: type.STRING
    }, {});
    progress.associate = function(models) {
        // associations can be defined here
        progress.belongsTo(models.project)
    };
    return progress;
};
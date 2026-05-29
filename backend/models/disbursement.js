'use strict';
module.exports = (sequelize, type) => {
    const disbursement = sequelize.define('disbursement', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        disburse_date: type.DATE,

        amount: type.INTEGER,
        note: type.STRING
    }, {});
    disbursement.associate = function(models) {
        // associations can be defined here
        disbursement.belongsTo(models.project)
    };
    return disbursement;
};
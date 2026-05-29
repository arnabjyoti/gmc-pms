'use strict';
module.exports = (sequelize, type) => {
    const land_details = sequelize.define('land_details', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        district_name: type.STRING,
        location_name: type.STRING,
        total_land: type.STRING,
        allotable_land: type.STRING,
        land_allot: type.STRING,
        vacant_land: type.STRING,
        total_shed: type.STRING,
        shed_allot: type.STRING,
        vacant_allotable_land: type.STRING,
        vacant_shed_allot: type.STRING,
        accessKeyword: type.STRING,
        status: type.STRING,
    }, {});
    land_details.associate = function(models) {
        // associations can be defined here
    };
    return land_details;
};
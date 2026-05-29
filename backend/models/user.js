'use strict';
module.exports = (sequelize, type) => {
    const users = sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: type.STRING,
        email: type.STRING,
        phone_no: type.STRING,
        designation: type.STRING,
        posting: type.STRING,
        avatar: {
            type: type.STRING,
            default: 'storage/default.png'
        },
        password: type.STRING,
        temp_password: type.STRING,
        role: type.STRING,
        active: {
            type: type.BOOLEAN,
            default: true
        },
        rememberToken: type.STRING,
        accessKeyword: type.STRING,
    }, {});
    users.associate = function(models) {
        // associations can be defined here
        users.hasMany(models.project_status)
        users.hasMany(models.note)
        users.hasMany(models.feedback)
    };
    return users;
};
'use strict';
module.exports = (sequelize, type) => {
    const file_repo = sequelize.define('file_repo', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        file_path: {
            type: type.STRING,
            default: 'assets/images/project_file_repo/project_preview.jpg'
        },
        title: type.STRING,
        description: type.STRING,
        image_caption: type.STRING,
        parent_id: type.STRING,
        docType: type.STRING,
        type: type.STRING,
        original_file_name: type.STRING,
        mime_type: type.STRING,
        GPSLatitudeRef: type.STRING,
        GPSLatitude: type.STRING,
        GPSLongitudeRef: type.STRING,
        GPSLongitude: type.STRING,
        GPSTimeStamp: type.STRING,
        GPSDateStamp: type.STRING,
        local_address: type.STRING,
        projectId: type.INTEGER,
        isDefault: {
            type: type.BOOLEAN,
            default: false
        },
        isActive: type.STRING,
        rememberToken: type.STRING,
        folder_id: type.STRING,
    }, {});
    file_repo.associate = function(models) {
        // associations can be defined here
        file_repo.belongsTo(models.project)
    };
    return file_repo;
};
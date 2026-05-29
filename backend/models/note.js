'use strict';
module.exports = (sequelize, type) => {
	const note = sequelize.define(
		'note',
		{
			id: {
				type: type.INTEGER,
				primaryKey: true,
				autoIncrement: true
            },
            subject:type.STRING,
            note:type.STRING,
            projectId:type.INTEGER,
            userId:type.INTEGER,
            receiver_uid:type.INTEGER,
			read_status: type.STRING,
			status: type.STRING,
		},
		{}
	);
	note.associate = function(models) {
		// associations can be defined here
		note.belongsTo(models.users);
	};
	return note;
};

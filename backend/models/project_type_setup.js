'use strict';
module.exports = (sequelize, type) => {
	const project_type_setup = sequelize.define(
		'project_type_setup',
		{
			id: {
				type: type.INTEGER,
				primaryKey: true,
				autoIncrement: true
            },
            project_type: type.STRING,
            steps: type.STRING,
            order_no: type.INTEGER
		},
		{}
	);
	project_type_setup.associate = function(models) {
	};
	return project_type_setup;
};

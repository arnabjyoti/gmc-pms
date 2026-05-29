'use strict';
module.exports = (sequelize, type) => {
	const project_milestones = sequelize.define(
		'project_milestones',
		{
			id: {
				type: type.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			pt_setup_id: type.INTEGER,
			project_id: type.INTEGER,
			deadline: { type: 'DATETIME' }
		},
		{}
	);
	project_milestones.associate = function(models) {};
	return project_milestones;
};

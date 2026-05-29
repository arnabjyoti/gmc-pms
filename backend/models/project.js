'use strict';
module.exports = (sequelize, type) => {
	const project = sequelize.define(
		'project',
		{
			id: {
				type: type.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			code: type.STRING,
			name: type.STRING,
			type: type.STRING,
			district: type.STRING,
			scheme_name: type.STRING,
			package_no: type.STRING,
			scheme: type.STRING,
			description: type.STRING,
			remarks: type.STRING,
			contractor_name_cs: type.STRING,
			contractor_name: type.STRING,
			contractor_phone_cs: type.STRING,
			contractor_phone: type.STRING,
			initial_amount: type.DECIMAL(10, 2),
			wo_amount: type.INTEGER,
			tender_amount_cs: type.INTEGER,
			tender_amount: type.INTEGER,
			total_disbursed_amount: type.DECIMAL(10, 2),
			status: type.STRING,
			wo_date_cs: { type: 'DATETIME' },
			wo_date: { type: 'DATETIME' },
			wo_no_cs: type.STRING,
			wo_no: type.STRING,
			wo_amount_cs: type.STRING,
			wo_amount: type.STRING,
			actual_start_cs: { type: 'DATETIME' },
			actual_start: { type: 'DATETIME' },
			actual_end_cs: { type: 'DATETIME' },
			actual_end: { type: 'DATETIME' },
			percentageProgress: type.STRING,
			financialProgressCs: type.STRING,
			percentageProgressCs: type.STRING,
			financialProgress: type.STRING,
			financialProgressCs: type.STRING,
			updatedAt: { type: 'DATETIME' },
			fileNo: type.STRING,
			aa_status: type.STRING,
			technical_approval: type.STRING,
			accessKeyword: type.STRING,
			avail_status: type.INTEGER,
			completion_date: { type: 'DATETIME' },
		},
		{}
	);
	project.associate = function(models) {
		// associations can be defined here
		project.hasOne(models.file_repo);
		project.hasMany(models.disbursement);
		project.hasMany(models.progress);
		project.hasMany(models.physical_progress);
		project.hasOne(models.fund_received)
	};
	return project;
};

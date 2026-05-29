'use strict';
module.exports = (sequelize, type) => {
	const fund_received = sequelize.define(
		'fund_received',
		{
			id: {
				type: type.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			initial_amount: type.DECIMAL(10, 2),
			tender_amount_cs: type.INTEGER,
			tender_amount: type.INTEGER,
			aa_status: type.STRING,
			technical_approval: type.STRING,
			projectId: type.INTEGER,
			fsn: type.STRING,
			fsd: { type: 'DATETIME' },
			fsa: type.INTEGER,
			fsn_cs: type.STRING,
			fsd_cs: { type: 'DATETIME' },
			fsa_cs: type.INTEGER,
			focn: type.STRING,
			focd: { type: 'DATETIME' },
			foca: type.INTEGER,
			focn_cs: type.STRING,
			focd_cs: { type: 'DATETIME' },
			foca_cs: type.INTEGER,
			goi_fund: type.STRING,
			ss: type.STRING,
			goi_fund_sanctioned: type.STRING,
			goi_fund_rcvd: type.STRING,
			blnc_goi_fund: type.STRING,
			total_ss: type.STRING,
			ss_rcvd: type.STRING,
			aa_amount: type.STRING,
			project_cost: type.STRING

		},
		{}
	);
	fund_received.associate = function(models) {
		fund_received.belongsTo(models.project)
	};
	return fund_received;
};

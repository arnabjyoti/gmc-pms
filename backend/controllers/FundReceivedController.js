const fund_receivedModel = require("../models").fund_received;
const projectModel = require("../models").project;


module.exports = {
  updateFundReceived(req, res) {
    const newData = {
      fsn: req.body.requestObject.fsn,
      fsd: req.body.requestObject.fsd,
      fsa: req.body.requestObject.fsa,
      fsn_cs: req.body.requestObject.fsn_cs,
      fsd_cs: req.body.requestObject.fsd_cs,
      fsa_cs: req.body.requestObject.fsa_cs,
      focn: req.body.requestObject.focn,
      focd: req.body.requestObject.focd,
      foca: req.body.requestObject.foca,
      focn_cs: req.body.requestObject.focn_cs,
      focd_cs: req.body.requestObject.focd_cs,
      foca_cs: req.body.requestObject.foca_cs,

      aa_status: req.body.requestObject.aa_status,
      aa_amount: req.body.requestObject.aa_amount,
      tender_amount: req.body.requestObject.tender_amount,
      tender_amount_cs: req.body.requestObject.tender_amount_cs,
      initial_amount: req.body.requestObject.initial_amount,
      technical_approval: req.body.requestObject.technical_approval,
      goi_fund: req.body.requestObject.goi_fund,
		  ss: req.body.requestObject.ss,
		  goi_fund_sanctioned: req.body.requestObject.goi_fund_sanctioned,
		  goi_fund_rcvd: req.body.requestObject.goi_fund_rcvd,
		  blnc_goi_fund: req.body.requestObject.blnc_goi_fund,
		  total_ss: req.body.requestObject.total_ss,
		  ss_rcvd: req.body.requestObject.ss_rcvd,
      project_cost: req.body.requestObject.project_cost,
    };
    fund_receivedModel
      .update(newData, {
        where: {
          projectId: req.body.requestObject.project_id
        }
      })
      // .then(p => {
      //   projectData = {
      //     aa_status: req.body.requestObject.aa_status,
      //     tender_amount: req.body.requestObject.tender_amount,
      //     initial_amount: req.body.requestObject.initial_amount,
      //     technical_approval: req.body.requestObject.technical_approval,
      //   };
      //   console.log("ProjectData=", newData);
      //   projectModel
      //     .update(projectData, {
      //       where: {
      //         id: req.body.requestObject.project_id
      //       }
      //     })
      //     .then(r => {
      //       console.log(r);
      //       res.status(200).send(r);
      //       // res.status(200).send(p);
      //     })
      //     .catch(err => res.status(400).send(err));
      // })
      .then(p => {
        res.status(200).send(p);
      })
      .catch(err => res.status(400).send(err));
  },

};

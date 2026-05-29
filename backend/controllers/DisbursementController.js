const disbursementModel = require("../models").disbursement;

module.exports = {
  //Start: Method to add disbursement
  addDisbursement(req, res) {
    return disbursementModel
      .create({
        projectId: req.body.requestObject.project_id,
        disburse_date: req.body.requestObject.disburse_date,
        amount: req.body.requestObject.amount,
        note: req.body.requestObject.note
      })
      .then(d => res.status(200).send(d))
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
  },
  // End

  //Start: Method to update disbursement
  updateDisbursement(req, res) {
    const newData = {
        disburse_date: req.body.requestObject.disbursement_date,
        amount: req.body.requestObject.disbursement_amount,
        note: req.body.requestObject.note
    }

    return disbursementModel.update(newData, {
        where: {
            id: req.body.requestObject.id,
        }
    })
    .then(p => {
        res.status(200).send(p);
    })
    .catch(err => res.status(400).send(err));
  },
  //End

  //Start: Method to delete disbursement
  deleteDisbursement(req, res){
      disbursementModel.destroy({
          where: {
            id: req.body.requestObject,
          }
      })
      .then( ()=> {
          res.status(200).send({status:'Deleted'});
      })
      .catch(err => res.status(400).send(err));
  },
  //End
};

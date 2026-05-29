const progressModel = require("../models").progress;
const physicaProgressModel = require("../models").physical_progress;
const async = require("async");

module.exports = {
  // Start: Method to add project progress
  addProgress(req, res) {
    return progressModel
      .create({
        projectId: req.body.requestObject.project_id,
        progress_date: req.body.requestObject.progress_date,
        progress_percent: req.body.requestObject.progress_percent,
        note: req.body.requestObject.note
      })
      .then(progress => res.status(200).send(progress))
      .catch(error => res.status(400).send(error));
  },
  // End

  //Start: Method to update Progress
  updateProgress(req, res) {
    console.log(req.body.requestObject);
    const newData = {
      progress_date: req.body.requestObject.progress_date,
      progress_percent: req.body.requestObject.progress_percent,
      note: req.body.requestObject.note
    };

    return progressModel
      .update(newData, {
        where: {
          id: req.body.requestObject.id
        }
      })
      .then(p => {
        res.status(200).send(p);
      })
      .catch(err => res.status(400).send(err));
  },
  //End

  //Start : method to delete Progress
  deleteProgress(req, res) {
    progressModel
      .destroy({
        where: {
          id: req.body.requestObject
        }
      })
      .then(() => {
        res.status(200).send({ status: "Deleted" });
      })
      .catch(err => res.status(400).send(err));
  },
  //End

  saveProgress(req, res) {
    console.log(req.body.requestObject.data);
    return physicaProgressModel
      .findAll({
        where: {
          project_type: req.body.requestObject.projectType,
          project_id: req.body.requestObject.projectId
        }
      })
      .then(data => {
        console.log("DATA", data.length);
        if (data.length <= 0) {
          return physicaProgressModel
            .bulkCreate(req.body.requestObject.data, { returning: true })
            .then(data => {
              console.log(data);
              res.status(200).send(data);
            })
            .catch(error => {
              console.log(error);
              res.status(400).send(error);
            });
        } else {
          module.exports.deleteAndInsertData(req, response => {
            if (response.status) {
              res.status(200).send(response);
            } else {
              res.status(400).send(response);
            }
          });
        }
      });

    // return physicaProgressModel
    //   .bulkCreate(req.body.requestObject.data, { returning: true })
    //   .then(data => {
    //     console.log(data);
    //     res.status(200).send(data);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     res.status(400).send(error);
    //   });

    // async.waterfall([
    //   fn => {
    //     return physicaProgressModel
    //       .findAll({
    //         where: {
    //           project_type: req.body.requestObject.projectType,
    //           project_id: req.body.requestObject.projectId
    //         }
    //       })
    //       .then(data => {
    //         console.log("DATA",data)
    //         return fn(null, true);
    //       });
    //   },
    //   (status, fun)=>{
    //     console.log(status)
    //   }
    // ]);
  },

  deleteAndInsertData(req, callback) {
    async
      .waterfall([
        fn => {
          return physicaProgressModel
            .destroy({
              where: {
                project_id: req.body.requestObject.projectId
              }
            })
            .then(data => {
              return fn(null, true);
            })
            .catch(error => {
              return fn(null, false);
            });
        },
        (status, fn) => {
          if (status) {
            return physicaProgressModel
              .bulkCreate(req.body.requestObject.data, { returning: true })
              .then(data => {
                console.log(data);
                return fn(null, true);
              })
              .catch(error => {
                console.log(error);
                return fn(null, false);
              });
          }
        }
      ])
      .then(data => {
        console.log(data);
        callback({ status: true, message: data });
      })
      .catch(error => {
        console.log(error);
        callback({ status: false, message: error });
      });
  },

  getProgress(req, res) {
    return physicaProgressModel
      .findAll({
        where: {
          project_id: req.params.projectId
        }
      })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
  }
};

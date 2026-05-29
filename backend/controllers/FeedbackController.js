const feedbackModel = require("../models").feedback;
const userModel = require("../models").users;
module.exports = {
  saveFeedback(req, res) {
    return feedbackModel
      .create({
        project_id: req.body.requestObject.projectId,
        userId: req.body.requestObject.userId,
        feedback: req.body.requestObject.feedback
      })
      .then(data => {
        res.status(200).send({ message: "ok", data: data });
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  },
 
  getFeedbackForProject(req, res) {
    return feedbackModel
      .findAll({
        order: [["updatedAt", "DESC"]],
        where: {
          project_id: req.params.projectId
        },
        include: [
          {
            model: userModel,
            attributes: ["name", "avatar", "role"]
          }
        ]
      })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  },

  getFeedback(req, res) {
    return feedbackModel
      .findAll({
        order: [["updatedAt", "DESC"]],
        where: {
          project_id: null
        },
        include: [
          {
            model: userModel,
            attributes: ["name", "avatar","role"]
          }
        ]
      })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }
};

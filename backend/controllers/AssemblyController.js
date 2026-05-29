const assemblyModel = require('../models').assembly;

module.exports = {
    // add assembly questionn
    addAssembly(req, res) {
        return assemblyModel
            .create({
                projectId: req.body.requestObject.projectId,
                name: req.body.requestObject.name,
                query: req.body.requestObject.query,
                answer: req.body.requestObject.answer,
                date: req.body.requestObject.date,
                time: req.body.requestObject.time
            })
            .then(d => res.status(200).send({ message: "done" }))
            .catch(error => {
                console.log(error);
                res.status(400).send(error);
            });
    },

    // get assembly questions by projectId
    getAssemblyByProjectId(req, res) {
        return assemblyModel
            .findAll({
                order: [["updatedAt", "DESC"]],
                where: {
                    projectId: req.params.projectId
                }
            })
            .then(data => {
                res.status(200).send(data);
            })
            .catch(error => {
                console.log(error);
                res.status(400).send(error);
            });
    },

    // get assembly Questions

    getAssembly(req,res) {
        return assemblyModel
        .findAll({
            order: [["updatedAt", "DESC"]]
        })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            console.log(error);
            res.status(400).send(error);
        });
    },

    // update Add answer to assembly question
    updateAssembly(req, res) {
        const newData = {
           answer: req.body.requestObject.answer
        }
        console.log("Sudeep",req.body);
          assemblyModel
            .update(newData, {
                where: {
                    id: req.body.requestObject.id
                }
            })
            .then(p => {
                res.status(200).send({ message: "done" });
            })
            .catch(err => res.status(400).send(err));
    }

}
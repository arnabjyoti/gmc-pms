const async = require('async');
const projectStatusModel = require('../models').project_status;
const projectModel = require('../models').project;



module.exports = {
    //Start: Method to create a new project status
    addProjectStatus(req, res) {
        // console.log(req);
        return projectStatusModel
            .create({
                project_id: req.body.requestObject.project_id,
                status: req.body.requestObject.status,
                date_updated: req.body.requestObject.date_updated,
                user_updated: req.body.requestObject.user_updated,
                userId: req.body.requestObject.user_updated,
                active: 1
            })
            .then(status => {
                async.parallel({
                    projectUpdate: (fn1) => {
                        const project_id = req.body.requestObject.project_id
                        const newData = {
                            status: req.body.requestObject.status,  
                            actual_end: req.body.requestObject.actual_end,
                        };
                        projectModel.update(newData, {
                            where: {
                                id: project_id
                            }
                        }).then(pr => {

                            return fn1(null, pr);

                        });
                    }
                });
                res.status(200).send(status);
            })
            //  res.status(200).send(status))
            .catch(error => res.status(400).send(error));


    },
    // End 


}


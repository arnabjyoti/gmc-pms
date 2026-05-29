const async = require('async');
const projectModel = require('../models').project;
const userModel = require('../models').users;
const noteModel = require('../models').note;

module.exports = {
    addNote(req, res){
        return noteModel
            .create({
                subject : req.body.requestObject.subject,
                note : req.body.requestObject.description,
                projectId : req.body.requestObject.projectId,
                userId : req.body.requestObject.uid,
                receiver_uid : req.body.requestObject.receiver_uid,
                read_status : 'N',
                status : 'A'
            }).then(() => {
                res.status(200).send({msg : "done"});
            }).catch((error) => {
                console.log(error);
                res.status(400).send(error)
            })
    },

	updateNote(req, res){
		const newData = {
			read_status:'Y'
		}
		noteModel.update(newData,{
			where:{
				receiver_uid:req.body.requestObject.receiver_uid,
				projectId:req.body.requestObject.projectId
			}
		})
		.then(n=>{
			res.status(200).send({msg : "done"});
		})
	},
    // Start: Method to get all projects which are completed
	getNote(req, res) {
		return noteModel
			.findAll({
				where: {
					projectId: req.params.projectId,
					status:'A'
				},
				raw: true,
				include: [
					{
						model: userModel,
						required: false,
						attributes: [ [ 'name', 'name' ] ]
					}
				]
			})
			.then((project) => {
				return res.status(200).send(project);
			})
			.catch((error) => {
				console.log(error);
				return res.status(400).send(error);
			});
	},
	// End

	// Start: Method to get all employees which are completed
	getEmployees(req,res) {
		return userModel
			.findAll({
				where: {
					active: 1
				},
				raw: true,
				attributes: [ ['id','id'],[ 'name', 'name' ],[ 'avatar', 'avatar' ] ]
			})
			.then((employees) => {
				return res.status(200).send(employees);
			})
			.catch((error) => {
				console.log(error);
				return res.status(400).send(error);
			});
	},
	// End

	// Start: Method to get all projects which are completed
	getUserNotes(req,res) {
		return noteModel
			.findAll({
				where: {
					receiver_uid: req.params.userId,
					read_status:'N'
				},
				raw: true,
				attributes: [ ['subject','subject'],[ 'note', 'note' ],['projectId','projectId'] ]
			})
			.then((notes) => {
				return res.status(200).send(notes);
			})
			.catch((error) => {
				console.log(error);
				return res.status(400).send(error);
			});
	},
	// End
}
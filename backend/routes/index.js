const land_details = require('../models/land_details');

const AuthController = require('../controllers').AuthController;
const ProjectController = require('../controllers').ProjectController;
const DisbursementController = require('../controllers').DisbursementController;
const ProgressController = require('../controllers').ProgressController;
const ProjectStatusController = require('../controllers').ProjectStatusController;
const FileUploadController = require('../controllers').FileUploadController;
const FundReceivedController = require('../controllers').FundReceivedController;
const MobileAppController = require('../controllers').MobileAppController;
const NoteController = require('../controllers').NoteController;
const FeedbackController = require('../controllers').FeedbackController;
const AssemblyController = require('../controllers').AssemblyController;
const LandDetailsController = require('../controllers').LandDetailsController
// Gmc Geotag Api's
module.exports = (app) => {
	app.get('/api', (req, res) =>
		res.status(200).send({
			message: 'Welcome to the AIIDC PWMS'
		})
	);

	app.post('/api/authenticate', AuthController.authenticate);

	app.post('/api/resetPassword', AuthController.resetPassword);

	app.post('/api/getOTP', AuthController.getOTP);

	app.post('/api/verifyOTP', AuthController.verifyOTP);

	app.post('/api/registerCitizen', AuthController.registerCitizen);

	app.post('/api/publicLogin', AuthController.publicLogin);

	app.post('/api/createUser', AuthController.createUser);

	app.post('/api/addLandDetails', LandDetailsController.addLandDetails);

	app.post('/api/updateLand', LandDetailsController.updateLand);

	app.post('/api/createProject', ProjectController.createProject);

	app.post('/api/getAllProjects', ProjectController.getAllProjects);

	app.post('/api/getLandDetails', LandDetailsController.getLandDetails);

	app.post('/api/deleteProject', ProjectController.deleteProject);
	
	app.post('/api/getAllProjectsInit', ProjectController.getAllProjectsInit);

	app.post('/api/projectCount', ProjectController.projectCount);
	
	app.post('/api/getAllProjectsNew', ProjectController.getAllProjectsNew);

	app.get('/api/getAllProjectsRemaining', ProjectController.getAllProjectsRemaining);

	app.get('/api/getAllCompletedProjects', ProjectController.getAllCompletedProjects);

	app.get('/api/getAllRejectedProjects', ProjectController.getAllRejectedProjects);

	app.get('/api/getAllOngoingProjects', ProjectController.getAllOngoingProjects);

	app.post('/api/getAllOngoing', ProjectController.getAllOngoing);

	app.get('/api/getProjectById/:projectId', ProjectController.getProjectById);
	
	app.get('/api/getProjectDetailsById/:projectId', ProjectController.getProjectDetailsById);
	
	app.get('/api/getProjectFundById/:projectId', ProjectController.getProjectFundById);
	
	app.get('/api/getProjectTypeById/:projectId', ProjectController.getProjectTypeById);

	app.get('/api/getProjectNameById/:projectId', ProjectController.getProjectNameById);

	app.get('/api/getEngineers', AuthController.getEngineers);

	app.get('/api/getProjectsByDistrict/:ulb', ProjectController.getProjectByDistrict);

	app.post('/api/getProjectsOfGroup1', ProjectController.getProjectsOfGroup1);

	app.post('/api/getProjectByUlb', ProjectController.getProjectByUlb);


	app.post('/api/updateProject', ProjectController.updateProject);

	app.post('/api/addDisbursement', DisbursementController.addDisbursement);

	app.post('/api/addAssembly', AssemblyController.addAssembly);

	app.post('/api/updateAssembly', AssemblyController.updateAssembly);

	app.post('/api/updateAssembly', AssemblyController.updateAssembly);

	app.post('/api/updateDisbursement', DisbursementController.updateDisbursement);

	app.post('/api/deleteDisbursement', DisbursementController.deleteDisbursement);

	app.post('/api/deleteProgress', ProgressController.deleteProgress);

	app.post('/api/addProgress', ProgressController.addProgress);

	app.post('/api/updateProgress', ProgressController.updateProgress);

	app.post('/api/addProjectStatus', ProjectStatusController.addProjectStatus);

	app.post('/api/createFolder', FileUploadController.createFolder);

	app.post('/api/uploadFile', FileUploadController.upload_config.single('file'), FileUploadController.uploadFile);

	app.get('/api/getDocumentByProjectId/:projectId', FileUploadController.getDocuments);

	app.get('/api/getDocumentsByFolderId/:folder_id', FileUploadController.getDocumentsByFolderId);

	app.post('/api/setDefault', FileUploadController.setDefault);

	app.post('/api/updateFundReceived', FundReceivedController.updateFundReceived);

	app.post('/api/addNote', NoteController.addNote);

	app.get('/api/getNote/:projectId', NoteController.getNote);

	app.get('/api/getEmployees', NoteController.getEmployees);

	app.get('/api/getUserNotes/:userId', NoteController.getUserNotes);

	app.post('/api/update-note', NoteController.updateNote);

	app.get('/api/getProjectSteps/:projectType', ProjectController.getProjectSteps);

	app.post('/api/saveProgress', ProgressController.saveProgress);

	app.get('/api/getProgress/:projectId', ProgressController.getProgress);

	app.post('/api/addProjectTypeSteps', ProjectController.addProjectTypeSteps);

	app.post('/api/saveFeedback', FeedbackController.saveFeedback);

	app.get('/api/getFeedbackForProject/:projectId', FeedbackController.getFeedbackForProject);

	app.get('/api/getFeedback', FeedbackController.getFeedback);

	app.get('/api/getAssemblyByProjectId/:projectId', AssemblyController.getAssemblyByProjectId);

	app.get('/api/getAssembly', AssemblyController.getAssembly);

	app.post('/api/getMilestones', ProjectController.getMilestones);
	
	

	//APIs For Mobile App
	app.get('/api/getAllProjectsByDivMob/:division', MobileAppController.getAllProjectsByDiv); //for mobile app

	app.post('/api/getAllProjectsByUser', MobileAppController.getAllProjectsByUser); //for mobile app

	app.post('/api/uploadFileMob', MobileAppController.upload_config.single('file'), MobileAppController.uploadFile); //for mobile app
};

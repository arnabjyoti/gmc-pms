const file_repoModel = require('../models').file_repo;
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const async = require('async');
const request = require('request');
const env = process.env.NODE_ENV || 'test';
const config = require(__dirname + '/../config/config.json')[env];
const ExifImage = require('exif').ExifImage;

module.exports = {
	// Start: Method to add project progress
	db_saveDocument(data, callback) {
		return file_repoModel
			.create({
				projectId: data.projectId,
				parent_id: data.parentId,
				docType: data.docType,
				file_path: data.path,
				title: data.title || null,
				description: data.description || null,
				image_caption: data.image_caption || null,
				original_file_name: data.original_file_name,
				mime_type: data.mime_type,
				GPSLatitudeRef: data.GPSLatitudeRef,
				GPSLatitude: data.GPSLatitude,
				GPSLongitudeRef: data.GPSLongitudeRef,
				GPSLongitude: data.GPSLongitude,
				GPSTimeStamp: data.GPSTimeStamp,
				GPSDateStamp: data.GPSDateStamp,
				local_address: data.address,
				isDefault: false,
				isActive: true,
				folder_id: data.folder_id
			})
			.then((fileData) => callback({ status: true, message: fileData }))
			.catch((error) => callback({ status: false, message: error }));
	},

	db_getDocuments(projectId, callback) {
		return file_repoModel
			.findAll({
				raw: true,
				where: {
					projectId: projectId,
					isActive: true
				}
			})
			.then((docs) => callback({ status: true, message: docs }))
			.catch((error) => callback({ status: false, message: error }));
	},

	db_getDocumentsByFolderId(folder_id, callback) {
		return file_repoModel
			.findAll({
				raw: true,
				where: {
					folder_id: folder_id,
					isActive: true
				}
			})
			.then((docs) => callback({ status: true, message: docs }))
			.catch((error) => callback({ status: false, message: error }));
	},

	getDocuments(req, res) {
		if (!req.params.projectId) {
			console.log('Please give project id');
			return res.status(400).send({ status: false, message: 'Please give project id' });
		}

		module.exports.db_getDocuments(req.params.projectId, (result) => {
			if (result.status) {
				return res.status(200).send(result);
			}

			return res.status(500).send(result);
		});
	},
	// End

	//Start: Function to get documents by Id
	getDocumentsByFolderId(req, res) {
		if (!req.params.folder_id) {
			return res.status(400).send({ status: false, message: 'Please give folder_id' });
		}

		module.exports.db_getDocumentsByFolderId(req.params.folder_id, (result) => {
			if (result.status) {
				return res.status(200).send(result);
			}

			return res.status(500).send(result);
		});
	},
	//End

	//function will check if a directory exists, and create it if it doesn't
	checkDirectory(directory, callback) {
		fs.stat(directory, (err, stats) => {
			//Check if error defined and the error code is "not exists"
			if (err && (err.errno === 34 || err.errno === -4058 || err.errno === -2)) {
				console.log('ERROR:  ', err, '   ERROR CODE:  ', err.errno);
				//Create the directory, call the callback.
				console.log('Create ' + directory);
				fs.mkdir(directory, callback);
			} else {
				//just in case there was a different error:
				console.log('Directory not created ' + directory);
				if (!err) {
					return callback && callback();
				}
				console.log(err);
			}
		});
	},
	//getExifInfo(`${config.storage_doc}/${file.filename}`);
	//multer config
	upload_config: multer({
		storage: multer.diskStorage({
			destination: function(req, file, cb) {
				console.log(config);
				let pId = req.body.projectId.trim();
				let dest = path.join(config.FILE_UPLOAD_PATH, pId);
				module.exports.checkDirectory(dest, () => {
					cb(null, dest);
				});
			},
			filename: function(req, file, cb) {
				cb(null, file.originalname);
			}
		})
	}),

	//Start: Method to create a new folder
	createFolder(req, res) {
		return file_repoModel
			.create({
				original_file_name: req.body.requestObject.original_file_name,
				projectId: req.body.requestObject.projectId,
				isActive: true,
				type: 'folder'
			})
			.then((folder) => res.status(200).send(folder))
			.catch((error) => res.status(400).send(error));
	},
	// End

	uploadFile(req, res) {
		console.log("gggggggggggggggggggggggggggggg",req.file);
		console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",req.body.projectId);
		if (!req.file) {
			console.log('File not found');
			return res.status(400).send({ status: false, message: 'File not found' });
		} else {
			if (req.body.docType === 'imageGallery') {
				// const imgFile = `${config.FILE_UPLOAD_PATH}/${req.body.projectId}/${req.file.filename}`;
				// module.exports.getExifInfo(imgFile, (response) => {
				// 	if (JSON.stringify(response) === '{}' || response === 'no_exif' || response === 'null') {
				// 		console.log('response is empty');
				// 		return res.status(400).send({ message: 'exif data not found' });
				// 	} else {
				// 		console.log('gps data response');
				// 		console.log(response);

				// 		let data = {
				// 			projectId: req.body.projectId,
				// 			parentId: req.body.parentId,
				// 			docType: req.body.docType,
				// 			title: req.body.docTitle,
				// 			description: req.body.docDescription,
				// 			image_caption: req.body.imgCaption,
				// 			path: req.file.path,
				// 			original_file_name: req.file.originalname,
				// 			mime_type: req.file.mimetype,
				// 			GPSLatitudeRef: JSON.stringify(response.gps.GPSLatitudeRef),
				// 			GPSLatitude: JSON.stringify(response.gps.GPSLatitude),
				// 			GPSLongitudeRef: JSON.stringify(response.gps.GPSLongitudeRef),
				// 			GPSLongitude: JSON.stringify(response.gps.GPSLongitude),
				// 			GPSTimeStamp: JSON.stringify(response.exif.CreateDate),
				// 			GPSDateStamp: JSON.stringify(response.gps.GPSDateStamp),
				// 			folder_id: req.body.folder_id
				// 		};
				// 		console.log(data);
				// 		module.exports.getLocalAddressFromExif(data, (result) => {
				// 			data.address = result;
				// 			module.exports.db_saveDocument(data, (result) => {
				// 				if (result.status) {
				// 					return res.status(200).send(result);
				// 				}
				// 				return res.status(500).send(result);
				// 			});
				// 		});
				// 	}
				// });
				let data = {
					projectId: req.body.projectId,
					parentId: req.body.parentId,
					docType: req.body.docType,
					title: req.body.docTitle,
					description: req.body.docDescription,
					image_caption: req.body.imgCaption,
					path: req.file.path,
					original_file_name: req.file.originalname,
					mime_type: req.file.mimetype,
					GPSLatitudeRef: null,
					GPSLatitude: null,
					GPSLongitudeRef: null,
					GPSLongitude: null,
					GPSTimeStamp: null,
					GPSDateStamp: null,
					folder_id: req.body.folder_id
				};
				console.log(data);
				module.exports.db_saveDocument(data, (result) => {
					if (result.status) {
						return res.status(200).send(result);
					}
					return res.status(500).send(result);
				});
			} else {
				let data = {
					projectId: req.body.projectId,
					parentId: req.body.parentId,
					docType: req.body.docType,
					title: req.body.docTitle,
					description: req.body.docDescription,
					image_caption: req.body.imgCaption,
					path: req.file.path,
					original_file_name: req.file.originalname,
					mime_type: req.file.mimetype,
					GPSLatitudeRef: null,
					GPSLatitude: null,
					GPSLongitudeRef: null,
					GPSLongitude: null,
					GPSTimeStamp: null,
					GPSDateStamp: null,
					folder_id: req.body.folder_id
				};
				console.log(data);
				module.exports.db_saveDocument(data, (result) => {
					if (result.status) {
						return res.status(200).send(result);
					}
					return res.status(500).send(result);
				});
			}
		}
	},
	getLocalAddressFromExif(data, callback) {
		const host = 'https://api.opencagedata.com/geocode/v1/json?q=';
		const api_key = '16976e6429f84fdc9c3b7a64986bd9cb';

		//dd=x0+x1/60.+x2/3600
		let lat_arr = JSON.parse(data.GPSLatitude);
		let lan_arr = JSON.parse(data.GPSLongitude);
		let lat = lat_arr[0] + lat_arr[1] / 60 + lat_arr[2] / 3600;
		let lan = lan_arr[0] + lan_arr[1] / 60 + lan_arr[2] / 3600;

		let url = `${host}${lat}+${lan}&key=${api_key}`;
		console.log(url);
		request(url, { json: true }, (err, res, body) => {
			if (err) {
				console.log(err);
				return callback && callback();
			}
			console.log(body.results[0].formatted);
			return callback && callback(body.results[0].formatted);
		});
	},
	getExifInfo(image, callback) {
		console.log('enter getExifInfo');
		console.log(image);
		try {
			new ExifImage({ image: image }, function(error, exifData) {
				if (error) {
					console.log('*********exif info not found**************');
					console.log('Error: ' + error);
					console.log('*********End exif info not found**************');
					return callback && callback('no_exif');
				} else {
					if (!exifData) {
						console.log('No exif info found.');
						return callback && callback('null');
					} else {
						console.log('*********exif info found**************');
						console.log(exifData); // Do something with your data!
						return callback && callback(exifData);
					}
				}
			});
		} catch (error) {
			console.log('Error: ' + error.message);
		} finally {
			console.log('exit getExifInfo');
		}
	},

	db_setDefault(photoId, projectId, callback) {
		async.waterfall(
			[
				(fn) => {
					file_repoModel
						.update(
							{ isDefault: false },
							{
								where: {
									projectId: projectId,
									isActive: true
								}
							}
						)
						.then((d) => {
							return fn(null, true);
						});
				},
				(status, fn) => {
					file_repoModel
						.update(
							{ isDefault: true },
							{
								returning: true,
								where: {
									projectId: projectId,
									id: photoId,
									isActive: true
								}
							}
						)
						.then((d) => {
							return fn(null, true);
						});
				},
				(status, fn) => {
					if (status) {
						file_repoModel.findByPk(photoId).then((d) => {
							return fn(null, d);
						});
					} else {
						return fn(null, null);
					}
				}
			],
			(err, result) => {
				if (err) {
					console.log(err);
					return callback && callback({ status: false, message: err });
				}

				return callback && callback({ status: true, message: result });
			}
		);
	},

	setDefault(req, res) {
		module.exports.db_setDefault(req.body.photoId, req.body.projectId, (result) => {
			console.log(result);
			if (result.status) {
				return res.status(200).send(result);
			}

			return res.status(400).send(result);
		});
	},
	//APIs FOR MOBILE APP

	upload_config_mobile: multer({
		storage: multer.diskStorage({
			destination: function(req, file, cb) {
				console.log(config);
				let pId = req.projectId.trim();
				let dest = path.join(config.FILE_UPLOAD_PATH, pId);
				module.exports.checkDirectory(dest, () => {
					cb(null, dest);
				});
			},
			filename: function(req, file, cb) {
				cb(null, file.originalname);
			}
		})
	}),

	uploadFile_mobile(req, res) {
		if (!req.file) {
			console.log(req);
			console.log('File not found');
			return res.status(400).send({ status: false, message: 'File not found' });
		}
		let data = {
			projectId: req.projectId,
			parentId: req.parentId,
			docType: req.docType,
			title: req.docTitle,
			description: req.docDescription,
			image_caption: req.imgCaption,
			path: req.file.path,
			original_file_name: req.file.originalname,
			mime_type: req.file.mimetype
		};

		console.log(data);

		module.exports.db_saveDocument(data, (result) => {
			if (result.status) {
				return res.status(200).send(result);
			}
			return res.status(500).send(result);
		});
	}
};

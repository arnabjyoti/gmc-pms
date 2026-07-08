const file_repoModel = require("../models").file_repo;
const projectModel = require("../models").project;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const async = require("async");
const request = require("request");
const env = process.env.NODE_ENV || "test";
const config = require(__dirname + "/../config/config.json")[env];
const ExifImage = require("exif").ExifImage;

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
        folder_id: data.folder_id,
        user_id: data.user_id,
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
          isActive: true,
        },
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
          isActive: true,
        },
      })
      .then((docs) => callback({ status: true, message: docs }))
      .catch((error) => callback({ status: false, message: error }));
  },

  getDocuments(req, res) {
    if (!req.params.projectId) {
      console.log("Please give project id");
      return res
        .status(400)
        .send({ status: false, message: "Please give project id" });
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
      return res
        .status(400)
        .send({ status: false, message: "Please give folder_id" });
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
      if (
        err &&
        (err.errno === 34 || err.errno === -4058 || err.errno === -2)
      ) {
        console.log("ERROR:  ", err, "   ERROR CODE:  ", err.errno);
        //Create the directory, call the callback.
        console.log("Create " + directory);
        fs.mkdir(directory, callback);
      } else {
        //just in case there was a different error:
        console.log("Directory not created " + directory);
        if (!err) {
          return callback && callback();
        }
        console.log(err);
      }
    });
  },

  //multer config
  upload_config: multer({
    storage: multer.diskStorage({
      limits: { fileSize: 25 * 1024 * 1024 },
      destination: function (req, file, cb) {
        console.log("******inside multer******");
        let requestObject = req.body;
        console.log("RequestObject==", requestObject);
        // {"docType":"imageGallery","project_id":"null","user_id":"2","GPSLatitude":"26.0410288","GPSLongitude":"89.9567341","address":"unnamed road, Dhubri, Dhubri - 783300, Assam, India"}
        console.log("******inside multer end******");
        let user_id = requestObject.user_id;
		console.log("configgggg",config.FILE_UPLOAD_PATH,"piddddd",user_id);
        let dest = path.join(config.FILE_UPLOAD_PATH_GALLERY, user_id);
        module.exports.checkDirectory(dest, () => {
          cb(null, dest);
        });
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  }),

  //Start: Method to create a new folder
  createFolder(req, res) {
    // console.log(req);
    console.log(typeof req.body.requestObject.planned_end);
    return file_repoModel
      .create({
        original_file_name: req.body.requestObject.original_file_name,
        projectId: req.body.requestObject.projectId,
        isActive: true,
        type: "folder",
      })
      .then((folder) => res.status(200).send(folder))
      .catch((error) => res.status(400).send(error));
  },
  // End

  uploadFile(req, res) {
    if (!req.file) {
      console.log("File not found");
      return res.status(400).send({ status: false, message: "File not found" });
    } else {
      let requestObject = req.body;
      const imgFile = `${config.FILE_UPLOAD_PATH_GALLERY}/${requestObject.user_id}/${req.file.filename}`;
      const pathToSave = `${requestObject.user_id}/${req.file.filename}`;
      if (requestObject.docType === "imageGallery") {
        module.exports.getExifInfo(imgFile, (response) => {
          if (JSON.stringify(response) === "{}") {
            console.log("response is empty");
          } else {
            let data = {
              projectId: null,
              parentId: "0",
              docType: requestObject.docType,
              title: "Mobile app gallery image",
              description: "Geotag image uploaded from mobile app",
              image_caption: req.file.originalname,
              path: pathToSave,
              original_file_name: req.file.originalname,
              mime_type: req.file.mimetype,
              GPSLatitudeRef: JSON.stringify(response.gps.GPSLatitudeRef),
              GPSLatitude: requestObject.GPSLatitude,
              GPSLongitudeRef: JSON.stringify(response.gps.GPSLongitudeRef),
              GPSLongitude: requestObject.GPSLongitude,
              GPSTimeStamp: JSON.stringify(response.exif.CreateDate),
              GPSDateStamp: JSON.stringify(response.gps.GPSDateStamp),
              folder_id: "0",
              user_id: requestObject.user_id,
              address: requestObject.address,
            };
            console.log("DATA====", data);
            module.exports.db_saveDocument(data, (result) => {
              if (result.status) {
                return res.status(200).send(result);
              }
              return res.status(500).send(result);
            });
            // module.exports.getLocalAddressFromExif(data, (result) => {
            // 	data.address = result;
            // 	module.exports.db_saveDocument(data, (result) => {
            // 		if (result.status) {
            // 			return res.status(200).send(result);
            // 		}
            // 		return res.status(500).send(result);
            // 	});
            // });
          }
        });
      } else {
        module.exports.getExifInfo(imgFile, (response) => {
          if (JSON.stringify(response) === "{}") {
            console.log("response is empty");
          } else {
            let data = {
              projectId: req.body.project_id || null,
              parentId: "0",
              docType: requestObject.docType,
              title: "Mobile app project image",
              description: "Geotag image uploaded from mobile app",
              image_caption: req.file.originalname,
              path: pathToSave,
              original_file_name: req.file.originalname,
              mime_type: req.file.mimetype,
              GPSLatitudeRef: JSON.stringify(response.gps.GPSLatitudeRef),
              GPSLatitude: requestObject.GPSLatitude,
              GPSLongitudeRef: JSON.stringify(response.gps.GPSLongitudeRef),
              GPSLongitude: requestObject.GPSLongitude,
              GPSTimeStamp: JSON.stringify(response.exif.CreateDate),
              GPSDateStamp: JSON.stringify(response.gps.GPSDateStamp),
              folder_id: "0",
              user_id: requestObject.user_id,
              address: requestObject.address,
            };
            console.log("DATA====", data);
            module.exports.db_saveDocument(data, (result) => {
              if (result.status) {
                return res.status(200).send(result);
              }
              return res.status(500).send(result);
            });
          }
        });
      }
    }
  },

  imageMigration(req, res) {
	let requestObject = req.body;
	console.log("RequestObject==",requestObject);
	
    if (!requestObject) {
      console.log("Data not found");
      return res.status(400).send({ status: false, message: "Data not found" });
    } else {
	   const newData = {
			projectId: requestObject.project_id || null,
			user_id: requestObject.user_id || null,			
			title: 'Mobile app gallery image migration to project image',
			docType: 'projectImages'
		  };
	  
		  file_repoModel
			.update(newData, {
			  where: {
				file_path: requestObject.file_path
			  }
			})
			.then(p => {
			  return res.status(200).send({status:true, message:p});
			})
			.catch(err => {return res.status(400).send({status:false, message:err})});
    }
  },

  getLocalAddressFromExif(data, callback) {
    const host = "https://api.opencagedata.com/geocode/v1/json?q=";
    const api_key = "16976e6429f84fdc9c3b7a64986bd9cb";

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
      // console.log(body.results[0].formatted);
      return callback && callback(body.results[0].formatted);
    });
  },
  getExifInfo(image, callback) {
    console.log("enter getExifInfo");
    console.log(image);
    try {
      new ExifImage({ image: image }, function (error, exifData) {
        if (error) {
          console.log("*********exif info not found**************");
          console.log("Error: " + error);
          console.log("*********End exif info not found**************");
          return callback && callback(error);
        } else {
          if (!exifData) {
            console.log("No exif info found.");
          } else {
            console.log("*********exif info found**************");
            // console.log(exifData); // Do something with your data!
            return callback && callback(exifData);
          }
        }
      });
    } catch (error) {
      console.log("Error: " + error.message);
    } finally {
      console.log("exit getExifInfo");
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
                  isActive: true,
                },
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
                  isActive: true,
                },
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
        },
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
    module.exports.db_setDefault(
      req.body.photoId,
      req.body.projectId,
      (result) => {
        console.log(result);
        if (result.status) {
          return res.status(200).send(result);
        }

        return res.status(400).send(result);
      }
    );
  },

  //Start: Method to pull all projects based on the division (MOBILE APP)
  getAllProjectsByDiv(req, res) {
    console.log(req.params.division);
    return projectModel
      .findAll({
        raw: true,
        where: {
          division: req.params.division,
        },
      })
      .then((project) => {
        console.log(project);
        return res.status(200).send(project);
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send(error);
      });
  },
  //End

  //Start: Method to pull all projects based on user (MOBILE APP)
  getAllProjectsByUser(req, res) {
    return projectModel
      .findAll({
        raw: true,
        where: {
          accessKeyword: req.body.accessKeyword,
        },
      })
      .then((project) => {
        console.log(project);
        return res.status(200).send(project);
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send(error);
      });
  },
  //End

  //Start: Method to pull all projects based on user (MOBILE APP)
  getAllImagesByUser(req, res) {
    let requestObject = req.body;
	let query = {};
	if(requestObject.user_id){
		query = {
        raw: true,
        where: {
          isActive: "1",
          docType: "imageGallery",
          user_id: requestObject.user_id,
        },
      }
	}
	if(requestObject.project_id){
		query = {
        raw: true,
        where: {
          isActive: "1",
          docType: "projectImages",
          projectId: requestObject.project_id,
        },
      }
	}
    return file_repoModel
      .findAll(query)
      .then((files) => {
        let result = { status: true, message: files };
        console.log(result);
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(400)
          .send({ status: false, data: { message: error } });
      });
  },
  //End
};

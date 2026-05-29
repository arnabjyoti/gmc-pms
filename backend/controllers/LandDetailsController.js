const async = require("async");
const landDetailsModel = require("../models").land_details;

module.exports = {
    addLandDetails(req, res) {
        console.log("lllllllllllll",req.body.requestObject);
        return landDetailsModel
          .create({
            district_name: req.body.requestObject.district_name,
            location_name: req.body.requestObject.location_name,
            total_land: req.body.requestObject.total_land,
            allotable_land: req.body.requestObject.allotable_land,
            land_allot: req.body.requestObject.land_allot,
            vacant_land: req.body.requestObject.vacant_land,
            total_shed: req.body.requestObject.total_shed,
            shed_allot: req.body.requestObject.shed_allot,
            vacant_allotable_land: req.body.requestObject.vacant_allotable_land,
            vacant_shed_allot: req.body.requestObject.vacant_shed_allot,
            accessKeyword: req.body.requestObject.accessKeyword,
            status: req.body.requestObject.status,
        })
        .then(project => res.status(200).send(project))
        .catch(error => res.status(400).send(error));
    },

    getLandDetails(req, res) {
        return landDetailsModel
          .findAll({
            where: {
              status: '1',
            },
            order: [
                ['createdAt', 'DESC']
              ],
          })
          .then(engineerData => {
            return res.status(200).send(engineerData);
          })
          .catch(error => {
            console.log(error);
            return res.status(400).send(error);
          });
      },

        // Start: Method to update a project
    updateLand(req, res) {
    console.log("++++++++++++++++++++++++++++++++",req.body.requestObject);
    const newData = {
      district_name: req.body.requestObject.district_name,
      location_name: req.body.requestObject.location_name,
      total_land: req.body.requestObject.total_land,
      allotable_land: req.body.requestObject.allotable_land,
      land_allot: req.body.requestObject.land_allot,
      vacant_land: req.body.requestObject.vacant_land,
      total_shed: req.body.requestObject.total_shed,
      shed_allot: req.body.requestObject.shed_allot,
      vacant_allotable_land: req.body.requestObject.vacant_allotable_land,
      vacant_shed_allot: req.body.requestObject.vacant_shed_allot,
    };

    landDetailsModel
      .update(newData, {
        where: {
          id: req.body.requestObject.landID
        }
      })
      .then(p => {
        res.status(200).send(p);
      })
      .catch(err => res.status(400).send(err));
  },
  // End
      
}
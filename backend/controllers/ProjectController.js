const async = require("async");
const project_progress = require("../models/project_progress");
const projectModel = require("../models").project;
const physical_progress = require("../models").physical_progress;
const progressModel = require("../models").progress;
const disbursementModel = require("../models").disbursement;
const projectStatusModel = require("../models").project_status;
const fileRepoModel = require("../models").file_repo;
const userModel = require("../models").users;
const fundModel = require("../models").fund_received;
const project_MilestonModel = require("../models").project_milestones;
const projectTypeModel = require("../models").project_type_setup;


module.exports = {
  //Start: Method to create a new project
  createProject(req, res) {
    console.log("lllllllllllll",req.body.requestObject);
    return projectModel
      .create({
        code: req.body.requestObject.code,
        name: req.body.requestObject.name,
        type: req.body.requestObject.type,
        scheme_name: req.body.requestObject.scheme_name,
        district: req.body.requestObject.district,
        scheme: req.body.requestObject.scheme,
        description: req.body.requestObject.description,
        contractor_name_cs: req.body.requestObject.contractor_cs,
        contractor_name: req.body.requestObject.contractor,
        contractor_phone_cs: req.body.requestObject.contractorPhoneCs,
        contractor_phone: req.body.requestObject.contractorPhone,
        wo_no_cs: req.body.requestObject.wo_number_cs,
        wo_no: req.body.requestObject.wo_number,
        wo_date_cs: req.body.requestObject.wo_date_cs,
        wo_date: req.body.requestObject.wo_date,
        wo_amount_cs: req.body.requestObject.wo_amount_cs,
        wo_amount: req.body.requestObject.wo_amount,
        initial_amount: req.body.requestObject.initial_amount,
        tender_amount_cs: req.body.requestObject.tender_amount_cs,
        tender_amount: req.body.requestObject.tender_amount,
        total_disbursed_amount: req.body.requestObject.total_disbursed_amount,
        avatar: req.body.requestObject.avatar,
        status: req.body.requestObject.status,
        actual_start_cs: req.body.requestObject.actual_start_cs || null,
        actual_start: req.body.requestObject.actual_start || null,
        actual_end_cs: req.body.requestObject.actual_end_cs || null,
        actual_end: req.body.requestObject.actual_end || null,
        percentageProgress: null,
        financialProgress: null,
        aa_status: req.body.requestObject.aa_status,
        technical_approval: req.body.requestObject.technical_approval,
        accessKeyword: req.body.requestObject.accessKeyword,
        avail_status: req.body.requestObject.avail_status,
        completion_date: req.body.requestObject.completion_date || null,
      })
      .then(project => {
        console.log("check new entry", project);
        async.parallel({
          insertFunds: fn1 => {
            fundModel
              .create({
                projectId: project.id,
                // aa_amount: req.body.requestObject.aa_amount,
                // aa_number: req.body.requestObject.aa_number
              })
              .then(fund => {
                 
              });
          },
          
          // insertProgress: fn3 => {
          //   req.body.requestObject.milestoneDates.map(item=>{
          //   console.log("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",req.body.requestObject.milestoneDates);
          //   physical_progress
          //   .create({
          //     project_id: project.id,
          //     step: item.step,
          //     project_type: item.project_type
          //   })
          //   .then(n => {

          //   });
          // })
          // }
        });
        res.status(200).send(project);
      })
      .catch(error =>{
        res.status(400).send(error);
      });
  },
  // End

  deleteProject(req, res) {
    console.log("++++++++++++++++++++++++++++++++",req.body.requestObject.projectID);

    const newData = {
      avail_status: "0",
    };
    projectModel
      .update(newData, {
        where: {
          id: req.body.requestObject.projectID
        }
      })
      .then(p => {
        res.status(200).send(p);
      })
      .catch(err => res.status(400).send(err));
  },


  addProjectTypeSteps(req, res) {
    const propertyNames = Object.keys(req.body.requestObject);
    console.log(typeof propertyNames);
    return projectTypeModel
      .bulkCreate(req.body.requestObject, { returning: true })
      .then(data => {
        console.log(data);
        return res.status(200).send(data);
      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
        return res.status(400).send(project);
      });
  },
//Start: Method to pull all the projects oninit
getAllProjectsInit(req, res) {
  let query={
    raw: true,
    where: {
      avail_status: '1',
    },
    order: [
      ['createdAt', 'DESC']
    ],
    limit: 50,
    include: [
      {
        model: fileRepoModel,
        where: {
          isDefault: true
        },
        required: false,
        attributes: [
          ["original_file_name", "avatar"],
        ]
      },
      {
        model:fundModel,
        attributes : [
          "aa_number",
          "fsa",
          "foca"
        ],
       
      }
    ]
  }
  if(req.body.accessKeyword!='Access_All'){
    query.where = { accessKeyword: req.body.accessKeyword}
  }

  console.log("Query is==========> ",query);
  return projectModel
    .findAll(query)
    .then(project => {
      return res.status(200).send(project);
    })
    .catch(error => {
      console.log(error);
      return res.status(400).send(error);
    });
},


  //Start: Method to pull all the projects
  getAllProjects(req, res) {
    let query={
      raw: true,
      where: {
        avail_status: '1',
      },
      order: [
        ['createdAt', 'DESC']
      ],
      // attributes : [
      //   "name","id","type","division","ward_no","assigned_contractor","description",
      //   "status","assigned_to","actual_start", "initial_amount","percentageProgress","financialProgress", "mb_name","district_name","assembly_name","project_group","instance_of_project_group","accessKeyword"
      // ],
      include: [
        {
          model: fileRepoModel,
          where: {
            isDefault: true
          },
          required: false,
          attributes: [
            ["original_file_name", "avatar"],
            ["GPSLatitude", "GPSLatitude"],
            ["GPSLatitudeRef", "GPSLatitudeRef"],
            ["GPSLongitude", "GPSLongitude"],
            ["GPSLongitudeRef", "GPSLongitudeRef"]
          ]
        },
        {
          model:fundModel,
          attributes : [
            "aa_status",
            "fsa",
            "foca"
          ],
         
        }
      ]
    }
    // if(req.body.accessKeyword!='Access_All'){
    //   query.where = { accessKeyword: req.body.accessKeyword}
    // }

    console.log("Query is==========> ",query);
    return projectModel
      .findAll(query)
      .then(project => {
        return res.status(200).send(project);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });
  },
  // End

  //Start: Method to pull all the projects
  getAllProjectsNew(req, res) {
    let query = {
      raw: true,
      include: [
        {
          model: fileRepoModel,
          where: {
            isDefault: true
          },
          required: false,
          attributes: [
            ["original_file_name", "avatar"],
            ["GPSLatitude", "GPSLatitude"],
            ["GPSLatitudeRef", "GPSLatitudeRef"],
            ["GPSLongitude", "GPSLongitude"],
            ["GPSLongitudeRef", "GPSLongitudeRef"]
          ]
        },
        {
          model:fundModel,
          where:{
            projectId: projectModel.id,
          },
          attributes : [
            "aa_number"
          ],
         
        }
      ],
      offset: 0,
      limit: 20
    }
    if(req.body.accessKeyword!='Access_All'){
      query.where = { accessKeyword: req.body.accessKeyword}
    }




    return projectModel
      .findAll(query)
      .then(project => {
        return res.status(200).send(project);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });
  },
  // End

  //Start: Method to pull all the projects
  getAllProjectsRemaining(req, res) {
    return projectModel
      .findAll({
        raw: true,
        include: [
          {
            model: fileRepoModel,
            where: {
              isDefault: true
            },
            required: false,
            attributes: [
              ["original_file_name", "avatar"],
              ["GPSLatitude", "GPSLatitude"],
              ["GPSLatitudeRef", "GPSLatitudeRef"],
              ["GPSLongitude", "GPSLongitude"],
              ["GPSLongitudeRef", "GPSLongitudeRef"]
            ]
          },
          {
            model:fundModel,
            attributes : [
              "aa_number"
            ],
           
          }
        ],
        offset: 20
      })
      .then(project => {
        return res.status(200).send(project);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });
  },
  // End

  async projectCount(req, res){
   
    const cuurentCount = await projectModel.count({
      where: {
        status: 'Ongoing',
        avail_status: '1'
      }
    });

    const completedCount = await projectModel.count({
      where: {
        status: 'Completed',
        avail_status: '1'
      }
    });
    
    const totalCount = cuurentCount + completedCount;
    console.log("Total Count =========>>>",totalCount);
    try{
    return res.status(200).send({cuurentCount,completedCount,totalCount});
    }catch(err){
      return res.status(400).send(err);
    }
  },

  //Start: Method to pull all the projects
  getAllOngoing(req, res) {
    let query ={
      where: {
        status: "Ongoing"
      },
      raw: true,
      include: [
        {
          model: fileRepoModel,
          where: {
            isDefault: true
          },
          required: false,
          attributes: [
            ["original_file_name", "avatar"],
            ["GPSLatitude", "GPSLatitude"],
            ["GPSLatitudeRef", "GPSLatitudeRef"],
            ["GPSLongitude", "GPSLongitude"],
            ["GPSLongitudeRef", "GPSLongitudeRef"]
          ]
        },
        {
          model:fundModel,
          attributes : [
            "aa_number"
          ],
         
        }
      ]
    }
    if(req.body.accessKeyword!='Access_All'){
      query.where.accessKeyword = req.body.accessKeyword;
    }

    return projectModel
      .findAll(query)
      .then(project => {
        return res.status(200).send(project);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });
  },
  // End

  // Start: Method to get all projects which are completed
  getAllCompletedProjects(req, res) {
    return projectModel
      .findAll({
        where: {
          status: "Completed"
        },
        raw: true,
        include: [
          {
            model: fileRepoModel,
            where: {
              isDefault: true
            },
            required: false,
            attributes: [["original_file_name", "avatar"]]
          },
          {
            model:fundModel,
            attributes : [
              "aa_number"
            ],
           
          }
        ]
      })
      .then(project => {
        return res.status(200).send(project);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });
  },
  // End

  //Start: Method to get ongoing projects
  getAllOngoingProjects(req, res) {
    return projectModel
      .findAll({
        where: {
          status: "Ongoing"
        },
        raw: true,
        include: [
          {
            model: fileRepoModel,
            where: {
              isDefault: true
            },
            required: false,
            attributes: [["original_file_name", "avatar"]]
          },
          {
            model: disbursementModel,
            required: false,
            attributes: [
              ["amount", "Amount"],
              ["note", "Note"]
            ]
          },
          {
            model: progressModel,
            required: false,
            attributes: [
              ["progress_percent", "ProgressPercent"],
              ["progress_date", "ProgressDate"]
            ]
          },
          {
          model:fundModel,
          attributes : [
            "aa_number"
          ],
         
        }
        ]
      })
      .then(project => {
        return res.status(200).send(project);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });
  },

  //Start: Method to get ongoing projects
  getAllRejectedProjects(req, res) {
    return projectModel
      .findAll({
        where: {
          status: "Rejected"
        },
        raw: true,
        include: [
          {
            model: fileRepoModel,
            where: {
              isDefault: true
            },
            required: false,
            attributes: [["original_file_name", "avatar"]]
          },
          {
            model:fundModel,
            attributes : [
              "aa_number"
            ],
           
          }
        ]
      })
      .then(project => {
        return res.status(200).send(project);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });
  },

  //  Start: Method to get project by id
  getProjectById(req, res) {
    var projectId = req.params.projectId;
    var proj = {};
    return projectModel
      .findOne({
        where: {
          id: projectId
        },
        raw: true
      })
      .then(p => {
        proj.project = p;
        if (!p) {
          res.status(200).send({});
          // return fn(proj);
        }
        async.parallel(
          {
            progress: fn1 => {
              progressModel
                .findAll({
                  where: {
                    projectId: p.id
                  },
                  raw: true
                })
                .then(pr => {
                  return fn1(null, pr);
                });
            },
            fund: fn1 => {
              fundModel
                .findAll({
                  where: {
                    projectId: p.id
                  },
                  raw: true
                })
                .then(fund => {
                  return fn1(null, fund);
                });
            },
            cost: fn1 => {
              disbursementModel
                .findAll({
                  where: {
                    projectId: p.id
                  },
                  raw: true
                })
                .then(d => {
                  return fn1(null, d);
                });
            },
            status: fn1 => {
              projectStatusModel
                .findAll({
                  where: {
                    project_id: p.id
                  },
                  order: [["date_updated", "DESC"]],
                  include: [
                    {
                      model: userModel,
                      attributes: ["name", "role"]
                    }
                  ],

                  raw: true
                })
                .then(s => {
                  return fn1(null, s);
                });
            },
            photo: fn1 => {
              fileRepoModel
                .findOne({
                  where: {
                    projectId: projectId,
                    isDefault: true,
                    isActive: true
                  },
                  raw: true
                })
                .then(f => {
                  if (!f) {
                    return fn1(null, null);
                  }

                  return fn1(null, f.original_file_name);
                });
            }
          },
          (err, results) => {
            if (err) {
              console.log(err);
            }
            // results is now equals to: {one: 1, two: 2}
            proj.progress = results.progress;
            proj.disbursement = results.cost;
            proj.status = results.status;
            proj.fund = results.fund;
            proj.project.profilePhoto = results.photo;
            res.status(200).send(proj);
          }
        );
      })
      .catch(error => res.status(500).send(error));
  },
  // End

  // Start: Method to update a project
  updateProject(req, res) {
    console.log("++++++++++++++++++++++++++++++++",req.body.requestObject);
    const newData = {
      name: req.body.requestObject.projectTitle,
      scheme_name: req.body.requestObject.scheme_name,
      district: req.body.requestObject.district,
      wo_no: req.body.requestObject.wo_no,
      wo_no_cs: req.body.requestObject.wo_no_cs,
      description: req.body.requestObject.projectDescription,
      remarks: req.body.requestObject.remarks,
      contractor_name: req.body.requestObject.contractor_name,
      contractor_name_cs: req.body.requestObject.contractor_name_cs,
      contractor_phone: req.body.requestObject.contractor_phone,
      contractor_phone_cs: req.body.requestObject.contractor_phone_cs,
      initial_amount: req.body.requestObject.projectPlannedCost,
      tender_amount_cs: req.body.requestObject.tender_amount_cs,
      tender_amount: req.body.requestObject.tender_amount,
      wo_date_cs: req.body.requestObject.wo_date_cs,
      wo_date: req.body.requestObject.wo_date,
      wo_amount: req.body.requestObject.wo_amount,
      wo_amount_cs: req.body.requestObject.wo_amount_cs,
      actual_start: req.body.requestObject.projectActualStartDate,
      actual_end: req.body.requestObject.projectActualEndDate,
      percentageProgress: req.body.requestObject.percentageProgress,
      percentageProgressCs: req.body.requestObject.percentageProgressCs,
      financialProgress: req.body.requestObject.financialProgress,
      financialProgressCs: req.body.requestObject.financialProgressCs,
      fileNo: req.body.requestObject.fileNo,
      aa_status: req.body.requestObject.aa_status,
      technical_approval: req.body.requestObject.technical_approval,
      updatedAt: req.body.requestObject.projectUpdatedAt,
      completion_date: req.body.requestObject.completion_date,
    };

    projectModel
      .update(newData, {
        where: {
          id: req.body.requestObject.projectID
        }
      })
      .then(p => {
        async.parallel({
          updateFunds: fn1 => {
            fundData = {
              // aa_date: req.body.requestObject.aa_date,
              // aa_amount: req.body.requestObject.aa_amount,
              aa_number: req.body.requestObject.aa_number
            };
            console.log("Project ID=",req.body.requestObject.projectID);
            fundModel
              .update(fundData, {
                where: {
                  projectId: req.body.requestObject.projectID
                }
              })
              .then(r => {
                console.log(r);
                res.status(200).send(r);
                // res.status(200).send(p);
              })
              .catch(err => res.status(400).send(err));
          }
        });
      })
      .catch(err => res.status(400).send(err));
  },
  // End

  getProjectSteps(req, res) {
    var projectType = req.params.projectType;
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",projectType);
    projectTypeModel
      .findAll({
        where: {
          project_type: projectType
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

  getProjectByDistrict(req,res) {
    var districtName = req.params.ulb;
    return projectModel
    .findAll({
      where: {
        district_name: districtName
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

  getProjectsOfGroup1(req,res) {
    console.log(req.body);
     projectModel
    .findAll({
      where: {
        // project_group: req.body.projectGroup,
        // instance_of_project_group: req.body.instanceOfProjectGroup1
        accessKeyword: req.body.instanceOfProjectGroup1
        
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

  getProjectByUlb(req,res) {
    var districtName = req.body.district_name;
    var mbName = req.body.mb_name;
    var assemblyName = req.body.assembly_name;
     projectModel
    .findAll({
      where: {
        district_name: districtName,
        mb_name: mbName,
        assembly_name: assemblyName,
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

  getProjectDetailsById(req, res) {
    var projectId = req.params.projectId;
    var proj = {};
    return projectModel
      .findOne({
        where: {
          id: projectId
        },
        raw: true
      })
      .then(p => {
        proj.project = p;
        if (!p) {
          res.status(200).send({});
          // return fn(proj);
        }
        async.parallel(
          {
            fund: fn1 => {
              fundModel
                .findAll({
                  where: {
                    projectId: p.id
                  },
                  raw: true
                })
                .then(fund => {
                  return fn1(null, fund);
                });
            },
            photo: fn1 => {
              fileRepoModel
                .findOne({
                  where: {
                    projectId: projectId,
                    isDefault: true,
                    isActive: true
                  },
                  raw: true
                })
                .then(f => {
                  if (!f) {
                    return fn1(null, null);
                  }

                  return fn1(null, f.original_file_name);
                });
            }
          },
          (err, results) => {
            if (err) {
              console.log(err);
            }
            // results is now equals to: {one: 1, two: 2}
            proj.progress = results.progress;
            proj.fund = results.fund;
            proj.project.profilePhoto = results.photo;
            res.status(200).send(proj);
          }
        );
      })
      .catch(error => res.status(500).send(error));
  },

  getProjectFundById(req, res) {
    var projectId = req.params.projectId;
    var proj = {};
    return projectModel
      .findOne({
        where: {
          id: projectId
        },
        raw: true
      })
      .then(p => {
        proj.project = p;
        if (!p) {
          // console.log("Inside not P from Project controller")
          res.status(200).send({});
          // return fn(proj);
        }
        async.parallel(
          {
            fund: fn1 => {
              fundModel
                .findAll({
                  where: {
                    projectId: p.id
                  },
                  raw: true
                })
                .then(fund => {
                  return fn1(null, fund);
                });
            }
          },
          (err, results) => {
            if (err) {
              console.log(err);
            }
            proj.fund = results.fund;
            proj.project.profilePhoto = results.photo;
            res.status(200).send(proj);
          }
        );
      })
      .catch(error => res.status(500).send(error));
  },

  getProjectTypeById(req, res) {
    var projectId = req.params.projectId;
    return projectModel
      .findOne({
        where: {
          id: projectId
        },
        attributes: ["scheme", "scheme"]
      })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getProjectNameById(req, res) {
    var projectId = req.params.projectId;
    return projectModel
      .findOne({
        where: {
          id: projectId
        },
        attributes: [["name", "name"], ["accessKeyword", "accessKeyword"]]
      })
      .then(data => {
        let row = data.dataValues;
        res.status(200).send(data);
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
  },
  //  Start: Method to get all milestones by project type id
  getMilestones(req, res) {
    var projectTypeId = req.body.requestObject;
    projectTypeModel
        .findAll({
          where: {
            project_type: projectTypeId
          },
          attributes: [["steps", "steps"], ["project_type", "project_type"]]
        })
        .then(m => {
          res.status(200).send(m);
        })
        .catch(error => {
          console.log(error);
          res.status(400).send(error);
        });
  },
  // End
};

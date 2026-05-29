const async = require("async");
const usersModel = require("../models").users;
const rolePrivilegeModel = require("../models").roles;
const privilegeModel = require("../models").privilege;
const bcrypt = require("bcrypt");
var request = require('request');

module.exports = {
  //Start: Method to authenticate a user
  authenticate(req, res) {
    var flag = false;
    const email = req.body.requestObject.email;
    const password = req.body.requestObject.password;
    const hashPass = bcrypt.hashSync(password, 10);
    var userObject = {};
    console.log("++++++++++++",userObject);

    return usersModel
      .findOne({
        where: {
          email: email,
          // password: hashPass,
          active: true
        },
        attributes: [
          "id",
          "name",
          "email",
          "password",
          "phone_no",
          "avatar",
          "role",
          "accessKeyword",
        ]
      })
      .then(userData => {
        if (!userData) {
          return res.status(200).send({
            status: false,
            message: `Wrong email.`,
            type: `email`
          });
        } else {
          userData = userData.get();
          userObject.usr = userData;
          const passDb = userObject.usr["password"];
          bcrypt.compare(password, passDb, function(err, result) {
            if (result == true) {
              rolePrivilegeModel
                .findAll({
                  where: {
                    role: userData.role
                  },
                  include: [
                    {
                      model: privilegeModel,
                      attributes: ["id", "slug"]
                    }
                  ],
                  raw: true
                })
                .then(perm => {
                  userObject.privileges = perm;
                  return res
                    .status(200)
                    .send({ status: true, message: userObject });
                })
                .catch(error => {
                  console.log(error);
                  return res
                    .status(500)
                    .send({ status: false, message: error });
                });
            } else {
              return res.status(200).send({
                status: false,
                message: `Wrong password.`,
                type: `password`
              });
            }
          });

          // rolePrivilegeModel
          //   .findAll({
          //     where: {
          //       role: userData.role
          //     },
          //     include: [
          //       {
          //         model: privilegeModel,
          //         attributes: ["id", "slug"]
          //       }
          //     ],
          //     raw: true
          //   })
          //   .then(perm => {
          //     userObject.privileges = perm;
          //     console.log(userObject);
          //     return res
          //       .status(200)
          //       .send({ status: true, message: userObject });
          //   })
          //   .catch(error => {
          //     console.log(error);
          //     return res.status(500).send({ status: false, message: error });
          //   });
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).send({ status: false, message: error });
      });
  },
  //End

  //Get Engineers
  getEngineers(req, res) {
    return usersModel
      .findAll({
        where: {
          role: ["engineer", "contractor"]
        },
        attributes: ["role", "name"]
      })
      .then(engineerData => {
        return res.status(200).send(engineerData);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });
  },

  //Start: Method to reset password
  resetPassword(req, res) {
    console.log(req.body.requestObject)
    const hashPass = bcrypt.hashSync(req.body.requestObject.password, 10);
    const newData = {
      password: hashPass,
      temp_password: hashPass
    };

    console.log(newData)

    return usersModel
      .update(newData, {
        where: {
          id: req.body.requestObject.id
        }
      })
      .then(p => {
        res.status(200).send(p);
      })
      .catch(err => {
        console.log(err)
        res.status(400).send(err)
      });
  },
  //End

  createUser(req, res) {
    const hashPass = bcrypt.hashSync(req.body.requestObject.password, 10);
    return usersModel
      .create({
        name: req.body.requestObject.name,
        email: req.body.requestObject.email,
        phone_no: req.body.requestObject.phone_no,
        password: hashPass,
        temp_password: req.body.requestObject.password,
        role: req.body.requestObject.role,
        avatar: req.body.requestObject.avatar,
        active: 1
      })
      .then(project => res.status(200).send(project))
      .catch(error => res.status(400).send(error));
  },
  // End

  getOTP(req, res){
    let phone = req.body.requestObject.phone;
    let url = "https://api.msg91.com/api/v5/otp?extra_param=%7B%22Param1%22%3A%22Value1%22%2C%20%22Param2%22%3A%22Value2%22%2C%20%22Param3%22%3A%20%22Value3%22%7D&unicode=&authkey=341860Avn4nx7X5f623b60P1&template_id=5f625f5af1c78676f44e8cf2&mobile=91"+phone+"&invisible=1&userip=IPV4%20User%20IP&email=Email%20ID&otp_length=5&otp_expiry=10";

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          return res.status(200).send(body);
      }else{
        return res.status(400).send(error);
      }
    });
  },

  verifyOTP(req, res){
    if(req){
      let phone = req.body.requestObject.phone;
      let otp = req.body.requestObject.otp;
      let url = "https://api.msg91.com/api/v5/otp/verify?otp_expiry=10&mobile=91"+phone+"&otp="+otp+"&authkey=341860Avn4nx7X5f623b60P1";
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return res.status(200).send(body);
        }else{
          return res.status(400).send(error);
        }
      });
    }else{
      return res.status(400).send({'error':'Something went wrong'});
    }
  },

  registerCitizen(req, res) {
    let phone = req.body.requestObject.phone;
    if(phone===null || phone===''){
      return res.status(400).send({'error':'Something went wrong'});
    }
    return usersModel
      .findOne({
        where: {
          phone_no:phone,
          active: true
        },
        attributes: [
          "id",
          "name",
          "email",
          "password",
          "phone_no",
          "avatar",
          "role",
          "district",
          "mb_name",
          "assembly"
        ]
      })
      .then(userData => {
        if (!userData) {
          return usersModel
            .create({
              name: req.body.requestObject.name,
              email: req.body.requestObject.email,
              phone_no: req.body.requestObject.phone,
              avatar:'assets/images/user/user.png',
              password: '',
              temp_password:'',
              role: req.body.requestObject.role,
              active:true,
              rememberToken: null
            })
            .then(user => {
              res.status(200).send({
                status: true,
                message: user,
                type: `success`
              });
            })
            .catch(error => res.status(400).send(error));
        } else {
          return res.status(200).send({
            status: true,
            message: `Already registered`,
            type: `exist`
          });
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).send({ status: false, message: error });
      });
  },
  //End

  publicLogin(req, res) {
    let phone = req.body.requestObject.phone;
    if(phone===null || phone===''){
      return res.status(400).send({'error':'Something went wrong'});
    }
    return usersModel
      .findOne({
        where: {
          phone_no:phone,
          active: true
        },
        attributes: [
          "id",
          "name",
          "email",
          "password",
          "phone_no",
          "avatar",
          "role"
        ]
      })
      .then(userData => {
        if (!userData) {
          return res.status(200).send({
            status: false,
            message: `Wrong phone number`,
            type: `phone`
          });
        } else {
          var userObject = {};
          userData = userData.get();
          userObject.usr = userData;
          rolePrivilegeModel
                .findAll({
                  where: {
                    role: userData.role
                  },
                  include: [
                    {
                      model: privilegeModel,
                      attributes: ["id", "slug"]
                    }
                  ],
                  raw: true
                })
                .then(perm => {
                  userObject.privileges = perm;
                  return res
                    .status(200)
                    .send({ status: true, message: userObject });
                })
                .catch(error => {
                  console.log(error);
                  return res
                    .status(500)
                    .send({ status: false, message: error });
                });
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).send({ status: false, message: error });
      });
  },
  //End

};

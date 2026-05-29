import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import * as _ from 'underscore';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public userObject: any;
  accessKeyword:any;
  constructor(
    private appService: AppService,
    private http: Http,
  ) {
    // let token = JSON.parse(localStorage.getItem('token'));
    this.accessKeyword = 'Access_All';
  }

  //Start: Method to create a new project
  loginVerify(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/authenticate`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
    console.log("+++++++++++", req);
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          return callback && callback(response.json());
        },
        error => {

          return callback && callback(error);

        },
        () => {
        });
  }
  // End 

  //Start: Method to pull all the projects
  projectCount(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/projectCount`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      body: {accessKeyword:this.accessKeyword}
    };
    this.http.get(ENDPOINT, requestOptions).subscribe(
      response => {
        return callback && callback(response.json());
      },
      error => {
        return callback && callback(error);
      },
      () => { }
    );
  }
  // End

   //Start: Method to pull all the projects
   getAllProjects(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getAllProjects`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      body: {accessKeyword:this.accessKeyword}
    };
    this.http.get(ENDPOINT, requestOptions).subscribe(
      response => {
        return callback && callback(response.json());
      },
      error => {
        return callback && callback(error);
      },
      () => { }
    );
  }
  // End

  checkAccessRight(accessRight) {
    let userData = localStorage.getItem('token');

    let found = null;
    if (!_.isEmpty(userData)) {
      const privilegs = JSON.parse(userData).privileges || [];
      found = _.find(privilegs, (p) => {
        return p['privilege.slug'] == accessRight;
      });
      if (found) {
        return true;
      }
      return false;
    }
    return false;
  }

  return_HasAddStepsRight() {
    return this.checkAccessRight('Add_Steps');
  }

  return_hasAddNote() {
    return this.checkAccessRight('Add_Note');
  }

  return_UserObject() {
    return this.userObject;
  }

  return_HasCreateUserRights() {
    return this.checkAccessRight('Create_User');
  }

  return_HasCreateProjectRights() {
    return this.checkAccessRight('Create_Project');
  }

  return_hasApproveProjectRights() {
    return this.checkAccessRight('Approve_Project');
  }

  return_hasViewProjectDetailsRights() {
    return this.checkAccessRight('View_Project_Details');
  }

  return_hasUpdateProjectDetailsRights() {
    return this.checkAccessRight('Update_Project_Details');
  }

  return_hasViewDisbursementsRights() {
    return this.checkAccessRight('View_Disbursements');
  }

  return_hasAddDisbursementRights() {
    return this.checkAccessRight('Add_Disbursement');
  }

  return_hasUpdateDelDisbursementRights() {
    return this.checkAccessRight('Update_Del_Disbursement');
  }

  return_hasViewProgressRights() {
    return this.checkAccessRight('View_Progress');
  }

  return_hasAddProgressRights() {
    return this.checkAccessRight('Add_Progress');
  }

  return_hasUpdateDelProgressRights() {
    return this.checkAccessRight('Update_Del_Progress');
  }

  return_hasViewDocumentsRights() {
    return this.checkAccessRight('View_Documents');
  }

  return_hasUploadDocumentsRights() {
    return this.checkAccessRight('Upload_Documents');
  }

  return_hasViewGalleryRights() {
    return this.checkAccessRight('View_Gallery');
  }

  return_hasUploadImageRights() { 
    return this.checkAccessRight('Upload_Image');
  }
  return_hasViewAssemblyRights() {
    return this.checkAccessRight('View_Assembly');
  }
  return_hasUploadAssemblyRights() {
    return this.checkAccessRight('Upload_Assembly');
  }
}

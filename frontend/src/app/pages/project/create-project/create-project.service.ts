import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import {AppService} from '../../../app.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {

  constructor(
    private appService:AppService,
    private http: Http,
    private toastr: ToastrService
  ) { }

  //Start: Method to create a new project
  createProject(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/createProject`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          this.toastr.success('Project created successfully.','Success!',{
            disableTimeOut:false
          });
          return callback && callback(response.json());
        },
        error => {
          console.log(error);
          
          this.toastr.error('Project not created.','Failed!',{
            disableTimeOut:false
          });
          return callback && callback(error);
        },
        () => {
          console.log("Observable is now completed.");
        });
  }
  // End

  getMilestones(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/getMilestones`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          return callback && callback(response.json());
        },
        error => {
          return callback && callback(error);
        },
        () => {
          console.log("Observable is now completed.");
        });
  }
}

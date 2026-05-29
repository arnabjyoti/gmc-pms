import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import {AppService} from '../../../../../app.service';

@Injectable({
  providedIn: 'root'
})
export class AssemblyQuestionsService {

  constructor(
    private appService:AppService,
    private http:Http,
    private toastr: ToastrService
  ) { }

  saveAssemblyQuestions(req: any, callback: any) {
    console.log("reqqqqqq",req);
    
    const ENDPOINT = `${environment.BASE_URL}/api/addAssembly`;
    const requestOptions = {
        headers: this.appService.headers,
        method: 'post',
        requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
        .subscribe(
            (response) => {
                console.log("Success");
                // this.toastr.success('Query Saved.','Success!',{
                //     disableTimeOut:false
                // });
                return callback && callback(response.json());
            },
            error => {
                // this.toastr.error('Query not saved.','Failed!',{
                //     disableTimeOut:false
                // });
                return callback && callback(error);
            },
            () => {
                console.log("Observable is now completed.");
            });
  }

  getAssemblyQuestionsById = (projectId: any, callback: any) => {
    const ENDPOINT = `${environment.BASE_URL}/api/getAssemblyByProjectId/${projectId}`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "get"
    };
    this.http.get(ENDPOINT, requestOptions).subscribe(
      (response) => {
        return callback && callback(response.json());
      },
      error => {
        return callback && callback(error);
      },
      () => {
        console.log("Observable is now completed.");
      }
    );
  }

  updateAssembly = (data: any, callback: any ) => {
    const ENDPOINT = `${environment.BASE_URL}/api/updateAssembly`;
    const requestObject = {
      id: data.id,
      answer: data.answer
    }
    const requestOptions = {
      headers: this.appService.headers,
      method: 'post',
      requestObject
  };
  console.log("reqoptions", requestOptions);
  
  this.http.post(ENDPOINT, requestOptions)
        .subscribe(
            (response) => {
                console.log("Success");
                // this.toastr.success('Query Saved.','Success!',{
                //     disableTimeOut:false
                // });
                return callback && callback(response.json());
            },
            error => {
                // this.toastr.error('Query not saved.','Failed!',{
                //     disableTimeOut:false
                // });
                return callback && callback(error);
            },
            () => {
                console.log("Observable is now completed.");
            });

  }

  getAssemblyQuestions = (callback: any) => {
    const ENDPOINT = `${environment.BASE_URL}/api/getAssembly`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "get"
    };
    this.http.get(ENDPOINT, requestOptions).subscribe(
      response => {
        return callback && callback(response.json());
      },
      error => {
        return callback && callback(error);
      },
      () => {}
    );
  }

}

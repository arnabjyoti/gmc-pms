import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { callbackify } from 'util';
import { environment } from '../../../environments/environment';
import {AppService} from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class PublicRegistrationService {

  constructor(
    private http:Http,
    private appService:AppService
    ) { }

  // registerMe = (req, callback) =>{
  //   console.log(req);
  //   return callback && callback("Done");
  //   // this.http.post("http://localhost/demo/upload.php", formData)
  //   //   .pipe(
  //   //     finalize(() => {
  //   //     })
  //   //   )
  //   //   .subscribe(res => {
  //   //     if (res=='yes') {
  //   //       this.showOTPInput = true;
  //   //     } else {
  //   //       this.toastr.error("User Already exist Or Something went wrong", "Warning")

  //   //     }
  //   //   });
  // }

  //Start: Method to create a new project
  getOTP(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getOTP`;
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
        });
  }
  // End 

  verifyOtp = (req, callback) =>{
    const ENDPOINT = `${environment.BASE_URL}/api/verifyOTP`;
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
        });
  }

  registerCitizen = (req, callback) =>{
    const ENDPOINT = `${environment.BASE_URL}/api/registerCitizen`;
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
        });
  }

}

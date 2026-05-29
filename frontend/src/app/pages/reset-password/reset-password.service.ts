import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { environment } from '../../../environments/environment';

import {AppService} from '../../app.service';

import { ToastrService } from 'ngx-toastr';

import * as $ from 'jquery';


@Injectable({
  
providedIn: 'root'

})

export class ResetPasswordService {

  
constructor(
    private appService:AppService,
   
 private http: Http,
   
 private toastr: ToastrService
  
) { }
  
// resetPassword(req: any, callback: any) {
  //   const ENDPOINT = `${environment.BASE_URL}/api/resetPassword`;
  //   console.log(environment.BASE_URL)
  //   const requestOptions = {
  //     headers: this.appService.headers,
  //     requestObject: req
  //   };
  //   console.log("requestObject===",requestOptions);
  //   this.http.post(ENDPOINT, requestOptions)
  //     .subscribe(
  //       (response) => {
  //         this.toastr.success('Password Changed Successfully.','Success!',{
  //           disableTimeOut:false
  //         });
  //         return callback && callback(response.json());
  //       },
  //       error => {
  //         this.toastr.error('Failed to change Password','Failed!',{
  //           disableTimeOut:false
  //         });
  //         return callback && callback(error);
  //       }
  //     }


  resetPassword(req: any, callback: any) {
		const ENDPOINT = `${environment.BASE_URL}/api/resetPassword`;
		const requestOptions = {
			headers: this.appService.headers,
			method: 'post',
			requestObject: req
		};
		console.log(requestOptions);
		this.http.post(ENDPOINT, requestOptions).subscribe(
			(response) => {
				console.log('Success');
				console.log(response);
				this.toastr.success('Password reset.', 'Success!', {
					disableTimeOut: false
				});
				return callback && callback(response.json());
			},
			(error) => {
				this.toastr.error('Password not reset.', 'Failed!', {
					disableTimeOut: false
				});
				return callback && callback(error);
			},
			() => {
				console.log('Observable is now completed.');
			}
		);
	}
}

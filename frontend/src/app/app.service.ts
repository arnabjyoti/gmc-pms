import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public headers: any;
  constructor(
	private toastr: ToastrService,  
	private http: Http) {
    this.getHttpHeader((h: any) => {
      this.headers = h;
    });
   }

   getHttpHeader = (callback: any) => {
    let headers = new Headers();//new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'Test key');
    headers.append('Access-Control-Allow-Origin', '*');
    return callback && callback(headers);
  }

  //Start: Method to pull all the projects
	getProjectById(projectId: any, callback: any) {
		const ENDPOINT = `${environment.BASE_URL}/api/getProjectById/${projectId}`;
		const requestOptions = {
			headers: this.headers,
			method: 'get'
		};
		this.http.get(ENDPOINT, requestOptions).subscribe(
			(response) => {
				console.log('Success');
				return callback && callback(response.json());
			},
			(error) => {
				return callback && callback(error);
			},
			() => {
				console.log('Observable is now completed.');
			}
		);
  }

  //Start: Method to pull engineer's names
  getEngineers = (callback: any) =>{

	const ENDPOINT = `${environment.BASE_URL}/api/getEngineers`;
	const requestOptions = {
		headers: this.headers,
		method:'get'
	};
	this.http.get(ENDPOINT, requestOptions)
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
//End

	//Start: Method to pull notes by logged in user
	getUserNotes = (userId, callback: any) =>{
		const ENDPOINT = `${environment.BASE_URL}/api/getUserNotes/${userId}`;
		const requestOptions = {
			headers: this.headers,
			method:'get'
		};
		this.http.get(ENDPOINT, requestOptions)
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
	//End

	updateNoteReadStatus = (receiver_uid:any, projectId:any, callback: any) =>{
		console.log(receiver_uid,projectId)
		const ENDPOINT = `${environment.BASE_URL}/api/update-note`;
		const requestOptions = {
		headers: this.headers,
		requestObject: {
			receiver_uid:receiver_uid,
			projectId:projectId
		}
		};
		console.log("requestObject===",requestOptions);
		this.http.post(ENDPOINT, requestOptions)
		.subscribe(
			(response) => {
			// this.toastr.success('Note read status updated successfully.','Success!',{
			// 	disableTimeOut:false
			// });
			return callback && callback(response.json());
			},
			error => {
			this.toastr.error('read status not updated.','Failed!',{
				disableTimeOut:false
			});
			return callback && callback(error);
			},
			() => {
			console.log("Observable is now completed.");
			});
	}
}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../../../../../environments/environment';
import {AppService} from '../../../../../app.service';

@Injectable({
  providedIn: 'root'
}) 
export class AddNoteService {

  constructor(
    private appService:AppService,
    private http:Http
  ) { }

  //Start: Method to create note  
   saveNote(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/addNote`;
    const requestOptions = {
        headers: this.appService.headers,
        method: 'post',
        requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
        .subscribe(
            (response) => {
                console.log("Success");
                // this.toastr.success('Folder Created.','Success!',{
                //     disableTimeOut:false
                // });
                return callback && callback(response.json());
            },
            error => {
                // this.toastr.error('Folder not created.','Failed!',{
                //     disableTimeOut:false
                // });
                return callback && callback(error);
            },
            () => {
                console.log("Observable is now completed.");
            });
  }
  // End  
  //Start: Method to get note
  getNote(projectId:any, callback: any){
    const ENDPOINT = `${environment.BASE_URL}/api/getNote/${projectId}`;
		const requestOptions = {
			headers: this.appService.headers,
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
  //end

   //Start: Method to get note
   getAllEmployees(callback: any){
    const ENDPOINT = `${environment.BASE_URL}/api/getEmployees`;
		const requestOptions = {
			headers: this.appService.headers,
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
  //end
}

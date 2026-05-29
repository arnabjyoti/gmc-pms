import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../../../../../environments/environment';
import { AppService } from '../../../../../app.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FundsReceivedService {

  constructor(
    private toastr: ToastrService,
		private appService: AppService,
		private http: Http
  ) { }

  //Start: Method to add projects progress
  updateFundReceived(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updateFundReceived`;
    const requestOptions = {
        headers: this.appService.headers,
        method: 'post',
        requestObject: req
    };
    console.log(requestOptions);
    this.http.post(ENDPOINT, requestOptions)
        .subscribe(
            (response) => {
                console.log("Success");
                this.toastr.success('Funds Updated.','Success!',{
                    disableTimeOut:false
                });
                console.log(callback(response.json()))
                return callback && callback(response.json());
            },
            error => {
                this.toastr.error('Funds Not Updated.','Failed!',{
                    disableTimeOut:false
                });
                return callback && callback(error);
            },
            () => {
                console.log("Observable is now completed.");
            });
}
// End

getProjectFundById(projectId: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectFundById/${projectId}`;
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
}

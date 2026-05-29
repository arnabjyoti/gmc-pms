import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandDetailsService {
  public accessKeyword:any=null;

  constructor(
    private appService:AppService,
    private http: Http,
    private toastr: ToastrService
  ) { }

  addLandDetails(req: any, callback: any) {
    console.log("bbbbbbbbbbbbb",req);
    const ENDPOINT = `${environment.BASE_URL}/api/addLandDetails`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          this.toastr.success('Land details added successfully.','Success!',{
            disableTimeOut:false
          });
          return callback && callback(response.json());
        },
        error => {
          console.log(error);
          
          this.toastr.error('Land details not added.','Failed!',{
            disableTimeOut:false
          });
          return callback && callback(error);
        },
        () => {
          console.log("Observable is now completed.");
        });
  }

  getLandDetails(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getLandDetails`;
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

  updateLand(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updateLand`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
      response => {
        this.toastr.success("Land details updated.", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response.json());
      },
      error => {
        this.toastr.error("Land details not updated.", "Failed!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        console.log("Observable is now completed.");
      }
    );
  }
}



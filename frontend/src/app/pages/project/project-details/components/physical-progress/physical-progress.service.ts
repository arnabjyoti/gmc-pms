import { Injectable } from "@angular/core";
import { environment } from "../../../../../../environments/environment";
import { AppService } from "../../../../../app.service";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class PhysicalProgressService {
  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private http: Http
  ) {}
 
  saveProgress = (req: any, callback: any) => {
    const ENDPOINT = `${environment.BASE_URL}/api/saveProgress`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
      response => {
        this.toastr.success("Progress Saved.", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response.json());
      },
      error => {
        this.toastr.error("Progress Not Saved.", "Failed!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        // console.log("Observable is now completed.");
      }
    );
  };

  getProgress = (projectId: any, callback: any) => {
    const ENDPOINT = `${environment.BASE_URL}/api/getProgress/${projectId}`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "get"
    };
    this.http.get(ENDPOINT, requestOptions).subscribe(
      response => {
        // console.log("Success");
        return callback && callback(response.json());
      },
      error => {
        return callback && callback(error);
      },
      () => {
        // console.log("Observable is now completed.");
      }
    );
  };

  getProjectById(projectId: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectById/${projectId}`;
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
      () => {
        console.log("Observable is now completed.");
      }
    );
  };
}

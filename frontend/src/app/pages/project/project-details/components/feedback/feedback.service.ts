import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from "../../../../../../environments/environment";
import { AppService } from "../../../../../app.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class FeedbackService {
  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private http: Http
  ) {}

  saveFeedback = (req: any, callback: any) => {
    const ENDPOINT = `${environment.BASE_URL}/api/saveFeedback`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    console.log(requestOptions);
    this.http.post(ENDPOINT, requestOptions).subscribe(
      response => {
        this.toastr.success("Feedback submitted.", "Success!", {
          disableTimeOut: false
        });
        console.log(callback(response.json()));
        return callback && callback(response.json());
      },
      error => {
        this.toastr.error("Feedback not submitted.", "Failed!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        console.log("Observable is now completed.");
      }
    );
  };


  getFeedbackForProject = (projectId: any, callback: any) => {
    const ENDPOINT = `${environment.BASE_URL}/api/getFeedbackForProject/${projectId}`;
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


  getFeedback = (callback: any) => {
    const ENDPOINT = `${environment.BASE_URL}/api/getFeedback`;
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
        // console.log("Observable is now completed.");
      }
    );
  };
}

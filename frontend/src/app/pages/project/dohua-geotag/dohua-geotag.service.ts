import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from "../../../../environments/environment";
import { AppService } from "../../../app.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class DohuaGeotagService {

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private http: Http
  ) { }

  getDocumentByProjectId(projectId: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getDocumentByProjectId/${projectId}`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "get"
    };
    this.http.get(ENDPOINT, requestOptions).subscribe(
      (response: any) => {
        response = response.json();
        if (response.status) {
          return callback && callback(response.message);
        }
        console.log(response);
      },
      error => {
        return callback && callback(error);
      },
      () => {
        console.log("Observable is now completed.");
      }
    );
  }
  // End
}

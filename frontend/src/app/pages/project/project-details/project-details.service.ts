import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from "../../../../environments/environment";
import { AppService } from "../../../app.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class ProjectDetailsService {
  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private http: Http
  ) {}

  //Start: Method to pull all the projects
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
  }
 
  getProjectDetailsById(projectId: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectDetailsById/${projectId}`;
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
  }

  //Start: Method to update projects
  updateProject(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updateProject`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
      response => {
        this.toastr.success("Project Updated.", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response.json());
      },
      error => {
        this.toastr.error("Project Not Updated.", "Failed!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        console.log("Observable is now completed.");
      }
    );
  }
  // End

  //Start: Method to add projects progress
  addProjectProgress(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/addProgress`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
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
  }
  // End

  //Start: Method to add projects disbursement
  addProjectDisbursement(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/addDisbursement`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
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
  }
  // End

  deleteProgressById(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/deleteProgress`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
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
  }

  deleteDisburseMentById(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/deleteDisbursement`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
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
  }

  getProjectSteps(projectType: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectSteps/${projectType}`;
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
  }

  getProjectTypeById(projectId: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectTypeById/${projectId}`;
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
  }

  getProjectNameById(projectId: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectNameById/${projectId}`;
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
  }
}

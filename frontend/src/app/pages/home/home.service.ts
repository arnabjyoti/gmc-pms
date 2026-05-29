import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { environment } from "../../../environments/environment";
import { AppService } from "../../app.service";

@Injectable({
  providedIn: "root"
})
export class HomeService {
  public accessKeyword:any=null;
  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private http: Http
  ) { 
    let token = JSON.parse(localStorage.getItem('token'));
    this.accessKeyword = token.usr.accessKeyword;
  }
  //init count
  //Start: Method to pull all the projects
  projectCount(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/projectCount`;
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
  // End
  
//Start: Method to pull all the projects
getAllProjectsInit(callback: any) {
  const ENDPOINT = `${environment.BASE_URL}/api/getAllProjectsInit`;
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
// End

  //Start: Method to pull all the projects
  getAllProjects(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getAllProjects`;
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
  // End

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


  //Start: Method to pull all the projects
  getAllProjectsRemaining(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getAllProjectsRemaining`;
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
      () => { }
    );
  }
  // End

  //Start: Method to pull all the projects those are currently in progress
  getOngoingProjects(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getAllOngoing`;
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
  // End

 

  //Start: Method to pull all the projects of ProjectsOfGroup1
  getProjectsOfGroup1(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectsOfGroup1`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post"
    };
    this.http.post(ENDPOINT, req, requestOptions).subscribe(
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

  //Start: Method to pull all the projects of a district
  getProjectByDistrict(district_name: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectsByDistrict/${district_name}`;
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

  //Start: Method to pull all the projects of a district
  getProjectByUlb(req: any, callback: any) {
    console.log("getProjectByUlb", req);
    
    const ENDPOINT = `${environment.BASE_URL}/api/getProjectByUlb`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post"
    };
    this.http.post(ENDPOINT, req, requestOptions).subscribe(
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



  //Start: Method to add projects progress
  updateProjectStatus(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/addProjectStatus`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    console.log(requestOptions);
    this.http.post(ENDPOINT, requestOptions).subscribe(
      response => {
        console.log("Success");
        this.toastr.success("Project Status Updated.", "Success!", {
          disableTimeOut: false
        });
        console.log(callback(response.json()));
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

  addProjectTypeSteps = (req: any, callback: any) => {
    const ENDPOINT = `${environment.BASE_URL}/api/addProjectTypeSteps`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    console.log(requestOptions);
    this.http.post(ENDPOINT, requestOptions).subscribe(
      response => {
        console.log("Success");
        this.toastr.success("Project Steps added.", "Success!", {
          disableTimeOut: false
        });
        console.log(callback(response.json()));
        return callback && callback(response.json());
      },
      error => {
        this.toastr.error("Project Steps not added.", "Failed!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        console.log("Observable is now completed.");
      }
    );
  };

  //Start: Method to add projects progress
  deleteProject(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/deleteProject`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    console.log(requestOptions);
    this.http.post(ENDPOINT, requestOptions).subscribe(
      response => {
        console.log("Success");
        this.toastr.success("Project delete successful.", "Success!", {
          disableTimeOut: false
        });
        console.log(callback(response.json()));
        return callback && callback(response.json());
      },
      error => {
        this.toastr.error("Project not deleted.", "Failed!", {
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

}

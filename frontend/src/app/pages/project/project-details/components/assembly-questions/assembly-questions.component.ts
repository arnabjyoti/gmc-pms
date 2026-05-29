import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/pages/home/home.service';
import { LoginService } from 'src/app/pages/login/login.service';
import { environment } from 'src/environments/environment';
import { ProjectDetailsService } from '../../project-details.service';
import { AssemblyQuestionsService } from './assembly-questions.service';
import { Router, CanActivate } from "@angular/router";
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-assembly-questions',
  templateUrl: './assembly-questions.component.html',
  styleUrls: ['./assembly-questions.component.css']
})
export class AssemblyQuestionsComponent implements OnInit {
  public showingProjects: any;
  public allProjects: any;
  public projectId: any;
  public projectType: any;
  public projectObject: any;
  public projectDetails: any;
  public projectStatus: any;
  public isCitizen: boolean = false;
  public userId: any;
  public role: any;
  public isMla: any = false;
  public isMinister: any = false;
  public isLoading: boolean = true;
  public assemblyData: any;
  public currentAssemblyId: any;
  term: any;
  public permission = {
    projectUpdationPrivilage: false
  };
  public assembly = {
    name: "",
    query: "Enter Your Query",
    answer: "Answer Not Added",
    date: new Date(),
    time: new Date()
  }

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private homeService: HomeService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private projectDetailsService: ProjectDetailsService,
    private assemblyService: AssemblyQuestionsService
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
      this.getProjectName();
      this.getProjectById();
      this.getAccessRightsList();
      this.getAssemblyQuestions();
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.getAllProjects();
    this.getUserDetails() 
  }

  getAllProjects = () => {
    this.homeService.getAllProjects(res => {
      this.isLoading = false;
      if (!res || res === undefined || res === null) {
      } else {
        this.allProjects = this.showingProjects = res;
        console.log("projects", this.showingProjects);

      }
    });
  };

  getUserDetails = () => {
    let user = JSON.parse(localStorage.getItem('token'));
    console.log("localStorage User", user.usr);
    
    if (user) {
      this.userId = user.usr.id;
      this.role = user.usr.role;
      this.assembly.name = user.usr.name;
      console.log("USERRR=", this.role);
      if (user.usr.role === 'mla') {
        this.isMla = true;
      } else if (user.usr.role === 'minister'){
        this.isMinister = true;
      }else{
        this.isCitizen = true;
      }
    }
  };

  getProjectName = () => {
    this.projectDetailsService.getProjectTypeById(this.projectId, response => {
      this.projectType = response.type;
    });
  };

  getProjectById = () => {
    if (this.projectId) {
      this.projectDetailsService.getProjectById(this.projectId, (res: any) => {
        this.projectObject = res;
        this.isLoading = false;
        this.projectType = res.project.type;
        this.projectDetails = this.projectObject["project"];
        this.projectStatus = this.projectObject["status"];
      });
    } else {
      console.log("Oopse!! Something went wrong");
    }
  };

  getAccessRightsList = () => {
    this.permission.projectUpdationPrivilage = this.loginService.return_hasUpdateProjectDetailsRights();
  };

  validateInputs = () => {
    if (this.assembly.name === null || this.assembly.name === "Enter Your Name") {
      this.toastr.warning('Please enter your name.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.assembly.query === null || this.assembly.query === "Enter Your Query") {
      this.toastr.warning('Please enter your query.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    // if (this.assembly.answer == null || this.assembly.answer == ""){
    //   this.toastr.warning('Please enter an answer.', 'Warning', {
    //     disableTimeOut: false
    //   });
    //   return false;
    // }
    // if (this.assembly.date === null || this.assembly.date === "" || this.assembly.date === undefined) {
    //   this.toastr.warning('Please enter a date.', 'Warning', {
    //     disableTimeOut: false
    //   });
    //   return false;
    // }
    // if (this.assembly.time === null || this.assembly.time === "" || this.assembly.time === undefined) {
    //   this.toastr.warning('Please enter a time.', 'Warning', {
    //     disableTimeOut: false
    //   });
    //   return false;
    // }
    return true;
  }

  getAssemblyQuestions = () => {
    this.assemblyService.getAssemblyQuestionsById(this.projectId, res => {
      this.assemblyData = res;
      console.log("GetAssembly==", this.assemblyData);
    })
  }

  saveAssembly = () => {
    let isValid = this.validateInputs();
    if (isValid) {
      console.log("Assembly Details:---", this.assembly);
      const requestObject = {
        name: this.assembly.name,
        projectId: this.projectId,
        query: this.assembly.query,
        answer: this.assembly.answer,
        date: this.assembly.date,
        time: this.assembly.time
      }
      console.log(requestObject);
      this.assemblyService.saveAssemblyQuestions(requestObject, (res: any) => {
        
        if (res.message === "done") {
          this.toastr.success("Query Saved Successfully", "Successful", {
            disableTimeOut: false 
          });
          $(function () {
            $(".left-side > .danger").click();
          });
          this.getAssemblyQuestions();
        } else {
          this.toastr.error("Something went wrong", "Oops", {
            disableTimeOut: false
          });
        }
      })
    }
  }

  getProjectId(id: any){
    this.currentAssemblyId = id
    console.log(this.currentAssemblyId);
    
  }
  addAssemblyQReply = () => {
    let isValid = (this.currentAssemblyId === null && this.currentAssemblyId === undefined && this.assembly.answer === "" && this.assembly.answer=== null)? false:true ;
    console.log(isValid);
    if(isValid) {
      const requestObject = {
        id: this.currentAssemblyId,
        answer: this.assembly.answer
      }
      this.assemblyService.updateAssembly(requestObject, (res: any) => {
        if (res.message === "done") {
          this.toastr.success("Answer Saved Successfully", "Successful", {
            disableTimeOut: false 
          });
          $(function () {
            $(".left-side > .danger").click();
          });
          this.getAssemblyQuestions();
        } else {
          this.toastr.error("Something went wrong", "Oops", {
            disableTimeOut: false
          });
        }
      })
    } 
  }

}

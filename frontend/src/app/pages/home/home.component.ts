import { Component, OnInit } from "@angular/core";
import { LoginService } from "../login/login.service";
import { HomeService } from "./home.service";
import { environment } from "../../../environments/environment";
import { $ } from "protractor";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import CSVExportService from "json2csvexporter";
import { Router, CanActivate } from "@angular/router";
import { DatePipe, CurrencyPipe } from '@angular/common'
import { LocalDataSource } from 'ng2-smart-table';
// import { NgxSpinnerService } from 'ngx-spinner';
import { Pipe, PipeTransform } from '@angular/core';



import {
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  FormBuilder
} from "@angular/forms";
import { AssemblyQuestionsService } from "../project/project-details/components/assembly-questions/assembly-questions.service";
import ulbList from '../project/create-project/ulbList';
import { type } from "os";



@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
  public startIndex: number;
  public endIndex: number;
  public userRole:any;
  public showingProjects: any;
  public tabHeading: string = "All Projects";
  public tabSubHeading: string = "List of all projects till date";
  public isAllProjects: boolean = true;
  public allProjects: any;
  public isCurrentProjects: boolean = false;
  public currentProjects: any;
  public isFinishedProjects: boolean = false;
  public finishedProjects: any;
  public projectEndDate: any;
  public isStatusUpdating: boolean = false;
  public assemblyButtonDisplay: boolean = true;
  public assemblyData: any;
  public isCitizen: boolean = false;
  public isPublic: boolean = false;
  public ulbList: any;
  public municipalBoard:any;
  public isFiltered:boolean = false;
  public assemblyName:any;
  public allFilteredProj: any;
  public filteredProjName: string = "Assam";
  public getulb = {
    district_name:"",
    mb_name:"",
    assembly_name:""
  };
  searchText: any;
  public selectedProject = {
    id: "",
    name: "",
    status: "",
    percentageProgress: "",
    financialProgress: "",
    package_amount: "",
    aa_status: ""
  };
  public testProjectSpeed:any;
  public endpoint: any;
  public projectDetails:any;
  public projectFunds: any;
  public tempstore: any;
  public permission = {
    projectUpdationPrivilage: false,
    projectCeationPrivilage: false,
    addStepsPrivilage: false
  };

  public data:any;
  
  public projectType = "Select Project Type";
  public isLodaing: boolean = true;
  public accessKeyword:any=null;
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private homeService: HomeService,
    private assemblyService: AssemblyQuestionsService,
    public router: Router,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public CurrencyPipe: CurrencyPipe,
  ) {
    this.ulbList = ulbList;
    this.endpoint = environment.BASE_URL;
    this.form = this.fb.group({
      published: true,
      steps: this.fb.array([])
    });
   this.init();
  }
  form: FormGroup;

  addCreds() {
    const stepArray = this.form.controls.steps as FormArray;
    stepArray.push(
      this.fb.group({
        username: "",
        step: ""
      })
    );
  }

  trackByFn(index: any, item: any) {
    return index;
  }


  // clearFilter(){
  //   this.isFiltered = false;
  //   this.showAllProjects();
  //   this.closeProjectFilteringModal();
  // }

  goToFeedback = () => {
    let user = JSON.parse(localStorage.getItem("token"));
    if (user) {
      if (user.usr.role === "citizen") {
        this.router.navigateByUrl("/registration");
      } else {
        this.router.navigateByUrl("/feedback-overall");
      }
    }
  };

  public tabularView(){ 
    let temp=[];
    this.allProjects.map(item => {
      temp.push({
        // id:item.id,
        name: '<a target="_blank" href="/#/project-details/'+item.id+'">'+item.name+'</a>',
         type:item.type,
         division:item.division,
         schemeName:item.scheme_name,
        //  Assigned_To:item.assigned_to,
         aa_number:item["fund_received.aa_status"],
         FSD:this.CurrencyPipe.transform(item["fund_received.fsa"], 'INR'),
         foca:this.CurrencyPipe.transform(item["fund_received.foca"], 'INR'),
         assigned_contractor:item.contractor_name,
         scheme: item.scheme,
         financialProgress : item.financialProgress,
         percentageProgress:item.percentageProgress,
         accessKeyword:item.accessKeyword,
         lastUpdate:this.datepipe.transform(item.updatedAt, 'mediumDate'),         
      })
      this.data = temp;
    });
    console.log("Hi tabularview=======>>>>>",this.data);
  }

  navigateToReg = () => {
    this.router.navigateByUrl("/registration");
  }

 

  settings = {
    actions: false,
    columns: {
      id: {
        title: 'Sl. No.',
        valuePrepareFunction: (value, row, cell) => {
          return cell.row.index + 1;
         },
         filter: false,
      },
      name: {
        title: 'Project Name',
        type: 'html',
      },
      schemeName : {
        title: 'Scheme Name'
      },
      type: {
        title: 'Project Type',
        filter:{
          type: 'list',
          config: {
            selectText: 'All',
            list: [
              {value: 'Construction', title: 'Construction'},
              {value: 'Land Development', title: 'Land Development'},
              {value: 'Industrial Shed', title: 'Industrial Shed'},
              {value: 'Road', title: 'Road'},
              {value: 'IT Hardware Work', title: 'IT Hardware Work'},
              {value: 'IT Software Work', title: 'IT Software Work'},
              {value: 'Assam Startup (Nest)', title: 'Assam Startup (Nest)'},
              {value: 'Others', title: 'Others'},
            ]
          }
        }
      },
      
      scheme : {
        title: 'Source of Fund',
        filter:{
          type: 'list',
          config: {
            selectText: 'All',
            list: [
              {value: 'Centrally Sponsored Scheme', title: 'Centrally Sponsored Scheme'},
              {value: 'State Government Funded Scheme', title: 'State Government Funded Scheme'},
              {value: 'Other Agencies', title: 'Other Agencies'},
              {value: 'Own Fund', title: 'Own Fund'},
            ]
          }
        }
      },
      aa_number:{
        title: 'Administrative Approval Details'
      },
      
      assigned_contractor: {
        title: 'Contractor Details'
      },
      FSD: {
        title: 'Financial Sanction Details (In Rs.)'
      },
      foca: {
        title: 'Fixation of Ceiling Details (In Rs.)'
      },
      percentageProgress: {
        title: 'Physical Progress (%)'
      },
      financialProgress : {
        title: 'Financial Progress'
      },
      accessKeyword: {
        title: 'Project Entered By',
        filter:{
          type: 'list',
          config: {
            selectText: 'All',
            list: [
              {value: 'Chinmoy Prakash Phookan, MD', title: 'Chinmoy Prakash Phookan, MD'},
              {value: 'Ritumoni Pachani, GM', title: 'Ritumoni Pachani, GM'},
              {value: 'Pulak Jyoti Das, DGM (C & F)', title: 'Pulak Jyoti Das, DGM (C & F)'},
              {value: 'Anuj P. Sarmah, DGM(PM)', title: 'Anuj P. Sarmah, DGM(PM)'},
              {value: 'Deepak Kalita, Manager (E)', title: 'Deepak Kalita, Manager (E)'},
              {value: 'Victor Bashiya, DM(C)', title: 'Victor Bashiya, DM(C)'},
              {value: 'Rajib Kr. Saikia, AM(C)', title: 'Rajib Kr. Saikia, AM(C)'},
              {value: 'Poran Kr. Bora, AM(C)', title: 'Poran Kr. Bora, AM(C)'},
              {value: 'Apurba Kr. Kalita, AM(C)', title: 'Apurba Kr. Kalita, AM(C)'},
              {value: 'Rajiv Saikia, AE(C)',	title: 'Rajiv Saikia, AE(C)'},
              {value: 'Dhurba Jyoti Bora, AE(C)',	title: 'Dhurba Jyoti Bora, AE(C)'},
            ],
          },
      }
    },
    lastUpdate : {
      title: 'Last Updated'
    },
  },
  attr: {
    class: 'table table-bordered'
  },
  };
  
  




  
//load the value during fetching the component
  init = () =>{
    let token = JSON.parse(localStorage.getItem('token'));
    if(!token.usr.accessKeyword){
      return;
    }
    
    this.getAllProjects();
    // this.getOngoingProjects();
    this.getAccessRightsList();
    this.getAssembly();   
  }
  ngOnInit(): void {
    this.getUserDetails();
    this.getCache();
    // this.checkUser();
    this.loadExternalScript('https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js');
    this.setEndIndex();
  }

  setEndIndex(){
    
    this.endIndex = this.allProjects.length;
    console.log("Function called ---> ",this.endIndex);
  }

  public loadExternalScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

   
  getUserDetails = () =>{
    let token = localStorage.getItem('token');
    token = JSON.parse(token);
    if(token){
      this.userRole = token['usr'];
  }
}
 

  onScroll = () => {
    console.log("SCROLL");
  };
  getCache = async () => {
    const newCache = await caches.open("new-cache");
    const response = await newCache.match("yes");
  };

  navigateAndPrint = projectId => {
    console.log(projectId);
    this.homeService.getProjectDetailsById(projectId, res => {
      console.log("Res==", res);
      this.isLodaing = false;
      if (!res || res === undefined || res === null) {
        return;
      } else {
        this.projectDetails = res.project;
        this.projectFunds = res.fund[0];
        // this.projectFunds.aa_date
        console.log("BBBBB ProjectDetails=", this.projectDetails);
        
        console.log("BBBBB projectFunds=", this.projectFunds);
        let data = []
        let obj1 =[ 
          {
            "Project Name": this.projectDetails.name,
            "CONTRACTOR NAME (Consultancy Service)": this.projectDetails.contractor_name_cs,
            "CONTRACTOR NAME": this.projectDetails.contractor_name,
            "CONTRACTOR CONTACT (Consultancy Service)": this.projectDetails.contractor_phone_cs,
            "CONTRACTOR CONTACT": this.projectDetails.contractor_phone,
            "ESTIMATED COST IN RS.": this.projectDetails.initial_amount,
            "TECHNICAL APPROVAL": this.projectDetails.technical_approval,
            "ADMINISTRATIVE APPROVAL": this.projectDetails.aa_status,
            "TENDER AMOUNT (Consultancy Service)": this.projectDetails.tender_amount_cs,
            "TENDER AMOUNT": this.projectDetails.tender_amount,
            "FINANCIAL SANCTION NUMBER (Consultancy Service)": this.projectDetails.fsn_cs,
            "FINANCIAL SANCTION NUMBER": this.projectDetails.fsn,
            "FINANCIAL SANCTION DATE (Consultancy Service)": this.projectDetails.fsd_cs,
            "FINANCIAL SANCTION DATE": this.projectDetails.fsd,
            "FINANCIAL SANCTION AMOUNT (Consultancy Service)": this.projectDetails.fsa_cs,
            "FINANCIAL SANCTION AMOUNT": this.projectDetails.fsa,
            "FIXED ORDER CEILING NUMBER (Consultancy Service)": this.projectDetails.focn_cs,
            "FIXED ORDER CEILING NUMBER": this.projectDetails.focn,
            "FIXED ORDER CEILING DATE (Consultancy Service)": this.projectDetails.focd_cs,
            "FIXED ORDER CEILING DATE": this.projectDetails.focd,
            "FIXED ORDER CEILING AMOUNT (Consultancy Service)": this.projectDetails.foca_cs,
            "FIXED ORDER CEILING AMOUNT": this.projectDetails.foca,
            "WORK ORDER NUMBER (Consultancy Service)": this.projectDetails.wo_no_cs,
            "WORK ORDER NUMBER": this.projectDetails.wo_no,
            "WORK ORDER DATE (Consultancy Service)": this.projectDetails.wo_date_cs,
            "WORK ORDER DATE": this.projectDetails.wo_date,
            "WORK ORDER AMOUNT (Consultancy Service)": this.projectDetails.wo_amount_cs,
            "WORK ORDER AMOUNT": this.projectDetails.wo_amount,
            "ACTUAL START DATE (Consultancy Service)": this.datepipe.transform(this.projectDetails.actual_start_cs, 'dd/MM/yyyy'),
            "ACTUAL START DATE": this.datepipe.transform(this.projectDetails.actual_start, 'dd/MM/yyyy'),
            "PLANNED END DATE (Consultancy Service)": this.datepipe.transform(this.projectDetails.actual_end_cs, 'dd/MM/yyyy'),
            "PLANNED END DATE": this.datepipe.transform(this.projectDetails.actual_end, 'dd/MM/yyyy'),
            "PERCENTAGE PROGRESS (Consultancy Service)": this.projectDetails.percentageProgressCs,
            "PERCENTAGE PROGRESS": this.projectDetails.percentageProgress,
            "FINANCIAL PROGRESS (Consultancy Service)": this.projectDetails.financialProgressCs,
            "FINANCIAL PROGRESS": this.projectDetails.financialProgress,
            "FILE NUMBER": this.projectDetails.fileNo,
            "PROJECT DESCRIPTION": this.projectDetails.description,
            "PROJECT TYPE": this.projectDetails.scheme,
            "PROJECT STATUS": this.projectDetails.status,
          },
        ]
          data.push(obj1);
        let obj2 = 
          {"Project ID": this.projectDetails.type}
        
        data.push(obj1);
        console.log("ggggggggggggg",obj1);
        console.log("vvvvvvvvvvvvvvvvvvvvvvv",data);
        const exporter = CSVExportService.create();
        exporter.downloadCSV(obj1);
      };
      
      
    });
  };

  download = () => {
    console.log("Download Function called");
    let data = [];
    let approvalCount=0;
    let AA_AwaitedCount=0;
    let Not_Applicable=0;
    let appliedCount=0;
    let ongoingCount=0;
    let completedCount=0;
    this.showingProjects.map(item => {
      console.log(item);
      
      if(item.status=='Ongoing'){
        ongoingCount++;
      }
      if(item.status=='Completed'){
        completedCount++;
      }
      let obj = {



        "Project Name": item.name,
        "Project Type": item.type,
        "Scheme Name": item.scheme_name,
        "Source of Fund": item.scheme,
        "Assigned Contractor": item.contractor_name,
        "Contractor Phone": item.contractor_phone,
        "Start Date": this.datepipe.transform(item.actual_start, 'mediumDate'), 
        "Administrative Approval Details": item["fund_received.aa_status"],
        // "End Date": item.actual_end,
        // "Initial Amount": item.initial_amount,
        "Financial Sanction Details": item["fund_received.fsa"],
         "Fixation of Ceiling Details": item["fund_received.foca"],
        "Physical Progress": item.percentageProgress,
        "Financial Progress": item.financialProgress,
        "Project Entered by": item.accessKeyword,
        "Status": item.status
      };
      data.push(obj);

    });
    let obj1 = {
      "Project Name": "",
    }
    data.push(obj1); 


      let obj5 = {
        "Project Name": "",
      }
      data.push(obj5); 
  
        let obj6 = {
          "Project Name": "Total Ongoing="+ongoingCount,
        }
        data.push(obj6);

        let obj7 = {
          "Project Name": "Total Completed="+completedCount,
        }
        data.push(obj7);
    
    const exporter = CSVExportService.create();
    exporter.downloadCSV(data);
  };


  getAllProjectsInit = () => {
    this.homeService.getAllProjectsInit(res => {
      this.isLodaing = false;
      if (!res || res === undefined || res === null) {
        //do something
      } else {
        
        this.allProjects = res;
        console.log("All projects details init checking=", this.allProjects);
        this.projectFilterization();
        this.showAllProjects();
        this.tabularView();
        this.getAllProjects();

      }
    });
  };




  getAllProjects = () => {
    this.homeService.getAllProjects(res => {
      this.isLodaing = false;
      if (!res || res === undefined || res === null) {
        //do something
      } else {
        this.testProjectSpeed = res;
        this.allProjects = res, this.testProjectSpeed;
        console.log("All projects details checking=", this.allProjects);
        this.projectFilterization();
        this.showAllProjects();
        this.tabularView();
      }
    });
  };

  getAssembly = () => {
    this.assemblyService.getAssemblyQuestions(res => {
      this.isLodaing = false;
      if (!res || res === undefined || res === null) {
        //do something
      } else {
        this.assemblyData = res;
        console.log("assembly response", this.assemblyData);
      }
    })
  }

  projectFilterization = () => {
    let cProj = [];
    let fProj = [];
    this.allProjects.map(item => {
      if (item.status === "Ongoing") {
        cProj.push(item);
      }
      if (item.status === "Completed") {
        fProj.push(item);
      }
    });
    this.currentProjects = cProj;
    this.finishedProjects = fProj;
    // this.showCurrentProjects();
  };

  added = val => {
    console.log(val);
    this.getAllProjects();
  };

  showAllProjects = () => {
    
    if(this.isFiltered === true){
      let allProj = [];
      console.log("I'm all project filtered");
      this.allFilteredProj.map(item => {
        allProj.push(item);
      });
      
      this.tabHeading = "All Projects";
      this.tabSubHeading = "List of all projects till date";
      //  (" +this.filteredProjName+")";
      this.isAllProjects = true;
      this.showingProjects=allProj;
      this.isCurrentProjects = false;
      this.isFinishedProjects = false;
      this.startIndex = 0;
      this.endIndex = 20;
      

    }else{
    console.log("Inside else conditionnnnnnnnnnnn");    

    this.tabHeading = "All Projects";
    this.tabSubHeading = "List of all projects till date";
    //  (" +this.filteredProjName+")";
    this.isAllProjects = true;
    this.isCurrentProjects = false;
    this.isFinishedProjects = false;
    this.showingProjects = this.allProjects;
    this.startIndex = 0;
    this.endIndex = 20;
    }
  };

  showCurrentProjects = () => {
    console.log("Current project function called");
    
    
    if(this.isFiltered === true){
    let cProj = [];
    this.showingProjects = this.allFilteredProj;
    console.log("Function called to get ==>",this.showingProjects);
    this.showingProjects.map(item => {
      if (item.status === "Ongoing") {
        cProj.push(item);
      }
    });
    this.tabHeading = "Current Projects";
    this.tabSubHeading = "List of all projects currently in progress"; 
    // (" +this.filteredProjName+")";
    this.isAllProjects = false;
    this.isCurrentProjects = true;
    this.isFinishedProjects = false;
    this.showingProjects = cProj;
    this.startIndex = 0;
    this.endIndex = 20;
    }else{
    console.log("Inside else conditionnnnnnnnnnnn");    
    // this.sortCurrentProjects();
    this.tabHeading = "Current Projects";
    this.tabSubHeading = "List of all projects currently in progress";
    // (" +this.filteredProjName+")";
    this.isAllProjects = false;
    this.isCurrentProjects = true;
    console.log("current projectsnnn=", this.currentProjects);
    this.isFinishedProjects = false;
    this.showingProjects = this.currentProjects;
    this.startIndex = 0;
    this.endIndex = 20;
    }
  };

  showFinishedProjects = () => {
    console.log("Finished Project Called !!!!");   
    if(this.isFiltered === true){
      let fProj = [];
      this.showingProjects = this.allFilteredProj;
      this.showingProjects.map(item => {
        if (item.status === "Completed") {
          fProj.push(item);
        }
      });
      this.tabHeading = "Finished Projects";
      this.tabSubHeading = "List of all completed projects till date";
      // (" +this.filteredProjName+")";
      this.isAllProjects = false;
      this.isCurrentProjects = false;
      this.isFinishedProjects = true;
      this.showingProjects = fProj;
      this.startIndex = 0;
      this.endIndex = 20;
      
    }else{
    console.log("Inside else conditionnnnnnnnnnnn");    
    this.tabHeading = "Finished Projects";
    this.tabSubHeading = "List of all completed projects till date";
    // (" +this.filteredProjName+")";
    this.isAllProjects = false;
    this.isCurrentProjects = false;
    this.isFinishedProjects = true;
    this.showingProjects = this.finishedProjects;
    this.startIndex = 0;
    this.endIndex = 20;
    }
  };
  
     
  
 

  

  showStatusModal = project => {
    console.log("Selected Project=", project);
    this.selectedProject = project;
    let statusModal = document.getElementById("projectStatus");
    statusModal.classList.remove("hidden");
    statusModal.classList.add("show");
  };

  showProjectDeleteModal = project => {
    console.log("Selected Project=", project);
    this.selectedProject = project;
    let deleteModal = document.getElementById("projectDelete");
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("show");
  };

  deleteProject = () => {
    const requestObject = {
      projectID: this.selectedProject.id,
    }
    console.log("dddddddddd",requestObject);

    this.homeService.deleteProject(requestObject, (res: any) => {
      this.getAllProjects();
      let deleteModal = document.getElementById("projectDelete");
        deleteModal.classList.add("hidden");
        deleteModal.classList.remove("show");
    });
    
    // console.log("Delete functionality is not done");
  };

  // Start: Method to update project status
  updateProjectStatus = () => {
    this.isStatusUpdating = true;
    let userData = JSON.parse(localStorage.getItem("token")).usr;
    console.log(
      "Updating status",
      this.projectEndDate,
      this.selectedProject.id
    );
    console.log("try",this.selectedProject.status);
    
    if (
      this.selectedProject.id === "" ||
      this.selectedProject.id === null ||
      this.selectedProject.id === undefined
    ) {
      this.toastr.warning("Something went wrong. Please try again", "Warning", {
        disableTimeOut: false
      });
      return false;
    }
    
    if (
      this.projectEndDate === "" ||
      this.projectEndDate === null ||
      this.projectEndDate === undefined
    ) {
      this.toastr.warning(
        "You must provide project completion date",
        "Warning",
        {
          disableTimeOut: false
        }
      );
      return false;
    }
    const requestObject = {
      project_id: this.selectedProject.id,
      status: "Completed",
      actual_end: this.projectEndDate,
      date_updated: moment().toDate(),
      user_updated: userData.id,
      active: 1
    };
    this.homeService.updateProjectStatus(requestObject, (res: any) => {
      if (res) {
        this.isStatusUpdating = false;
        this.getAllProjects();
        this.showFinishedProjects();
        let statusModal = document.getElementById("projectStatus");
        statusModal.classList.add("hidden");
        statusModal.classList.remove("show");
      } else {
        this.toastr.warning(
          "Something went wrong. Please try again",
          "Warning",
          {
            disableTimeOut: false
          }
        );
        this.isStatusUpdating = false;
      }
    });
  };
  // End

  goToKMLRepresentation = () => {
    this.router.navigate(["/home-public"]);
  };

  goToLandDetails = () => {
    this.router.navigate(["/land-details"]);
  }

  searchProjects = () =>{
    console.log("searchText=",this.searchText);
  }

  getAccessRightsList = () => {
    this.permission.projectCeationPrivilage = this.loginService.return_HasCreateProjectRights();
    this.permission.projectUpdationPrivilage = this.loginService.return_hasUpdateProjectDetailsRights();
    this.permission.addStepsPrivilage = this.loginService.return_HasAddStepsRight();
  };

  // //
  // getAllProjectsNew = () => {
  //   this.homeService.getAllProjectsNew(res => {
  //     this.isLodaing = false;
  //     if (!res || res === undefined || res === null) {
  //       //do something
  //     } else {
  //       this.allProjects = this.showingProjects = this.currentProjects = res;
        
  //       this.tempstore = this.allProjects;
  //       this.projectFilterization();
  //       this.showCurrentProjects();
        
  //     }
  //   });
  // };


  //Needed to check with Utpal Sir later---If issue occurs.
  // sortCurrentProjects = () =>{
  //   this.currentProjects.sort(function compare(a, b) {
  //     var dateA:any = new Date(a.createdAt);
  //     var dateB:any = new Date(b.createdAt);
  //     return dateA - dateB;
  //   });
  //   this.currentProjects.reverse();
  // }

  // getAllProjectsRemaining = () => {
  //   this.homeService.getAllProjectsRemaining(res => {
  //     this.isLodaing = false;
  //     if (!res || res === undefined || res === null) {
  //       //do something
  //     } else {
  //       res.map(item => {
  //         this.allProjects.push(item);
  //       });
  //       this.showingProjects = this.allProjects;
  //       this.tempstore = this.allProjects;
  //       this.projectFilterization();
  //     }
  //   });
  // };

   // addSteps = () => {
  //   let projectTypeSteps = [];
  //   if (
  //     this.projectType != "Select Project Type" &&
  //     this.form.value.steps.length > 0
  //   ) {
  //     this.form.value.steps.map((step, index) => {
  //       let data = {
  //         project_type: this.projectType,
  //         steps: step.step,
  //         order_no: index + 1
  //       };
  //       projectTypeSteps.push(data);
  //     });
  //     console.log(projectTypeSteps);
  //     this.homeService.addProjectTypeSteps(projectTypeSteps, response => [
  //       console.log(response)
  //     ]);
  //   }
  // };

  

  //  closeRightMenu = () => { 
  //   document.getElementsByClassName("col-xl-8 col-lg-8 col-md-7 col-sm-7 col-12")[0].className = "col-xl-10 col-lg-10 col-md-9 col-sm-9 col-12";
  //   document.getElementsByClassName("col-xl-2 col-lg-2 col-md-2 col-sm-2")[0].className = "d-none";
  //   this.assemblyButtonDisplay = true;
  // }

  //  openRightMenu = () => {
  //   document.getElementsByClassName("col-xl-10 col-lg-10 col-md-9 col-sm-9 col-12")[0].className = "col-xl-8 col-lg-8 col-md-7 col-sm-7 col-12";
  //   document.getElementsByClassName("d-none")[0].className = "col-xl-2 col-lg-2 col-md-2 col-sm-2";
  //   this.assemblyButtonDisplay = false;
  // }

  //Start: Method to pull all the projects those are currently in progress
  // getOngoingProjects = () =>{
  //     this.homeService.getOngoingProjects(res=>{
  //       this.currentProjects = res;
  //       console.log("OngoingProjects===",res);
  //     });
  // }
  // End

  //Start: Method to pull all the projects those are completed
  // getCompletedProjects = () => {
  //   this.homeService.getCompletedProjects((res) => {
  //     this.finishedProjects = res;
  //     console.log("Completed Projects=",res);
  //   });
  // }
  // End
  // selectedProjectGroup:any=null;
  // setRadioValue = (radioValue) =>{
  //  this.selectedProjectGroup = radioValue;
  // }



  //code to filter 
  // filterProjects = () =>{
    


  //   console.log("Filtered called with the values =====>>> ", this.getulb.assembly_name, this.getulb.mb_name, this.getulb.district_name);
    
  //   this.isFiltered =true;
  //   if(!this.selectedProjectGroup){
  //     this.toastr.warning(
  //       "Oops! Something went wrong. Please try again",
  //       "Warning",
  //       {
  //         disableTimeOut: false
  //       }
  //     );
  //     return;
  //   }
  //   switch(this.selectedProjectGroup){
  //     case 'projectGroup1':
  //       this.findProjectsOfGroup1();
  //       break;
  //     case 'projectGroup2':
  //       this.findProjectsOfGroup2();
  //       break;
  //   }
  // }

  // instanceOfProjectGroup1:any="";
  // findProjectsOfGroup1 = () => {
  //   if(!this.instanceOfProjectGroup1){
  //     this.toastr.warning(
  //       "Please select one option from the dropdown",
  //       "Warning",
  //       {
  //         disableTimeOut: false
  //       }
  //     );
  //     return;
  //   }
  //   //  let requestObject = {
  //   //   projectGroup: this.selectedProjectGroup,
  //   //   instanceOfProjectGroup1: this.instanceOfProjectGroup1
  //   //   }
  //   //   console.log("REQ==",requestObject);
  //     let cProj = [];
  //     this.allProjects.map(item => {
  //       if (item.accessKeyword === this.instanceOfProjectGroup1) {
  //         cProj.push(item);
  //       }
  //     });
  //     this.showingProjects = cProj;
  //     this.allFilteredProj = this.showingProjects,
  //     this.closeProjectFilteringModal(),
  //     this.isAllProjects = true,
  //     this.isCurrentProjects = false,
  //     this.isFinishedProjects = false,
  //     this.filteredProjName = this.instanceOfProjectGroup1,
  //     this.showAllProjects()
  // }

  // findProjectsOfGroup2 = () => {
  //   this.isFiltered =true;

  //   console.log("Type of mb_name ", typeof(this.getulb.mb_name));

  //   //checking mb_name is selected 
  //   if(typeof(this.getulb.mb_name) !== "string"){
  //     console.log("Inside mb if condition");
  //     this.toastr.warning(
  //       "Please select Municipalty Board of your choice",
  //       "Warning",
  //       {
  //         disableTimeOut: false
  //       }
  //     );
  //     return;
  //   }

  //   //checking for district name is selected
  //   if(!this.getulb.district_name){
  //     console.log("Inside district if condition");
  //     this.toastr.warning(
  //       "Please select district of your choice",
  //       "Warning",
  //       {
  //         disableTimeOut: false
  //       }
  //     );
  //     return;
  //   }
  //   //when mb is not selected
  //     let cProj = [];
  //     this.allProjects.map(item => {
  //       if (item.mb_name === this.getulb.mb_name && item.district_name === this.getulb.district_name) {
  //         cProj.push(item);
  //       }
  //     });
  //       this.showingProjects = cProj;
  //       this.isAllProjects = true;
  //       this.isCurrentProjects = false;
  //       this.isFinishedProjects = false;
  //       this.allFilteredProj = this.showingProjects;
  //       this.filteredProjName =  this.getulb.mb_name;
  //       this.closeProjectFilteringModal();
  //       this.showAllProjects();    
  // }

  // closeProjectFilteringModal = () =>{
  //   let filteringModal = document.getElementById("closeProjectFilter");
  //   filteringModal.click();
  //   // filteringModal.classList.remove("show");
  //   // filteringModal.classList.add("hidden");
  // }



}

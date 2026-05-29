import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../../app.service";
import { LoginService } from "../../login/login.service";
import { ProjectDetailsService } from "./project-details.service";
import { environment } from "../../../../environments/environment";
import { ToastrService, ToastrModule } from 'ngx-toastr';
import * as moment from "moment";
import * as _ from "underscore";
import * as $ from "jquery";
@Component({
  selector: "app-project-details",
  templateUrl: "./project-details.component.html",
  styleUrls: ["./project-details.component.css"],
  providers: [ProjectDetailsService]
})
export class ProjectDetailsComponent implements OnInit {
  today: Date;
  public projectId: any;
  public user:any;
  butDisabled: boolean = true;
  public projectDetails:any = {
    id: "",
    name: "",
    package_no: "",
    initial_amount: "",
    profilePhoto: "",
    contractor_name_cs: "",
    contractor_name: "",
    contractor_phone:"",
    contractor_phone_cs:"",
    type: "",
    scheme_name: "",
    district: "",
    description: "",
    remarks: "",
    tender_amount_cs: "",
    tender_amount: "",
    wo_no_cs: "",
    wo_no: "",
    wo_date_cs: "",
    wo_date: "",
    wo_amount_cs: "",
    wo_amount: "",
    actual_start:"",
    actual_end:"",
    percentageProgress: "",
    percentageProgressCs: "",
    financialProgress: "",
    financialProgressCs: "",
    fileNo: "",
    aa_status:"",
    accessKeyword:"",
    completion_date: "",
  };
  public projectFunds = {
    aa_date: "",
    aa_amount: "",
    aa_number: ""
  };
  projectType:any;
  public endpoint: any;
  public engineers: any;
  public contractors: any;
  public now: Date = new Date();
  public permission = {
    projectUpdationPrivilage: false,
    addStepsPrivilage: false
  };
  public isLodaing: boolean = true;
  constructor(
    private appService: AppService,
    private loginService: LoginService,
    private projectDetailsService: ProjectDetailsService,
    private route: ActivatedRoute,
    private toastr:ToastrService,
  ) {
    this.endpoint = environment.BASE_URL;
    this.today = new Date();
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
      this.getProjectDetailsById();
      this.getAccessRightsList();
      this.getEngineers();
    });
  }

  ngOnInit(): void {
    // this.getProjectById();
    this.getUserDetails();
  }

  getUserDetails = () =>{
    let token = localStorage.getItem('token');
    token = JSON.parse(token);
    if(token){
      this.user = token['usr'];
      // console.log("usr name=", this.user.role);
    }else{
      console.log("Token not");
    }
    // console.log("I AM CITIZEN",this.user);
  }

  getProjectById = () => {
    this.projectDetailsService.getProjectById(this.projectId, res => {
      console.log("ResDetails==", res);
      this.isLodaing = false;
      if (!res || res === undefined || res === null) {
        // do something
      } else {
        this.projectDetails = res.project;
        this.projectFunds = res.fund[0];
        // this.projectFunds.aa_date
        console.log("AAAAA ProjectDetails=", this.projectDetails);
        console.log("AAAAA projectFunds=", this.projectFunds);
      }
    });
  };

  getProjectDetailsById = () => {
    this.projectDetailsService.getProjectDetailsById(this.projectId, res => {
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
        if(this.projectDetails.type=="Construction"){
          this.projectType="Construction";
        }else if(this.projectDetails.type=="Land Development"){
          this.projectType="Land Development";
        }else if(this.projectDetails.type=="Industrial Shed"){
          this.projectType="Industrial Shed";
        }else if(this.projectDetails.type=="Road"){
          this.projectType="Road";
        }else if(this.projectDetails.type=="IT Hardware Work"){
          this.projectType="IT Hardware Work";
        }else if(this.projectDetails.type=="IT Software Work"){
          this.projectType="IT Software Work";
        }else if(this.projectDetails.type=="Assam Startup (Nest)"){
          this.projectType="Assam Startup (Nest)"
        }else if(this.projectDetails.type=="Others"){
          this.projectType="Others";
        }
      }
    });
    
  };

  navToGMCGeoTag = () => {
    window.open(
      "https://gmcgeotag.in/#/pages/project_details/" +
        this.projectDetails.id +
        "/Completed"
    );
  };

  //Start
  getEngineers = () => {
    this.appService.getEngineers(res => {
      let contractorData = [];
      let engineerData = [];

      res.map(item => {
        if (item.role == "contractor") {
          let contData = {
            role: item.role,
            name: item.name
          };
          contractorData.push(contData);
        } else {
          let data = {
            role: item.role,
            name: item.name
          };
          engineerData.push(data);
        }
      });
      this.engineers = engineerData;
      this.contractors = contractorData;
    });
  };
  //End

  formatDate = date => {
    var momentObj = moment(date, "DD-MM-YYYY");
    var momentString = momentObj.format("YYYY-MM-DD");
    return momentObj;
  };

  formatCurrency = currency => {
    const filtered = currency.replace(/,/g, "");
    const raw = parseFloat(filtered.replace(/₹/g, ""));
    return raw;
  };

  validateInputs = () =>{
    if(this.projectDetails.percentageProgress > 100 || this.projectDetails.percentageProgress < 0){
      this.toastr.warning('Percentage progress must be between 0 and 100.','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.projectDetails.scheme == "State Government Funded Scheme"){
      if(this.projectDetails.percentageProgressCs > 100 || this.projectDetails.percentageProgressCs < 0){
        this.toastr.warning('Percentage progress must be between 0 and 100.','Warning',{
          disableTimeOut:false
        });
        return false;
      }
    }
    // if(this.projectDetails.financialProgress > 100 || this.projectDetails.financialProgress < 0){
    //   this.toastr.warning('Financial Progress must be between 0 and 100.','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    // if(this.projectDetails.contractor_phone > 99999999999 || this.projectDetails.contractor_phone < 1000000000){
    //   this.toastr.warning('Phone Number must be 10 digit.','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    return true;
  };

  updateProjectDetails = () => {
    this.now = new Date();

    console.log("jjjjjjjjjj",this.projectDetails);
    

    const requestObject = {
      projectID: this.projectDetails.id,
      projectTitle: this.projectDetails.name,
      scheme_name: this.projectDetails.scheme_name,
      district: this.projectDetails.district,
      contractor_name: this.projectDetails.contractor_name,
      contractor_name_cs: this.projectDetails.contractor_name_cs,
      contractor_phone: this.projectDetails.contractor_phone,
      contractor_phone_cs: this.projectDetails.contractor_phone_cs,
      wo_date: moment(this.projectDetails.wo_date).format('YYYY-MM-DD HH:mm:ss'),
      wo_date_cs: moment(this.projectDetails.wo_date_cs).format('YYYY-MM-DD HH:mm:ss'),
      wo_amount: this.projectDetails.wo_amount,
      wo_amount_cs: this.projectDetails.wo_amount_cs,
      wo_no: this.projectDetails.wo_no,
      wo_no_cs: this.projectDetails.wo_no_cs,
      aa_amount: this.projectFunds.aa_amount,
      aa_number: this.projectFunds.aa_number,
      projectDescription: this.projectDetails.description,
      remarks: this.projectDetails.remarks,
      projectPlannedCost: this.projectDetails.initial_amount,
      tender_amount: this.projectDetails.tender_amount,
      tender_amount_cs: this.projectDetails.tender_amount_cs,
      // projectActualStartDate: moment(this.projectFunds.aa_date).format('YYYY-MM-DD HH:mm:ss'),
      percentageProgress: this.projectDetails.percentageProgress,
      percentageProgressCs: this.projectDetails.percentageProgressCs,
      financialProgress: this.projectDetails.financialProgress,
      financialProgressCs: this.projectDetails.financialProgressCs,
      fileNo: this.projectDetails.fileNo,
      aa_status: this.projectDetails.aa_status,
      completion_date: this.projectDetails.completion_date,
      // projectActualEndDate: null,
      projectUpdatedAt: this.now
    };
    console.log("mmmmmmmmmmmm",requestObject);

    
    let isValid = this.validateInputs();
    if(isValid){
    this.projectDetailsService.updateProject(requestObject, (res: any) => {
      $(function() {
        $(".left-side > .danger").click();
      });
      this.getProjectDetailsById();
    });
  }
  };

  // parseDate = dt => {
  //   this.projectFunds.aa_date = dt;
  // };

  parseWoDate = dt => {
    this.projectDetails.wo_date = dt;
  };
  parseWoCsDate = dt => {
    this.projectDetails.wo_date_cs = dt;
  };
  parseWoComplDate = dt => {
    this.projectDetails.completion_date = dt;
  };

  getAccessRightsList = () => {
    this.permission.projectUpdationPrivilage = this.loginService.return_hasUpdateProjectDetailsRights();
    console.log("Permissionsss=====", this.permission);
    this.permission.addStepsPrivilage = this.loginService.return_HasAddStepsRight();
  };
}

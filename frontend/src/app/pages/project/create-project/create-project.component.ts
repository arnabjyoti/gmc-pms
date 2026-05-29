import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {CreateProjectService} from './create-project.service';
import {AppService} from '../../../app.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import * as $ from 'jquery';
import ulbList from './ulbList';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  providers:[CreateProjectService]
})
export class CreateProjectComponent implements OnInit {
  public userRole:any;
  public milestoneDates:any=[];
  public projectDetails:any={
    code: null,
    type: "",
    name: '',
    contractor_cs: '',
    contractor: '',
    contractorPhoneCs:'',
    contractorPhone:'',
    initial_amount:'',
    scheme:'Select Source of Fund',
    district: 'Select District',
    other_scheme:'',
    aa_status:'',
    tender_amount_cs:'',
    tender_amount:'',
    technical_approval:'',
    aa_amount: '',
    total_disbursed_amount: null,
    description:'',
    avatar: '/assets/images/camera1.jpg',
    status: 'Ongoing',
    wo_date_cs: null,
    wo_date: null,
    wo_number_cs: '',
    wo_number: '',
    wo_amount_cs:'',
    wo_amount:'',
    actual_start_cs:'',
    actual_start:'',
    actual_end_cs: null,
    actual_end: null,
    accessKeyword:null,
    avail_status: '1',
  };
  public projectFunds:any;
  public engineers: any=[];
  public contractors: any=[];
  public milestones: any=[];
  public isMilestoneExist: boolean=false;
  public isSaving:boolean = false;
  @Output() added = new EventEmitter<any>();

  constructor(
    private appService:AppService,
    private toastr:ToastrService,
    private createProjectService:CreateProjectService
    )
     {
      let token = JSON.parse(localStorage.getItem('token'));
      this.projectDetails.accessKeyword = token.usr.accessKeyword;
      console.log("Project Details in Create Project Constructore ==================>>>",this.projectDetails);
      
     }

  ngOnInit(): void {
    this.getUserDetails();
    this.getEngineers();
  }

  //Start
  getEngineers = () => {
    this.appService.getEngineers((res) => {
      let contractorData = [];
      let engineerData = [];

      res.map(item => {
        if (item.role == "contractor") {
          let contData = {
            role: item.role,
            name: item.name
          }
          contractorData.push(contData);
        } else {
          let data = {
            role: item.role,
            name: item.name
          }
          engineerData.push(data);
        }
      });
      this.engineers = engineerData;
      this.contractors = contractorData;
    });
  }
  //End 

  getUserDetails = () =>{
    let token = localStorage.getItem('token');
    token = JSON.parse(token);
    if(token){
      this.userRole = token['usr'];
  }
}

 

validateInputs = () =>{
  console.log("Saving project before validate",this.projectDetails);
  if(this.projectDetails.name==='' || this.projectDetails.type===null || this.projectDetails.type===undefined){
    this.toastr.warning('Please type a project name.','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.projectDetails.scheme==='Select Source of Fund' || this.projectDetails.scheme===''){
    this.toastr.warning('Please select a source of fund','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.projectDetails.district==='Select District' || this.projectDetails.district===''){
    this.toastr.warning('Please select a district','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  
  // if(this.projectDetails.contractor==='' || this.projectDetails.contractor===null || this.projectDetails.contractor===undefined){
  //   this.toastr.warning('Please type contractor name.','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if(this.projectDetails.contractorPhone==='' || this.projectDetails.contractorPhone===null || this.projectDetails.contractorPhone===undefined){
  //   this.toastr.warning('Please type contractor phone number.','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if(this.projectDetails.wo_number===0 || this.projectDetails.wo_number==='' || this.projectDetails.wo_number===null || this.projectDetails.wo_number===undefined){
  //   this.toastr.warning('Please type work order number.','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if(this.projectDetails.wo_date==='' || this.projectDetails.wo_date===null || this.projectDetails.wo_date===undefined){
  //   this.toastr.warning('Please pick work order date.','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if(this.projectDetails.wo_amount===0 || this.projectDetails.wo_amount==='' || this.projectDetails.wo_amount===null || this.projectDetails.wo_amount===undefined){
  //   this.toastr.warning('Please type work order amount.','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if( this.projectDetails.actual_start==='' || this.projectDetails.actual_start===null || this.projectDetails.actual_start===undefined){
  //   this.toastr.warning('Please pick actual project start date','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if( this.projectDetails.actual_end==='' || this.projectDetails.actual_end===null || this.projectDetails.actual_end===undefined){
  //   this.toastr.warning('Please pick actual project end date','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if (this.projectDetails.scheme == "State Government Funded Scheme") {
  //   if(this.projectDetails.contractor_cs==='' || this.projectDetails.contractor_cs===null || this.projectDetails.contractor_cs===undefined){
  //     this.toastr.warning('Please type consultancy Service contractor name.','Warning',{
  //       disableTimeOut:false
  //     });
  //     return false;
  //   }
  //   if(this.projectDetails.contractorPhoneCs==='' || this.projectDetails.contractorPhoneCs===null || this.projectDetails.contractorPhoneCs===undefined){
  //     this.toastr.warning('Please type consultancy Service contractor phone number.','Warning',{
  //       disableTimeOut:false
  //     });
  //     return false;
  //   }
  //   if(this.projectDetails.wo_number_cs===0 || this.projectDetails.wo_number_cs==='' || this.projectDetails.wo_number_cs===null || this.projectDetails.wo_number_cs===undefined){
  //     this.toastr.warning('Please type consultancy Service work order number.','Warning',{
  //       disableTimeOut:false
  //     });
  //     return false;
  //   }
  //   if(this.projectDetails.wo_date_cs==='' || this.projectDetails.wo_date_cs===null || this.projectDetails.wo_date_cs===undefined){
  //     this.toastr.warning('Please pick consultancy Service work order date.','Warning',{
  //       disableTimeOut:false
  //     });
  //     return false;
  //   }
  //   if( this.projectDetails.actual_start_cs==='' || this.projectDetails.actual_start_cs===null || this.projectDetails.actual_start_cs===undefined){
  //     this.toastr.warning('Please pick actual project consultancy Service start date','Warning',{
  //       disableTimeOut:false
  //     });
  //     return false;
  //   }
  //   if( this.projectDetails.actual_end_cs==='' || this.projectDetails.actual_end_cs===null || this.projectDetails.actual_end_cs===undefined){
  //     this.toastr.warning('Please pick actual project consultancy Service end date','Warning',{
  //       disableTimeOut:false
  //     });
  //     return false;
  //   }
  // }
  if( this.projectDetails.description==='' || this.projectDetails.description===null || this.projectDetails.description===undefined){
    this.toastr.warning('Please type project description','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.projectDetails.type==='' || this.projectDetails.type==='Select Project Type'){
    this.toastr.warning('Please select project type.','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  
  
  return true;
}
setMilestones = () =>{
  console.log(this.projectDetails);
  if(this.projectDetails.type==""){
    this.toastr.warning('Please select project type','Warning',{
      disableTimeOut:false
    });
    return;
  }
  this.createProjectService.getMilestones(this.projectDetails.type, (res: any) => {
    console.log("tttttttttt",res);
    this.milestones = [];
    if(res.length==0){
      this.isMilestoneExist = false;
    }else{
      this.milestoneDates = [];
      this.milestones = res;
      this.isMilestoneExist = true;
    }
  });
}
  //Start: Method to create a new project   State Government Funded Scheme
  saveProject = () =>{

    
    // this.createProjectService.getMilestones(this.projectDetails.scheme, (res: any) => {
    //   console.log("jjjjjjjjj",res);
    //   this.milestones = [];
    //   if(res.length==0){
    //     this.isMilestoneExist = false;
    //   }else{
    //     this.milestoneDates = [];
    //     this.milestones = res;
    //     console.log("lllllllllllllll",this.milestones.steps);
    //     this.milestones.map(item => {
    //       let contData = {
    //         step: item.steps,
    //         project_type: item.project_type
    //       }
    //       this.milestoneDates.push(contData);
    //     });
    //     console.log("mmmmmmmmmmm",this.milestoneDates);
        
    //     this.isMilestoneExist = true;
      
   
        
  
    // this.projectDetails.milestoneDates= this.milestoneDates;
    // console.log("kkkkkkkk",this.projectDetails);
    
    this.isSaving = true;
    let isValid = this.validateInputs();
    if(isValid){
      this.createProjectService.createProject(this.projectDetails, (res: any) => {
        $(function () {
          $(".left-side > .danger").click();
        });
        let ele = document.getElementById('modalClose');
        ele.click();
        this.isSaving = false;
        this.added.emit({response : true});
        this.resetForm();
      });
    }else{
      this.isSaving = false;
    }
    // }
    // });

  }
  // End

  resetForm(){
    this.projectDetails.type = '';
    this.projectDetails.name = '';
    this.projectDetails.contractor_cs = '';
    this.projectDetails.contractor = '';
    this.projectDetails.contractorPhoneCs = '';
    this.projectDetails.contractorPhone = '';
    this.projectDetails.initial_amount = '';
    this.projectDetails.scheme = 'Select Source of Fund';
    this.projectDetails.district = 'Select District';
    this.projectDetails.other_scheme = '';
    this.projectDetails.aa_status = '';
    this.projectDetails.tender_amount_cs = '';
    this.projectDetails.tender_amount = '';
    this.projectDetails.technical_approval = '';
    this.projectDetails.aa_amount = '';
    this.projectDetails.total_disbursed_amount = '';
    this.projectDetails.descriptio = '';
    this.projectDetails.wo_date_cs = '';
    this.projectDetails.wo_date = '';
    this.projectDetails.wo_number_cs = '';
    this.projectDetails.wo_number = '';
    this.projectDetails.wo_amount_cs = '';
    this.projectDetails.wo_amount = '';
    this.projectDetails.actual_start_cs = '';
    this.projectDetails.actual_stars = '';
    this.projectDetails.actual_end_cs ='';
    this.projectDetails.actual_end ='';
    this.projectDetails.accessKeyword ='';
  }
}

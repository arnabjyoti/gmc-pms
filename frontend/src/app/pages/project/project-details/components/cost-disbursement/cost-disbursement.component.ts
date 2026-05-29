import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LoginService } from "../../../../login/login.service";
import { ProjectDetailsService } from '../../project-details.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-cost-disbursement',
  templateUrl: './cost-disbursement.component.html',
  styleUrls: ['./cost-disbursement.component.css']
})
export class CostDisbursementComponent implements OnInit {
  disbursementForm: FormGroup;
  projectObject: any;
  public permission = {
    projectUpdationPrivilage: false
  };
  public projectDetails={
    name:'',
  };
  public costProject={
    serialNo: '',
    date: '',
    amount: '',
    note: ''
  }
  public kw:any;
  public projectId: any;
  public addCostDisable: boolean = false;
  public onTouchbtn: boolean = false;
  disbursementGraphOptions: any;
  disbursementGraphData: any;
  disbursement: any;
  tableData: any;
  disbursementGraphLebels: any;
  disbursedAmount: any;
  totalAchievedAmount: any;
  projectCost: any;
  source: LocalDataSource;
  chartAreaOptions: any;
  public isLoading : boolean = true;
  public TotalAmount : any;
  public ReceiveAmount : any;

  constructor(
    private route: ActivatedRoute, 
    private projectDetailsService: ProjectDetailsService,
    private loginService: LoginService,) {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('projectId');
      this.getAccessRightsList();
    });
  }

  settings = {
    add: {
      addButtonContent: '<i class="icon-add btn btn-info btn-block">Add</i> ',
      createButtonContent: '<i class="icon-check btn btn-outline-primary"></i>&nbsp;&nbsp;',
      cancelButtonContent: '<i class="icon-close btn btn-outline-danger"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="icon-border_color btn btn-info"></i>&nbsp;&nbsp;',
      saveButtonContent: '<i class="icon-check btn btn-outline-primary"></i>&nbsp;&nbsp;',
      cancelButtonContent: '<i class="icon-close btn btn-outline-danger"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="icon-delete btn btn-danger"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'Serial',
        type: 'integer',
      },
      disbursement_date: {
        title: 'Date (YYYY-MM-DD)',
        type: 'date',
      },
      disbursement_amount: {
        title: 'Amount',
        type: 'string',
      },
      note: {
        title: 'Note',
        type: 'string',
      },
    },
  };

  ngOnInit(): void {
    this.getUserDetails();
    this.getProjectById();
    this.chartAreaOptions = {
      xkey: 'date',
      ykeys: ['disburse_amount', 'achieved_amount', 'project_cost'],
      labels: ['Disburse Amount', 'Achieved Amount', 'Project Cost'],
      behaveLikeLine: !0,
      pointSize: 0,
      pointStrokeColors: ['#1a8e5f'],
      gridLineColor: "#e1e5f1",
      lineColors: ['#1a8e5f'],
      gridtextSize: 10,
      fillOpacity: 0.7,
      lineWidth: 0,
      hideHover: "auto",
      resize: true,
      redraw: true,
    };
  }

  getUserDetails = () =>{
    let token = localStorage.getItem('token');
    token = JSON.parse(token);
    if(token){
      this.kw = token['usr'];
      // console.log("usrhhhhhhhhh name=", this.accessKeyword.accessKeyword);
  }
}

  getProjectById = () => {
    if (this.projectId) {
      this.projectDetailsService.getProjectById(this.projectId, (res: any) => {
        console.log("Disburse",res);
        this.projectObject = res;
        this.isLoading = false;
        this.projectDetails = this.projectObject['project'];
        this.TotalAmount = res.project.approve_cost;
        this.depictDisbursementGraph(this.projectObject);
      });
    } else {
      console.log("Oopse!! Something went wrong");
    }
  }

  depictDisbursementGraph = (projectObject: { [x: string]: { initial_amount: any; }; }) => {
    this.disbursement = projectObject['disbursement'];
    let achievedTotal = 0;
    let projectCost = projectObject['project'].initial_amount;
    let data = {};
    let graphObj = {};
    let arr = [];
    this.tableData = [];
    this.disbursement.map((item: any) => {
      data = {
        id: item.id,
        disbursement_date: moment(item.disburse_date).format('DD-MM-YYYY'),
        disbursement_amount: item.amount,
        note: item.note,
      }
      this.tableData.push(data);
      achievedTotal = achievedTotal + parseInt(item.amount);
      console.log("acvd",achievedTotal);
      
      this.ReceiveAmount = achievedTotal;
      console.log("rrrrrrrrrr",this.ReceiveAmount);
      
      graphObj = {
        date: moment(item.disburse_date).format('DD, MMM YYYY'),
        disburse_amount: item.amount,
        achieved_amount: achievedTotal,
        project_cost: projectCost
      }
      arr.push(graphObj);
    });
    this.disbursementGraphData = arr;
    // this.initializeDisbursementTable(this.tableData);
  }

  initializeDisbursementTable = (tableData: any) => {
    this.source = new LocalDataSource(tableData);
  }

  addDisbursementRecord = () => {
    const requestObject = {
      project_id: this.projectId,
      disburse_date: this.costProject.date,                                //moment().format('YYYY-MM-DD')
      amount: this.costProject.amount,
      note: this.costProject.note
    };
    if(this.costProject.date !== '' && this.costProject.amount !== '' && this.costProject.note !==''){
      this.addCostDisable = true;
      this.projectDetailsService.addProjectDisbursement(requestObject, (res: any) => {
        console.log(res);
        this.addCostDisable = false;
        this.costProject.date = '';
        this.costProject.amount = '';
        this.costProject.note = '';
        // this.source.empty();
        this.getProjectById();    
      });
    }
    else
    {
      alert('Please enter the values!');
    }
    
  }

  onDeleteConfirm(event: any): void {
    console.log('Event', event);
    if (window.confirm('Are you sure you want to delete?')) {

      let id = event;
      this.projectDetailsService.deleteDisburseMentById(id, (data : any) => {
        this.getProjectById();
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }

  editDisbursementRecord(event: any): void {
    console.log('Event', event);
  }
  
  getAccessRightsList = () => {
    this.permission.projectUpdationPrivilage = this.loginService.return_hasUpdateProjectDetailsRights();
    console.log("Permissionsss=====", this.permission);
  };
}


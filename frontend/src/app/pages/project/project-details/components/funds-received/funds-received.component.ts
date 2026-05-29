import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "../../../../login/login.service";
import { AppService } from "../../../../../app.service";
import { FundsReceivedService } from "../../components/funds-received/funds-received.service";
import * as $ from "jquery";

@Component({
  selector: "app-funds-received",
  templateUrl: "./funds-received.component.html",
  styleUrls: ["./funds-received.component.css"],
  providers: [FundsReceivedService]
})
export class FundsReceivedComponent implements OnInit {
  public projectId: any;
  public user:any;
  public projectDetails: any = {
    name: "",
    tender_amount: "",
    initial_amount:"",
    aa_status:"",
    technical_approval:"",
    scheme:"",
  };
  public fund = {
    id: "",
    tender_amount: "",
    tender_amount_cs: "",
    initial_amount:"",
    aa_status:"",
    technical_approval:"",
    aa_number: "",
    aa_amount: "",
    aa_date: "",
    fsn:"",
    fsd:"",
    fsa:"",
    fsn_cs:"",
    fsd_cs:"",
    fsa_cs:"",
    focn:"",
    focd:"",
    foca:"",
    focn_cs:"",
    focd_cs:"",
    foca_cs:"",
    ts_amount: "",
    fs_amount: "",
    received_fund: "",
    projectId: "",
    goi_fund: "",
		ss: "",
		goi_fund_sanctioned: "",
		goi_fund_rcvd: "",
		blnc_goi_fund: "",
		total_ss: "",
		ss_rcvd: "",
    project_cost: "",
  };
  public fsValues = [];
  public newFS: any;
  public permission = {
    projectUpdationPrivilage: false
  };
  public isLoading: boolean = true;
  constructor(
    private loginService: LoginService,
    private fundsReceivedService: FundsReceivedService,
    private appService: AppService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
      this.getProjectFundById();
      this.getAccessRightsList();
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


  getProjectFundById = () => {
    this.fsValues = [];
    this.fundsReceivedService.getProjectFundById(this.projectId, res => {
      console.log("Res==", res);
      this.isLoading = false;
      if (!res || res === undefined || res === null) {
        // do something
      } else {
        this.projectDetails = res.project;
        this.fund = res.fund[0];
        if (JSON.parse(this.fund["fs_amount"]) === null) {
          this.fsValues = ["0"];
        } else {
          this.fsValues = JSON.parse(this.fund["fs_amount"]);
        }

        console.log("FS===", this.fsValues);
      }
    });
  };

 
  updateFundReceived = () => {
   

    let newFsValue = this.fsValues.filter((elm) => {
      return elm !== '0'
    })

    console.log("Updating",newFsValue);

    let stringifiedFsValues = JSON.stringify(newFsValue);
    this.fund.fs_amount = stringifiedFsValues;
    console.log("Object1==", this.fund);

    const requestObject = {
      id: this.fund.id,
      tender_amount: this.fund.tender_amount,
      tender_amount_cs: this.fund.tender_amount_cs,
      initial_amount: this.fund.initial_amount,
      aa_status: this.fund.aa_status,
      aa_amount: this.fund.aa_amount,
      technical_approval: this.fund.technical_approval,
      fsn:this.fund.fsn,
      fsd:this.fund.fsd,
      fsa:this.fund.fsa,
      focn:this.fund.focn,
      focd:this.fund.focd,
      foca:this.fund.foca,
      fsn_cs:this.fund.fsn_cs,
      fsd_cs:this.fund.fsd_cs,
      fsa_cs:this.fund.fsa_cs,
      focn_cs:this.fund.focn_cs,
      focd_cs:this.fund.focd_cs,
      foca_cs:this.fund.foca_cs,
      ts_amount: this.fund.ts_amount,
      fs_amount: this.fund.fs_amount,
      fundRecieved: this.fund.received_fund,
      project_id: this.fund.projectId,
      goi_fund: this.fund.goi_fund,
		  ss: this.fund.ss,
		  goi_fund_sanctioned: this.fund.goi_fund_sanctioned,
		  goi_fund_rcvd: this.fund.goi_fund_rcvd,
		  blnc_goi_fund: this.fund.blnc_goi_fund,
		  total_ss: this.fund.total_ss,
		  ss_rcvd: this.fund.ss_rcvd,
      project_cost: this.fund.project_cost,
    };
    console.log("ReqObject1==", requestObject);
    this.fundsReceivedService.updateFundReceived(requestObject, (res: any) => {
      $(function() {
        $(".left-side > .danger").click();
      });
      // this.isEnabled = false;
      // this.isSaving = false;
      // console.log(res);
      // this.getProjectById();
      // this.parentDiv.map(item => {
      //   $('#' + item).remove();
      // });
    });
  };

  parseFocd = dt => {
    this.fund.focd = dt;
  };
  parseFsd = dt => {
    this.fund.fsd = dt;
  };
  parseFocdCs = dt => {
    this.fund.focd_cs = dt;
  };
  parseFsdCs = dt => {
    this.fund.fsd_cs = dt;
  };


  getAccessRightsList = () => {
    this.permission.projectUpdationPrivilage = this.loginService.return_hasUpdateProjectDetailsRights();
    console.log("Permissionsss=====", this.permission);
  };
}

import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  AfterContentInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectDetailsService } from "../../project-details.service";
import * as moment from "moment";
import { LocalDataSource } from "ng2-smart-table";
import { LoginService } from "../../../../login/login.service";
import { FormControl, FormArray } from "@angular/forms";
import { PhysicalProgressService } from "./physical-progress.service";
import { parse } from "path";

@Component({
  selector: "app-physical-progress",
  templateUrl: "./physical-progress.component.html",
  styleUrls: ["./physical-progress.component.css"]
})
export class PhysicalProgressComponent implements OnInit, AfterViewInit {
  public projectId: any;
  public projectObject: any; 
  public isLoading: any = true;
  public projectDetails: any;
  public projectStatus: any;
  public projectType: any;
  public projectSteps: any;
  public step: any = {};
  public qtd: any = {};
  public max = 3;
  public chartAreaOptions;
  public chartAreaData = [];
  public allSteps = [];
  public allStepsId = [];
  public projectProgress;
  public progressLastUpdatedAt;
  public progressLastUpdatedTime;
  public progressEmpty = false;
  public checkValueAtInput = {};
  public largerConsecutiveNumber = false;
  public zeroValue = true;
  public greaterThanHundred = false;
  public flag;
  public progressShow = [];
  public permission = {
    projectUpdationPrivilage: false
  };
  public overAllProgress;
  constructor(
    private route: ActivatedRoute,
    private projectDetailsService: ProjectDetailsService,
    private loginService: LoginService,
    private physicalProgressService: PhysicalProgressService
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
      this.getProjectName();
      this.getProjectById();
      this.getAccessRightsList();
    });
    this.flag = history.state.flag;
    // let styleElement = document.getElementById("print-section");
    // styleElement.append("@media print { @page { size: A4 landscape; } }");
  }

  ngOnInit(): void {
    // this.getProjectName();
    // // this.getProjectById();
    // this.getAccessRightsList();
  }

  ngAfterViewInit() {}

  getProjectName = () => {
    this.projectDetailsService.getProjectTypeById(this.projectId, response => {
      this.projectType = response.scheme;
      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",this.projectType);
      
      this.getProjectSteps();
    });
  };

  init = () => {
    if (this.flag == "print") {
      // window.print();
      setTimeout(function() {
        window.print();
      }, 3000);
    }
  };

  // print = () => {
  //   window.print()
  // };

  initializeChart = async () => {
    this.chartAreaData = [];
    this.chartAreaOptions = {
      xkey: ["step"],
      ykeys: this.allSteps,
      labels: this.allSteps,
      behaveLikeLine: !0,
      pointSize: 0,
      pointStrokeColors: ["#1a8e5f"],
      gridLineColor: "#e1e5f1",
      lineColors: ["#1a8e5f"],
      gridtextSize: 10,
      fillOpacity: 0.7,
      lineWidth: 0,
      hideHover: "auto",
      resize: true,
      redraw: true
    };

    let tot;

    this.projectProgress.map(progress => {
      tot = progress.total_progress;
      let graphObj = {};
      graphObj[progress.step] = progress.progress;
      graphObj["step"] = progress.step;
      this.chartAreaData.push(graphObj);
    });
    let obj = {
      Overall: tot,
      step: "Overall Progress"
    };
    this.chartAreaData.push(obj);
    return 1;
  };

  getProjectById = () => {
    if (this.projectId) {
      this.projectDetailsService.getProjectById(this.projectId, (res: any) => {
        this.projectObject = res;
        this.isLoading = false;
        this.projectType = res.project.scheme;
        console.log("rrrrrrrrrrrrrrrrrrrrrrrr",this.projectType);
        
        this.projectDetails = this.projectObject["project"];
        this.projectStatus = this.projectObject["status"];
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjj",this.projectDetails);
        
      });
    } else {
      console.log("Oopse!! Something went wrong");
    }
  }; 
 
  getProjectSteps = () => {
    this.projectDetailsService.getProjectSteps(
      this.projectType,
      (response: any) => {
        this.projectSteps = response;
        console.log("vvvvvvvvvvvvvvvvvvvvvv",this.projectSteps);
        
        this.projectSteps.map(steps => {
          this.allSteps.push(steps.steps);

          this.allStepsId.push(steps.id);
          this.step[steps.steps] = null;
          console.log("vvvvvvvvvvvvvvvvvvvvvv",this.allSteps);
        });
        this.allSteps.push("Overall");
        this.getProgress();
      }
    );
  };

  check = (step, value) => {
    this.checkValueAtInput[step] = parseInt(value);
  };

  validate() {
    this.greaterThanHundred = false;
    this.zeroValue = true;
    let arr = [];
    this.projectSteps.map((item, index) => {
      if (this.step[item.steps] == null || this.step[item.steps] == "") {
        arr.push(0);
      } else {
        arr.push(parseInt(this.step[item.steps]));
      }
    });
    // if (!this.is_sorted(arr)) {
    //   this.largerConsecutiveNumber = true;
    // } else {
    //   this.largerConsecutiveNumber = false;
    // }
    arr.map(item => {
      if (item != 0) {
        this.zeroValue = false;
      }
      if (item > 100) {
        this.greaterThanHundred = true;
      }
    });
  }

  // is_sorted(arr) {
  //   var len = arr.length - 1;
  //   for (var i = 0; i < len; ++i) {
  //     if (arr[i] < arr[i + 1]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  updatePhysicalProgress = () => {
    this.validate();
    if (
      !this.zeroValue &&
      !this.largerConsecutiveNumber &&
      !this.greaterThanHundred
    ) {
      this.saveProgress();
    } else {
      console.log("INVALID");
    }
  };

  saveProgress = () => {
    let tot = 0;
    let dum = 0;
    for (let item in this.step) {
      dum = dum + 100;
      tot = tot + parseInt(this.step[item]);
    }
    tot = (tot / dum) * 100;
    let arr = [];
    for (let item in this.step) {
      arr.push({
        project_id: this.projectId,
        project_type: this.projectType,
        step: item,
        progress: parseInt(this.step[item]),
        total_progress: tot.toFixed(2)
      });
    }
    let requestObject = {
      data: arr,
      projectId: this.projectId,
      projectType: this.projectType
    };
    this.physicalProgressService.saveProgress(requestObject, response => {
      $(function() {
        $(".left-side > .danger").click();
      });
      this.getProgress();
    });
  };

  getProgress = () => {
    this.progressShow = [];
    this.physicalProgressService.getProgress(this.projectId, response => {
      if (response.length > 0) {
        this.overAllProgress = response[0].total_progress;
        console.log("hhhhhhhhhh",this.overAllProgress);
        
        this.progressLastUpdatedAt = new Date(
          response[0].updatedAt
        ).toDateString();
        this.progressLastUpdatedTime = new Date(
          response[0].updatedAt
        ).toLocaleTimeString();
        this.projectProgress = response;
        console.log("PROGRESSSSSSS", this.projectProgress);
        this.initializeChart().then(res => {
          this.init();
        });

        this.projectSteps.map((item, index) => {
          this.step[item.steps] = this.projectProgress[index]["progress"];
          let obj = {
            name: item.steps,
            percent: this.projectProgress[index]["progress"]
          };
          this.progressShow.push(obj);
        });
      } else {
        this.progressEmpty = true;
      }
    });
  };

  getAccessRightsList = () => {
    this.permission.projectUpdationPrivilage = this.loginService.return_hasUpdateProjectDetailsRights();
  };
}

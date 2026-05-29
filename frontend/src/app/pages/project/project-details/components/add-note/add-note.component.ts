import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectDetailsService } from "../../project-details.service";
import * as moment from "moment";
import { environment } from "../../../../../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { AppService } from "../../../../../app.service";
import { AddNoteService } from "./add-note.service";
import * as $ from "jquery";
import CSVExportService from "json2csvexporter";
import { LoginService } from "../../../../login/login.service";

@Component({
  selector: "app-add-note",
  templateUrl: "./add-note.component.html",
  styleUrls: ["./add-note.component.css"]
})
export class AddNoteComponent implements OnInit {
  public projectId: any;
  public userId: any;
  public projectDetails = {
    name: ""
  };
  public receiver_user: any;
  public noteObject = {
    subject: "To whom",
    description: ""
  };
  public gmcEmployees: any;
  public endpoint: any;
  public availableNote: any;
  public isResLoaded: boolean = false;
  public isLoading: boolean = true;
  public permission = {
    addNote: false
  };
  constructor(
    private route: ActivatedRoute,
    private projectDetailsService: ProjectDetailsService,
    private toastr: ToastrService,
    private appService: AppService,
    private noteService: AddNoteService,
    private loginService: LoginService
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
    });
    this.endpoint = environment.BASE_URL;
  }

  ngOnInit(): void {
    this.getNote();
    this.getProjectById();
    this.getAllEmployees();
    this.getAccessRightsList();
  }

  updateNoteReadStatus = () => {
    console.log("Updating Status");
    this.appService.updateNoteReadStatus(
      this.userId,
      this.projectId,
      response => {
        console.log("Note Update Status", response);
      }
    );
  };

  getProjectById = () => {
    this.projectDetailsService.getProjectById(this.projectId, res => {
      console.log("Res==", res);
      if (!res || res === undefined || res === null) {
        // do something
      } else {
        this.projectDetails = res.project;
      }
    });
  };

  getNote = () => {
    if (this.projectId) {
      this.noteService.getNote(this.projectId, (res: any) => {
        this.availableNote = res;
        this.isResLoaded = true;
        this.isLoading = false;
        let tokenData: any = JSON.parse(localStorage.getItem("token"));
        this.userId = tokenData.usr.id;
        this.updateNoteReadStatus();
        console.log("Notes===", this.availableNote);
        this.availableNote.map(item => {
          if (item.receiver_uid === this.userId) {
            console.log("ITEM=", item);
          }
        });
      });
    } else {
      console.log("Oopse!! Something went wrong");
    }
  };

  getAllEmployees = () => {
    this.noteService.getAllEmployees(res => {
      console.log("GMCEMPLOYEES==", res);
      if (!res || res === undefined || res === null) {
        // do something
      } else {
        this.gmcEmployees = res;
      }
    });
  };

  saveNote = () => {
    if (
      this.noteObject.subject === "To whom" ||
      this.noteObject.subject === "" ||
      this.noteObject.subject === null ||
      this.noteObject.subject === undefined
    ) {
      this.toastr.error("Please select one.", "Blank selection", {
        disableTimeOut: false
      });
    } else if (
      this.noteObject.description === "" ||
      this.noteObject.description === null ||
      this.noteObject.description === undefined
    ) {
      this.toastr.error("Please enter description.", "Blank Description", {
        disableTimeOut: false
      });
    } else {
      let tokenData: any = JSON.parse(localStorage.getItem("token"));
      this.gmcEmployees.map(item => {
        if (item.id === parseInt(this.noteObject.subject)) {
          this.receiver_user = item;
          console.log("receiver_user==", this.receiver_user);
        }
      });

      const requestObject = {
        uid: tokenData.usr.id,
        subject: "@" + this.receiver_user.name,
        description: this.noteObject.description,
        receiver_uid: this.receiver_user.id,
        projectId: this.projectId
      };
      console.log("Note Request==", requestObject);
      this.noteService.saveNote(requestObject, (res: any) => {
        if (res.msg === "done") {
          this.toastr.success("Note Added Successfully", "Successful", {
            disableTimeOut: false
          });
          $(function() {
            $(".left-side > .danger").click();
          });
          this.getNote();
        } else {
          this.toastr.error("Something went wrong", "Oops", {
            disableTimeOut: false
          });
        }
      });
    }
  };

  print = () => {
    const printContent = document.getElementById("componentID");
    const WindowPrt = window.open(
      "",
      "",
      "left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0"
    );
    WindowPrt.document.open();
    WindowPrt.document.write(`
    <html>
        <head>
          <style>
          .flex-container {
            display: flex;
          }
          .center {
      margin: auto 0;
    padding: 10px;
    font-size: 29px;
}
.no-white-space > p {
  white-space: pre-wrap !important;
}
body{
  text-align: justify;
}
          </style>
        </head>
    <body onload="window.print();window.close();">
   <div class="flex-container">
    <div><img width="150" height="150" src="../../../../../../assets/img/gmc-logo.png"></div>
    <div class="center">
    G.M.C Project Management System
    </div>
   </div>
   <small>Powered By Skaplink Technologies Pvt Ltd</small>
   <hr/>
   <h4 style="text-align:center">${this.projectDetails.name}</h4>
   <hr/>
   <div class="no-white-space">
    ${printContent.innerHTML}
    </div>
    </body>
      </html>`);
    WindowPrt.document.close();
    WindowPrt.focus();
  };

  download = () => {
    console.log("Downloading");
    console.log(this.availableNote);
    let data = [];
    this.availableNote.map(item => {
      console.log(item["user.name"]);
      let obj = {
        "Digital Note": item.note,
        "Digitally Signed By": item["user.name"],
        Addressing: item.subject,
        "Date & Time": moment(item.createdAt, "DD-MM-YYYY")
      };
      data.push(obj);
    });
    const exporter = CSVExportService.create();
    exporter.downloadCSV(data);
  };

  getAccessRightsList = () => {
    this.permission.addNote = this.loginService.return_hasUpdateProjectDetailsRights();
    console.log("PERMISSION",this.permission.addNote);
  };
}

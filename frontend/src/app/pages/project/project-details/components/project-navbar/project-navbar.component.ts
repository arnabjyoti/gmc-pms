import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../../../login/login.service";

@Component({
  selector: "app-project-navbar",
  inputs: ["projectId", "activePage"],
  templateUrl: "./project-navbar.component.html",
  styleUrls: ["./project-navbar.component.css"]
})
export class ProjectNavbarComponent implements OnInit {
  projectId: string | null = null;
  activePage: string | null = null;
  public permission = {
    addNote: false,
    projectUpdationPrivilage:false,
    svDis: false
  };
  page = {
    projectDetails: false,
    fundsReceived: false,
    costDisbursement: false,
    physicalProgress: false,
    docGallery: false,
    imageGallery: false,
    addNote: false,
    measurementBook: false,
    feedback: false,
    assembly: false
  };

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.setActivePageClass();
    this.getAccessRightsList(); 
  }

  setActivePageClass = () => {
    switch (this.activePage) {
      case "projectDetails":
        this.page.projectDetails = true;
        break;
      case "fundsReceived":
        this.page.fundsReceived = true;
        break;
      case "costDisbursement":
        this.page.costDisbursement = true;
        break;
      case "physicalProgress":
        this.page.physicalProgress = true;
        break;
      case "docGallery":
        this.page.docGallery = true;
        break;
      case "imageGallery":
        this.page.imageGallery = true;
        break;
      case "addNote":
        this.page.addNote = true;
        break;
      case "measurementBook":
        this.page.measurementBook = true;
        break;
      case "feedback":
        this.page.feedback = true;
        break;
      case "assembly":
        this.page.assembly = true;
        break
    }
    console.log("vvvvvvvvvvvvvvv",this.page.projectDetails);
    
  };

  getAccessRightsList = () => {
    this.permission.addNote = this.loginService.return_hasUpdateProjectDetailsRights();
    this.permission.svDis = this.loginService.return_hasViewDisbursementsRights();
    this.permission.projectUpdationPrivilage = this.loginService.return_hasUpdateProjectDetailsRights();
    console.log("Permission ====>> ",this.permission);
  };
}

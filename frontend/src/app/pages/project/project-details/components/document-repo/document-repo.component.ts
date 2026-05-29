import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../../../login/login.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentRepoService } from "./document-repo.service";
import { AppService } from "../../../../../app.service";
import { environment } from "../../../../../../environments/environment";
import { ProjectDetailsService } from "../../project-details.service";
import * as $ from "jquery";
import * as _ from "underscore";

@Component({
  selector: "app-document-repo",
  templateUrl: "./document-repo.component.html",
  styleUrls: ["./document-repo.component.css"],
  providers: [DocumentRepoService]
})
export class DocumentRepoComponent implements OnInit {
  public isPageLoaded: boolean = false;
  public chooseFile: string = "Choose File";
  public projectId: any;
  public user:any;
  public projectDetails = {
    name: "",
    accessKeyword:"",
  };
  public isDirectoryOpen: boolean = false;
  public newDirectoryName: string = "";
  public folders = [];
  public documents = [];
  public currentFolderId: any;
  public currentFolderName: any;
  public currentFolderDocuments = [];
  public docGallery: any;
  public uploadDocObject = {
    type: "Select document type",
    description: "",
    doc: ""
  };
  public acceptfileType: string = "image";
  public endpoint: any;
  public permission = {
    uploadDocument: false
  };
  public isLoading: boolean = true;
  constructor(
    private loginService: LoginService,
    private documentRepoService: DocumentRepoService,
    private appService: AppService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private projectDetailsService: ProjectDetailsService
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
    });
    this.endpoint = environment.BASE_URL;
  }

  ngOnInit(): void {
    this.getProjectName();
    // this.getProjectById();
    this.getDocuments();
    this.getAccessRightsList();
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

  getProjectName = () => {
    this.projectDetailsService.getProjectNameById(this.projectId, response => {
      this.projectDetails.name = response.name;
      this.projectDetails.accessKeyword = response.accessKeyword;
      // console.log("hhhhhhhhhhhhhhhh",response);
      
      this.isLoading = false;
      this.isPageLoaded = true;
    });
  };

  getProjectById = () => {
    this.appService.getProjectById(this.projectId, res => {
      console.log("Res==", res);
      this.isLoading = false;
      if (!res || res === undefined || res === null) {
        // do something
      } else {
        this.projectDetails = res.project;
        this.isPageLoaded = true;
        console.log("ProjectDetails=", this.projectDetails);
      }
    });
  };

  createDirectory = () => {
    if (
      this.newDirectoryName === "" ||
      this.newDirectoryName === null ||
      this.newDirectoryName === undefined
    ) {
      this.toastr.error(
        "Please enter a directory name.",
        "Blank directory name",
        {
          disableTimeOut: false
        }
      );
    } else if (this.newDirectoryName.length > 25) {
      this.toastr.error(
        "Please provide a shorter name.",
        "Directory name too long",
        {
          disableTimeOut: false
        }
      );
    } else {
      console.log("Directory Creation code");
      $(function() {
        $(".left-side > .danger").click();
      });
      const requestObject = {
        original_file_name: this.newDirectoryName,
        projectId: this.projectId,
        isActive: true,
        type: "folder"
      };
      this.documentRepoService.createFolder(requestObject, (res: any) => {
        if (res) {
          $(function() {
            $(".left-side > .danger").click();
          });
          this.toastr.success("Folder created", "Success", {
            disableTimeOut: false
          });
          this.getDocuments();
          this.initializeCreateFolderInputs();
        } else {
          this.toastr.error("Oops! Something went wrong.", "Bad Request", {
            disableTimeOut: false
          });
        }
        console.log("FolderCreateResponse=", res);
      });
    }
    console.log("Directory Name=", this.newDirectoryName);
  };

  openDirectory = selectedFolder => {
    console.log(selectedFolder);
    this.currentFolderId = selectedFolder.id;
    this.currentFolderName = selectedFolder.original_file_name;
    this.isDirectoryOpen = true;
    this.filterDireftoryContents(this.currentFolderId);
  };

  filterDireftoryContents = fileId => {
    this.currentFolderDocuments = [];
    console.log(fileId);
    let fileID = String(fileId);
    this.documents.map(item => {
      if (fileID == item.folder_id) {
        this.currentFolderDocuments.push(item);
      }
    });
    console.log("CurrentContents===", this.currentFolderDocuments);
    console.log(typeof this.currentFolderDocuments);
  };

  closeDirectory = () => {
    this.isDirectoryOpen = false;
  };

  getDocuments = () => {
    this.folders = new Array();
    this.documentRepoService.getDocumentByProjectId(
      this.projectId,
      (res: any) => {
        console.log("Rrrrr=", res);
        this.reorderFolders(res);
        // this.reorderPhotos(res);
      }
    );
  };

  

  reorderFolders = doc => {
    this.currentFolderDocuments = [];
    this.docGallery = _.filter(doc, (d: any) => {
      return d.docType !== "imageGallery";
    });
    this.docGallery.map(item => {
      if (item.type == "folder") {
        this.folders.push(item);
      } else {
        this.documents.push(item);
      }
      if (item.folder_id == this.currentFolderId) {
        this.currentFolderDocuments.push(item);
      }
    });
    console.log("currentFolderDocuments", this.currentFolderDocuments);
    console.log("foLDErS===", this.folders);
    console.log("files===", this.documents);
  };

  onFileSelect = event => {
    console.log(event.target.files);
    if (event.target.files.length > 0) {
      this.uploadDocObject.doc = event.target.files[0];
      this.chooseFile = this.uploadDocObject.doc
        ? this.uploadDocObject.doc["name"]
        : "Choose File";
      console.log("Choose", this.chooseFile);
    }
    return true;
  };

  validateInputs = () => {
    if (
      this.uploadDocObject.type === "Select document type" ||
      this.uploadDocObject.type === "" ||
      this.uploadDocObject.type === null ||
      this.uploadDocObject.type === undefined
    ) {
      this.toastr.warning("Please select document type.", "Warning!", {
        disableTimeOut: false
      });
      return false;
    }
    if (this.uploadDocObject.description === "") {
      this.toastr.warning("Please enter document description", "Warning!", {
        disableTimeOut: false
      });
      return false;
    }
    if (this.uploadDocObject.doc === "") {
      this.toastr.warning("Please select a document", "Warning!", {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  };
  handleUploadDocument = () => {
    console.log("Uploading doc", this.uploadDocObject);
    let isValidInputs = this.validateInputs();
    if (isValidInputs) {
      this.isAllowedFile(this.uploadDocObject.doc, res => {
        if (res) {
          $(function() {
            $(".left-side > .danger").click();
          });
          const formData = new FormData();
          formData.append("projectId", this.projectId);
          formData.append("parentId", null);
          formData.append("docType", "docGallery");
          formData.append("docTitle", this.uploadDocObject.type);
          formData.append("docDescription", this.uploadDocObject.description);
          formData.append("file", this.uploadDocObject.doc);
          formData.append("folder_id", this.currentFolderId);
          this.documentRepoService.upload(
            formData,
            this.projectId,
            this.acceptfileType,
            result => {
              if (result.status) {
                this.toastr.success("File uploaded successfully.", "Success!", {
                  disableTimeOut: false
                });
                this.getDocuments();
                this.initializeUploadInputs();
              } else {
                this.toastr.error("File upload failed.", "Failure!", {
                  disableTimeOut: false
                });
              }
              console.log(result);
            }
          );
        } else {
          this.toastr.error("Unsupported file type.", "Bad Request", {
            disableTimeOut: false
          });
        }
      });
    }
  };

  initializeUploadInputs = () => {
    this.uploadDocObject = {
      type: "Select document type",
      description: "",
      doc: ""
    };
    this.chooseFile = "Choose File";
  };

  initializeCreateFolderInputs = () => {
    this.newDirectoryName = "";
  };

  isAllowedFile = (file, callback) => {
    switch (file.type) {
      case "image/jpg":
      case "image/png":
      case "image/jpeg":
      case "image/tif":
      case "image/bmp":
      case "application/pdf":
      case "application/png":
      case "application/doc":
      case "application/docx":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.oasis.opendocument.spreadsheet":
      case "application/ods":
      case "application/xls":
      case "application/xlsx":
      case "application/msword":
        return callback(true);
      default:
        return callback(false);
    }
  };

  getAccessRightsList = () => {
    this.permission.uploadDocument = this.loginService.return_hasUploadDocumentsRights();
    console.log("Permissionsss=====", this.permission);
  };
}

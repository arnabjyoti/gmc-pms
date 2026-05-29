import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "../../../../login/login.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../../../environments/environment";
import { AppService } from "../../../../../app.service";
import { ImageGalleryService } from "./image-gallery.service";
import * as _ from "underscore";
import * as $ from "jquery";
import { ProjectDetailsService } from "../../project-details.service";

@Component({
  selector: "app-image-gallery",
  templateUrl: "./image-gallery.component.html",
  styleUrls: ["./image-gallery.component.css"],
  providers: [ImageGalleryService]
})
export class ImageGalleryComponent implements OnInit {
  public isPageLoaded: boolean = false;
  public chooseFile: string = "Choose File";
  public File: any;
  public user:any;
  public showModal: boolean;
  public imgurl;
  public projectId: any;
  public projectDetails = {
    name: "",
    accessKeyword:""
  };
  public imageGallery: any;
  public uploadImageObject = {
    caption: "",
    image: ""
  };
  public permission = {
    uploadImage: false
  };
  public acceptfileType: string = "image";
  public endpoint: any;
  public isLoading: boolean = true;
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private imageGalleryService: ImageGalleryService,
    private route: ActivatedRoute,
    private appService: AppService,
    private projectDetailsService: ProjectDetailsService
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
      this.getProjectName();
      this.getDocuments();
      this.getAccessRightsList();
    });
    this.endpoint = environment.BASE_URL;
  }

  ngOnInit(): void {
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

  show(projImage)
  {
    console.log("working")
    this.showModal = true; // Show-Hide Modal Check
    this.imgurl =this.endpoint+"/docs/"+projImage.projectId+"/"+ projImage.original_file_name;
    console.log("URLLLLLLLLL",this.imgurl)
    
  }
   //Bootstrap Modal Close event
   hide()
   {
     this.showModal = false;
   }
 

  getProjectName = () => {
    this.projectDetailsService.getProjectNameById(this.projectId, response => {
      this.projectDetails.name = response.name;
      this.projectDetails.accessKeyword = response.accessKeyword;
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

  getDocuments = () => {
    this.imageGalleryService.getDocumentByProjectId(
      this.projectId,
      (res: any) => {
        console.log("ProjectDocs=====", res);
        this.reorderPhotos(res);
      }
    );
  };

  reorderPhotos = (photos: any) => {
    let documents = Array.prototype.concat(
      _.findWhere(photos, { isDefault: 1 }) || [],
      _.where(photos, { isDefault: 0 }) || []
    );

    this.imageGallery = _.filter(documents, (d: any) => {
      return d.docType == "imageGallery";
    });

    console.log("ProjectImages=====", this.imageGallery);
  };

  onFileSelect = event => {
    console.log(event.target.files);
    if (event.target.files.length > 0) {
      this.uploadImageObject.image = event.target.files[0];
      this.chooseFile = this.uploadImageObject.image
        ? this.uploadImageObject.image["name"]
        : "Choose File";
      console.log("Choose", this.chooseFile);
      console.log("imgObject===", this.uploadImageObject);
    }
    return true;
  };

  handleUploadImage = () => {
    console.log("Uploading image", this.uploadImageObject);
    let isValidInputs = this.validateInputs();
    if (isValidInputs) {
      this.isAllowedFile(this.uploadImageObject.image, res => {
        const formData = new FormData();
        formData.append("projectId", this.projectId);
        formData.append("parentId", null);
        formData.append("docType", "imageGallery");
        formData.append("docTitle", null);
        formData.append("docDescription", null);
        formData.append("imgCaption", this.uploadImageObject.caption);
        formData.append("file", this.uploadImageObject.image);

        console.log("FORMDATA===", formData);
        this.imageGalleryService.upload(
          formData,
          this.projectId,
          this.acceptfileType,
          response => {
            console.log(response);
            if (response.status === 200) {
              $(function() {
                $(".left-side > .danger").click();
              });
              this.toastr.success("File uploaded", "Successfull", {
                disableTimeOut: false
              });
              this.getDocuments();
            }
            if (response.status === 400) {
              this.toastr.warning("Invalid image file", "Unsupported file", {
                disableTimeOut: false
              });
            }
          }
        );
      });
    }
  };

  validateInputs = () => {
    if (this.uploadImageObject.caption === "") {
      this.toastr.warning("Please provide image caption", "Warning!", {
        disableTimeOut: false
      });
      return false;
    }
    if (this.uploadImageObject.image === "") {
      this.toastr.warning("Please select an image", "Warning!", {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  };

  isAllowedFile = (file, callback) => {
    switch (file.type) {
      case "image/jpg":
      case "image/png":
      case "image/jpeg":
      case "image/tif":
      case "image/bmp":
        return callback(true);
      default:
        return callback(false);
    }
  };

  getAccessRightsList = () => {
    this.permission.uploadImage = this.loginService.return_hasUploadImageRights();
    console.log("Permissionsss=====", this.permission);
  };
}

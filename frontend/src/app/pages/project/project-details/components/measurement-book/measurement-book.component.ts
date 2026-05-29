import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../login/login.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MeasurementBookService } from './measurement-book.service';
import { AppService } from '../../../../../app.service';
import { environment } from '../../../../../../environments/environment';
import * as $ from 'jquery';
import * as _ from 'underscore';

@Component({
  selector: 'app-measurement-book',
  templateUrl: './measurement-book.component.html',
  styleUrls: ['./measurement-book.component.css'],
  providers:[MeasurementBookService]
})
export class MeasurementBookComponent implements OnInit {
  public kw:any;
  projectObject: any;
  public isPageLoaded:boolean=false;
  public chooseFile: string = 'Choose File';
  public projectId:any;
  public projectDetails={
    name:''
  };
  public mbGallery: any;
  public uploadDocObject= {
    mbTitle:'',
    doc:''
  };
  public acceptfileType:string='image';
  public endpoint:any;
  public permission = {
    uploadDocument: false,
  };
  public isLoading : boolean = true;
  constructor(
    private loginService:LoginService,
    private measurementBookService:MeasurementBookService,
    private appService: AppService,
    private route: ActivatedRoute,
    private toastr: ToastrService,) { 
    this.route.paramMap.subscribe((params) => {
			this.projectId = params.get('projectId');
    });
    this.endpoint = environment.BASE_URL;
  }

  ngOnInit(): void {
    this.getUserDetails();
    console.log("ProjectId===",this.projectId);
    this.getProjectById();
    this.getDocuments();
    this.getAccessRightsList();
  }

  getProjectById = () => {
    this.appService.getProjectById(this.projectId, res=>{
      this.projectObject = res;
      console.log("Res==",res);
      this.isLoading = false;
      if(!res || res===undefined || res===null){
        // do something
      }else{
        this.projectDetails = res.project;
        this.isPageLoaded = true;
        console.log("ProjectDetails=",this.projectDetails);
      }
    });
  }
  getUserDetails = () =>{
    let token = localStorage.getItem('token');
    token = JSON.parse(token);
    if(token){
      this.kw = token['usr'];
      // console.log("usrhhhhhhhhh name=", this.accessKeyword.accessKeyword);
  }
}
  getDocuments = () => {
    this.measurementBookService.getDocumentByProjectId(this.projectId, (res: any) => {
      console.log("Rrrrr=",res);
      this.renderMBFiles(res);
      // this.reorderPhotos(res);
    });
  }

  renderMBFiles = (doc) => {
    this.mbGallery = _.filter(doc, (d: any) => {
      return d.docType === 'mbGallery';
    });
    console.log("files===",this.mbGallery);
  }

  onFileSelect = (event) => {
		console.log(event.target.files);
		if (event.target.files.length > 0) {
			this.uploadDocObject.doc = event.target.files[0];
      this.chooseFile = this.uploadDocObject.doc ? this.uploadDocObject.doc['name'] : 'Choose File';
      console.log("Choose",this.chooseFile);
		}
		return true;
  };

  validateInputs = () =>{
    if(this.uploadDocObject.mbTitle==='' || this.uploadDocObject.mbTitle===null || this.uploadDocObject.mbTitle===undefined){
      this.toastr.warning('Please type MB title.', 'Warning!', {
        disableTimeOut: false
      });
      return false;
    }
    if(this.uploadDocObject.doc===''){
      this.toastr.warning('Please select a document', 'Warning!', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  handleUploadDocument = () =>{
    console.log("Uploading doc",this.uploadDocObject);
    let isValidInputs = this.validateInputs();
    if(isValidInputs){
      this.isAllowedFile(this.uploadDocObject.doc, (res) => {
        if(res){
          $(function () {
            $(".left-side > .danger").click();
          });
          const formData = new FormData();
          formData.append('projectId', this.projectId);
          formData.append('parentId', null);
          formData.append('docType', 'mbGallery');
          formData.append('docTitle', this.uploadDocObject.mbTitle);
          formData.append('docDescription', null);
          formData.append('file', this.uploadDocObject.doc);
          formData.append('folder_id', null);
          this.measurementBookService.upload(formData, this.projectId, this.acceptfileType, (result) => {
            if (result.status) {
              this.toastr.success('File uploaded successfully.', 'Success!', {
                disableTimeOut: false
              });
              this.getDocuments();
              this.initializeUploadInputs();
            } else {
              this.toastr.error('File upload failed.', 'Failure!', {
                disableTimeOut: false
              });
            }
            console.log(result);
          });
        }else{
          this.toastr.error('Unsupported file type.','Bad Request',{
            disableTimeOut:false
          });
        }
      });
    }
    
  };

  initializeUploadInputs = () =>{
    this.uploadDocObject= {
      mbTitle:'',
      doc:''
    };
    this.chooseFile= 'Choose File';
  };

  isAllowedFile=(file,callback)=>{
    switch (file.type) {
      case 'image/jpg':
      case 'image/png':
      case 'image/jpeg':
      case 'application/png':
      case 'application/doc':
      case 'application/docx':
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.oasis.opendocument.spreadsheet':
      case 'application/ods':
      case 'application/xls':
      case 'application/xlsx':
      case 'application/msword':
        return callback(true);
      default:
        return callback(false);
    }
  }

  getAccessRightsList = () => {
    this.permission.uploadDocument = this.loginService.return_hasUploadDocumentsRights();
    console.log("Permissionsss=====",this.permission);
  }

}


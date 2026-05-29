import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DohuaGeotagService } from './dohua-geotag.service';
import { environment } from "../../../../environments/environment";
import * as _ from "underscore";
@Component({
  selector: 'app-dohua-geotag',
  templateUrl: './dohua-geotag.component.html',
  styleUrls: ['./dohua-geotag.component.css']
})
export class DohuaGeotagComponent implements OnInit {
  projectId:any;
  imageGallery:any=[];
  endpoint = "";
  isLodaing: boolean = false;
  isImageModalOpen:boolean = false;
  selectedPicture:any;
  selectedPictureIndex:any;
  constructor(
    private route: ActivatedRoute,
    private dohuaGeotagService:DohuaGeotagService
  ) { 
    this.route.paramMap.subscribe(params=>{
      this.projectId = params.get('projectId')
    });
    this.endpoint = environment.BASE_URL;
  }

  ngOnInit(): void {
    this.isLodaing=true;
    this.getDocuments();
  }

  getDocuments = () => {
    this.dohuaGeotagService.getDocumentByProjectId(
      this.projectId, (res: any) => {
        if(res.length!=0){
          this.reorderPhotos(res);
        }else{
          this.imageGallery=[];
          this.isLodaing=true;
        }
      }
    );
  };

  reorderPhotos = (docs: any) => {
    this.imageGallery = _.filter(docs, (d: any) => {
      return d.docType == "imageGallery";
    });
    this.isLodaing=false;
    console.log("IMAGEEEEEEEEEEEEEEEE", this.imageGallery);
  };

  mouseLeave = i => {
    console.log(i);
  };
  mouseEnter = i => {
    console.log(i);
  };
  onScroll(i) {
    console.log(i);
  }

  onImageClick = (pic, i) => {
    this.isImageModalOpen = true;
    this.selectedPicture = pic;
    console.log("PICCCCCC", this.selectedPicture);
    this.selectedPictureIndex = i;
  };

  changePhoto = i => {
    var imageArrayLength = this.imageGallery.length - 1;
    if (i == 1) {
      console.log("go left");
      this.selectedPictureIndex = this.selectedPictureIndex - 1;
      if (this.selectedPictureIndex < 0) {
        this.selectedPictureIndex = imageArrayLength;
      }
      if (this.selectedPictureIndex > imageArrayLength) {
        this.selectedPictureIndex = 0;
      }
      console.log(this.selectedPictureIndex);
      this.selectedPicture = this.imageGallery[this.selectedPictureIndex];
    } else {
      console.log("go right");
      this.selectedPictureIndex = this.selectedPictureIndex + 1;
      if (this.selectedPictureIndex < 0) {
        this.selectedPictureIndex = imageArrayLength;
      }
      if (this.selectedPictureIndex > imageArrayLength) {
        this.selectedPictureIndex = 0;
      }
      console.log(this.selectedPictureIndex);
      this.selectedPicture = this.imageGallery[this.selectedPictureIndex];
    }
  };
  closeModal = () => {
    this.isImageModalOpen = false;
  };

  goBack = () => {
    window.history.back();
  }

}

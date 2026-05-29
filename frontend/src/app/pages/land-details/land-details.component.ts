import { Component, EventEmitter, OnInit, Output, NgModule, } from '@angular/core';
import { LandDetailsService } from './land-details.service';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-land-details',
  templateUrl: './land-details.component.html',
  styleUrls: ['./land-details.component.css']
})
export class LandDetailsComponent implements OnInit {
  addNewLand: NgModule;
  allLandDetails: any = [];
  public landDetails: any = {
    district_name: "",
    location_name: "",
    total_land: "",
    allotable_land: "",
    land_allot: "",
    vacant_land: "",
    total_shed: "",
    shed_allot: "",
    vacant_allotable_land: "",
    vacant_shed_allot: "",
    status: "1"
  };
  public selectedLand = {
    id: "",
    district_name: "",
    location_name: "",
    total_land: "",
    allotable_land: "",
    land_allot: "",
    vacant_land: "",
    total_shed: "",
    shed_allot: "",
    vacant_allotable_land: "",
    vacant_shed_allot: "",
  };
  public isSaving: boolean = false;
  public isLodaing: boolean = true;
  @Output() added = new EventEmitter<any>();

  constructor(
    private LandDetailsService: LandDetailsService,
  ) {
    let token = JSON.parse(localStorage.getItem('token'));
    this.landDetails.accessKeyword = token.usr.accessKeyword;
    console.log("Project Details in Create Project Constructore ==================>>>", this.landDetails);

  }

  ngOnInit(): void {
    this.getLandDetails();
  }

  getLandDetails() {
    this.LandDetailsService.getLandDetails(res => {
      console.log("Res==", res);
      this.isLodaing = false;
      if (!res || res === undefined || res === null) {
        return;
      } else {
        this.allLandDetails = res;
        console.log("vvvvvvvvvvvvv", this.allLandDetails);

      }
    });
  }

  addNewLandDetails = () => {
    this.isSaving = true;
    console.log("mmmmmmmmmmmmmmmmmmmmm", this.landDetails);

    this.LandDetailsService.addLandDetails(this.landDetails, (res: any) => {
      console.log("Res=>", res);
      this.getLandDetails();
      // this.reArrangeGrid()
      let ele = document.getElementById('modalClose');
      ele.click();
      this.isSaving = false;
      this.added.emit({ response: true });
    });
  }

  // reArrangeGrid() {
  //   let landDetailsObject = {
  //     id: 26,
  //     district_name: this.landDetails.district_name,
  //     location_name: "",
  //     total_land: "",
  //     allotable_land: "",
  //     land_allot: "",
  //     vacant_land: "",
  //     total_shed: "",
  //     shed_allot: "",
  //     vacant_allotable_land: "",
  //     vacant_shed_allot: "",
  //     accessKeyword: "Rajiv Saikia, AE(C)",
  //     status: "1",
  //     createdAt: "2023-09-16T17:41:54.000Z",
  //     updatedAt: "2023-09-16T17:41:54.000Z"
  //   }
  //   this.allLandDetails.push(landDetailsObject);
  // }

  showLandUpdateModal = land => {
    console.log("Selected Project=", land);
    this.selectedLand = land;
    let deleteModal = document.getElementById("landUpdate");
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("show");
  };

  updateLand = () => {
    const requestObject = {
      landID: this.selectedLand.id,
      district_name: this.selectedLand.district_name,
      location_name: this.selectedLand.location_name,
      total_land: this.selectedLand.total_land,
      allotable_land: this.selectedLand.allotable_land,
      land_allot: this.selectedLand.land_allot,
      vacant_land: this.selectedLand.vacant_land,
      total_shed: this.selectedLand.total_shed,
      shed_allot: this.selectedLand.shed_allot,
      vacant_allotable_land: this.selectedLand.vacant_allotable_land,
      vacant_shed_allot: this.selectedLand.vacant_shed_allot,
    }
    console.log("dddddddddd", requestObject);
    this.LandDetailsService.updateLand(requestObject, (res: any) => {
      $(function () {
        $(".left-side > .danger").click();
      });
    });
  };
}

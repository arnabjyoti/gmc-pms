import { Component, OnInit } from "@angular/core";
// import * as Mgx from 'mgx';
import * as L from "leaflet";
// declare const L: any;

import { HomeService } from "../home/home.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
@Component({
  selector: "app-home-public",
  templateUrl: "./home-public.component.html",
  styleUrls: ["./home-public.component.css"]
})
export class HomePublicComponent implements OnInit {
  newMarker: any;
  row_data = [];
  map: any;
  projectsToShow = [];
  public project = [
    {
      projectId: 35,
      lat: 26.15706,
      long: 91.81154,
      name: "Udayan Path Vip Road, Near Pratiksha Hospital",
      percent: "100"
    },
    {
      projectId: 36,
      lat: 26.12898,
      long: 91.78187,
      name: "Improvement of Milanjyoti Path at Sijubari",
      percent: "100"
    },
    {
      projectId: 37,
      lat: 26.12127,
      long: 91.80236,
      name: "Tagar Path at Sourav Nagar Beltola ",
      percent: "100"
    },
    {
      projectId: 38,
      lat: 26.12977,
      long: 91.78192,
      name: "Improvement of Milanjyoti Path at Sijubari",
      percent: "100"
    },
    {
      projectId: 39,
      lat: 26.15591,
      long: 91.7993,
      name:
        "Milijuli Path(From LichuBagan Namghar Path to jayanta Gogoi House)",
      percent: "100"
    },
    {
      projectId: 41,
      lat: 26.11415,
      long: 91.80205,
      name: "Helipad Road at Trinayan Nagar",
      percent: "100"
    },
    {
      projectId: 40,
      lat: 26.12279,
      long: 91.80449,
      name: "Beltola High School Road side drain",
      percent: "100"
    },
    {
      projectId: 42,
      lat: 26.13538,
      long: 91.80149,
      name: "Chinaki Path at Rukminigaon",
      percent: "100"
    },
    {
      projectId: 43,
      lat: 26.14003,
      long: 91.79191,
      name: "Law College Road bye lane Dispur",
      percent: "100"
    },
    {
      projectId: 45,
      lat: 26.15591,
      long: 91.7993,
      name: "Namghar Path Lichubagan Remaining Portion",
      percent: "100"
    },
    {
      projectId: 49,
      lat: 26.11928,
      long: 91.8029,
      name: "Padum Path, Sourav Nagar, Beltola",
      percent: "100"
    },
    {
      projectId: 47,
      lat: 26.13416,
      long: 91.78573,
      name: "Bohagi Path bhetapara",
      percent: "100"
    },
    {
      projectId: 51,
      lat: 26.11417,
      long: 91.77989,
      name: "Improvement of Jagaran Path Bidhya Mandir Path bye at Bhetapra",
      percent: "100"
    },
    {
      projectId: 31,
      lat: 26.13352,
      long: 91.80362,
      name: "Priya Kalita Path, Rukminigaon",
      percent: "100"
    },
    {
      projectId: 52,
      lat: 26.13536,
      long: 91.79936,
      name: "Trinayan Path at Rukminigaon",
      percent: "100"
    },
    {
      projectId: 653,
      lat: 26.140858,
      long: 91.762964,
      name: "Improvement of sankar azan path kahilipara",
      percent: "12"
    }
  ];

  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit() {
    this.getProjects();
  }

  ConvertDMSToDD = (degrees, minutes, seconds, direction) => {
    let a: number;
    if (seconds == null || seconds == "") {
    }
    let v = seconds + "." + direction;
    var dd = Number(degrees) + Number(minutes) / 60 + Number(v) / (60 * 60);

    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    }
    return dd;
  };

  redirect = () => {
    this.router.navigate(["/home"]);
  };

  loadMap(lat, lon, district, percentage) {
    var greenIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    var orangeIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    var link = $('<a href="#" class="speciallink">TestLink</a>').click(() => {
      alert("test");
    })[0];
    this.map = L.map("map").setView([lat, lon], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
      this.map
    );
    
    this.projectsToShow.map(proj => {
      proj.percentageProgress = proj.percentageProgress == null? 'In Progress': proj.percentageProgress
      // if (proj.latitude != null && proj.latitude != 'NAN') {
        if (proj.latitude) {
        if (proj.status == "Completed") {
          L.marker([proj.latitude, proj.longitude], { icon: greenIcon })
            .bindPopup(
              $(
                '<div><p><a style="cursor: pointer;" class="speciallink">' +
                  proj.name +
                  "</a></p>Progress: " + proj.percentageProgress
                   +
                  "<p></p></div>"
              ).click(() => {
                this.router.navigate(["project-details", proj.id]);
              })[0]
            )
            .addTo(this.map);
        } else if (proj.status == "Ongoing") {
          L.marker([proj.latitude, proj.longitude], { icon: orangeIcon })
            .bindPopup(
              $(
                '<div><p><a style="cursor: pointer;" class="speciallink">' +
                  proj.name +
                  "</a></p>Progress: " +
                  proj.percentageProgress +
                  "<p></p></div>"
              ).click(() => {
                this.router.navigate(["project-details", proj.id]);
              })[0]
            )
            .addTo(this.map);
        }
      }
    });
  }

  getProjects = () => {
    this.homeService.getAllProjects(response => {
      this.projectsToShow = response;
      this.convert();
    });
  };

  convert = () => {
    this.projectsToShow.map((item, index) => {
      // console.log(item);
      
      if (item["file_repo.GPSLatitude"] != null) {
        let latitude = item["file_repo.GPSLatitude"].split(/[^\d\w]+/);
        let longitude = item["file_repo.GPSLongitude"].split(/[^\d\w]+/);

        latitude = this.ConvertDMSToDD(
          latitude[1],
          latitude[2],
          latitude[3],
          latitude[4]
        );
        longitude = this.ConvertDMSToDD(
          longitude[1],
          longitude[2],
          longitude[3],
          longitude[4]
        );
        this.projectsToShow[index]["latitude"] = latitude;
        this.projectsToShow[index]["longitude"] = longitude;
      } else {
        this.projectsToShow[index]["latitude"] = null;
        this.projectsToShow[index]["longitude"] = null;
      }
    });
    console.log("PROJECT", this.projectsToShow);
    this.loadMap(26.131352, 91.804413, "Six Mile", 40);
  };

  format = async (item1, item2) => {};
}

import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'ngx-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.scss']
})
export class MapviewComponent implements OnInit {
  title: string = 'GeoTag';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  public lat:any;
  public long:any;
  private geoCoder;
  
  @ViewChild('search', {static:true})
  public searchElementRef: ElementRef;
 
 
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private route: ActivatedRoute,
    public router: Router,
    private ngZone: NgZone
  ) {
      this.route.paramMap.subscribe((params) => {
			this.lat = JSON.parse(params.get('latitude'));
			this.long = JSON.parse(params.get('longitude'));
    });
    this.convertGPSToDMS(this.lat,this.long);
   }
 
   convertGPSToDMS = (lat_arr, lan_arr)=>{
    // let lat_arr = JSON.parse(lat);
		// let lan_arr = JSON.parse(long);
		this.latitude = lat_arr[0] + lat_arr[1] / 60 + lat_arr[2] / 3600;
    this.longitude = lan_arr[0] + lan_arr[1] / 60 + lan_arr[2] / 3600;
    console.log(this.latitude);
    console.log(this.longitude);
   }
 
  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.getCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
 
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
 
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
 
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          console.log(this.latitude);
          console.log(this.longitude);
          this.zoom = 12;
        });
      });
    });
  }
 
  // Get Current Location Coordinates
  private getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // this.latitude = position.coords.latitude;
        // this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
 
 
  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
 
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }
 
}
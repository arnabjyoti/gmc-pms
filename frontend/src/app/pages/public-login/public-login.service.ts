import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Callbacks } from 'jquery';
import { environment } from '../../../environments/environment';
import {AppService} from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class PublicLoginService {

  constructor(
    private http: Http,
    private appService:AppService
  ) { }


  publicLogin = (req, callback) =>{
    const ENDPOINT = `${environment.BASE_URL}/api/publicLogin`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {            
          return callback && callback(response.json());
        },
        error => {
          
          return callback && callback(error);
          
        },
        () => {
        });
  }
}

import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from "../../../environments/environment";
import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class FeedbackOverallService {

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private http: Http
  ) { }
}

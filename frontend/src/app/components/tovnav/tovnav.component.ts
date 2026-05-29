import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-tovnav',
  templateUrl: './tovnav.component.html',
  styleUrls: ['./tovnav.component.css']
})
export class TovnavComponent implements OnInit {
  public user:any;
  public shortName:any;
  public unreadMsg:any=[];
  public isCitizen:boolean = false;
  public isPublicUser:boolean = false;
  constructor(
    private appService:AppService,
    public router: Router) { }

  ngOnInit(): void {
    this.getUserDetails();
    
  }

  getUserNotes = (userId) =>{
    this.appService.getUserNotes(userId, response=>{
      if(response){
        this.unreadMsg=response;
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",this.unreadMsg);
        
      }
    })
  }

  getUserDetails = () =>{
    let token = localStorage.getItem('token');
    token = JSON.parse(token);
    if(token){
      this.user = token['usr'];
      // console.log("usr name=", this.user.role);
      this.shortName = this.user.name.substring(0, 3);
      this.getUserNotes(this.user.id);
      if(this.user.email==='ministergdd@gmail.com'){
        this.shortName='MIN';
      }
      if(this.user.email==='additionalchiefsecretary@gmail.com'){
        this.shortName='ACS';
      }
      if(this.user.email==='principalsecretary@gmail.com'){
        this.shortName='PS';
      }
      if(this.user.email==='gmcadmin@gmail.com'){
        this.shortName='ADM';
      }
      if(this.user.email==='guwahaticom@gmail.com'){
        this.shortName='COM';
      }
      if(this.user.email==='additionalcom@gmail.com'){
        this.shortName='ACOM';
      }
      if(this.user.email==='jointcom@gmail.com'){
        this.shortName='JCOM';
      }
      if(this.user.email==='gmccitizen@gmail.com' || this.user.role==='citizen'){
        this.isCitizen = true;
      }
      if(this.user.email!=='gmccitizen@gmail.com' && this.user.role==='pub'){
        this.isPublicUser = true;
      }
    }else{
      console.log("Token not");
    }
    // console.log("I AM CITIZEN",this.user);
  }

  signout = () =>{
    localStorage.removeItem('token');
    const token = localStorage.getItem('token');
    if(!token){
      // this.router.navigate(['/login']);
      window.location.href="/#/login";
      location.reload();
    }   
  }

  redirectToNotes = (projectId) =>{
    // this.router.navigate(['/add-note/'+projectId]);
    window.location.href="/#/add-note/"+projectId;
    location.reload();
    this.appService.updateNoteReadStatus(this.user.id, projectId, response=>{
      // console.log("Note Update Status",response);
    });
  }

}

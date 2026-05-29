import { Component, OnInit } from "@angular/core";
import { ProjectDetailsService } from "../../project-details.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FeedbackService } from "./feedback.service";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"]
})
export class FeedbackComponent implements OnInit {
  public projectId;
  public projectDetails = {
    name: ""
  };
  public isFeedbackEmpty: boolean=false;
  public projectObject;
  public isLoading = false;
  public feedback;
  public userId;
  public role:any;
  public projectFeedbacks;
  public isCitizen:boolean = false;
  constructor(
    private projectDetailsService: ProjectDetailsService,
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    public router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
    });
  }

  ngOnInit(): void {
    this.getProjectById();
    this.getUserDetails();
  }

  getUserDetails = () => {
    let user = JSON.parse(localStorage.getItem('token'));
    if(user){
      this.userId = user.usr.id;
      this.role = user.usr.role;
      console.log("USERRR=",this.role );
      this.getFeedbackForProject();
      if(user.usr.role === 'mla'){
        this.isCitizen = true;
      }else{
        this.isCitizen = false;
      }
    }
  };

  goToRegistration = () =>{
    this.router.navigateByUrl("/registration");
  }

  getProjectById = () => {
    if (this.projectId) {
      this.projectDetailsService.getProjectById(this.projectId, (res: any) => {
        this.projectObject = res;
        this.projectDetails = this.projectObject["project"];
      });
    } else {
      console.log("Oopse!! Something went wrong");
    }
  };

  getFeedbackForProject = () => {
    this.feedbackService.getFeedbackForProject(this.projectId, response => {
      if (response.length > 0) {
        this.isFeedbackEmpty=false;
        console.log("userRole==",this.role)
        if(this.role ==='pub'){
          console.log("feedback===",response)
          
          let f = [];
          response.map(item=>{
            console.log(item);
            if(item.user.role === this.role && item.userId === this.userId){
              f.push(item);
            }
          });
          this.projectFeedbacks = f;
        }else{
          this.projectFeedbacks = response;
        }
      }
      else{
        this.isFeedbackEmpty=true
      }
    });
  };

  submitFeedback = () => {
    console.log(this.feedback);
    let requestObject = {
      projectId: this.projectId,
      userId: this.userId,
      feedback: this.feedback
    };
    this.feedbackService.saveFeedback(requestObject, response => {
      console.log(response);
      if (response.message == "ok") {
        $(function() {
          $(".left-side > .danger").click();
        });
        this.projectFeedbacks = "";
        this.getFeedbackForProject();
      }
    });
  };
}

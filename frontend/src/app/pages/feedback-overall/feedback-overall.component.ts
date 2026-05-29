import { Component, OnInit } from "@angular/core";
import { FeedbackService } from "../project/project-details/components/feedback/feedback.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-feedback-overall",
  templateUrl: "./feedback-overall.component.html",
  styleUrls: ["./feedback-overall.component.css"]
})
export class FeedbackOverallComponent implements OnInit {
  public projectId;
  public projectDetails = {
    name: ""
  };
  public projectObject;
  public isLoading = false;
  public feedback;
  public userId;
  public role;
  public overallFeedbacks;
  constructor(
    private feedbackService: FeedbackService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get("projectId");
    });
  }

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId = () => {
    let user = JSON.parse(localStorage.getItem("token"));
    if (user) {
      this.userId = user.usr.id;
      this.role = user.usr.role;
      if (this.role !== 'citizen') {
        this.getFeedback();
      }
    }
  };

  getFeedback = () => {
    this.feedbackService.getFeedback(response => {
      if (response) {
        console.log("userRole==", this.role)
        if (this.role === 'usr') {
          console.log("feedback===", response)
          let f = [];
          response.map(item => {
            console.log(item);
            if (item.user.role === this.role && item.userId === this.userId) {
              f.push(item);
            }
          });
          this.overallFeedbacks = f;
        } else {
          this.overallFeedbacks = response;
        }
      }
    });
  };

  submitFeedback = () => {
    let requestObject = {
      projectId: null,
      userId: this.userId,
      feedback: this.feedback
    };
    this.feedbackService.saveFeedback(requestObject, response => {
      if (response.message == "ok") {
        $(function () {
          $(".left-side > .danger").click();
        });
        this.overallFeedbacks = "";
        this.getFeedback();
      }
    });
  };
}

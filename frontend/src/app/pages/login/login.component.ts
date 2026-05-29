import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "./login.service";
import { CountdownConfig } from 'ngx-countdown';
import { format } from 'date-fns';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: []
})

export class LoginComponent implements OnInit {

  Date1: Date = new Date();
  LocalDate : String = new Date().toLocaleString();

  projectCountRec: any;
  totalprojectcount: number = 0;
  totalprojectcountstop:any = setInterval(()=>{
    this.totalprojectcount++;
    if(this.totalprojectcount ==   (this.ongoingCount+this.completedCount))
    {
      clearInterval(this.totalprojectcountstop);
    }
  },1)

  og: number = 0;
  ogstop:any = setInterval(()=>{
    this.og++;
    if(this.og == 30)
    {
      clearInterval(this.ogstop);
    }
  },1)

 completedprojectcount: number = 0;
  completedprojectcountstop:any = setInterval(()=>{
    this.completedprojectcount++;
    if(this.completedprojectcount == this.completedCount)
    {
      clearInterval(this.completedprojectcountstop);
    }
  },1)

  public isLogin: boolean = false;
  public userCredentials = {
    email: "",
    password: ""
  };
  allProjects:any;
  ongoingCount:number=0;
  completedCount:number=0;
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.init();
  }
  init = () =>{
    this.projectCount();
  }

  ngOnInit(): void {
    this.fireTimer();
    // this.getAllProjects();
    
  }
  projectCount = () => {
    this.loginService.projectCount(res => {
      
      this.projectCountRec = res;
    });
  }

  getAllProjects = () => {
    this.loginService.getAllProjects(res => {
      
      if (!res || res === undefined || res === null) {
        //do something
      } else {
        this.allProjects = res;
        console.log("All projects=", res);
        // this.tempstore = this.allProjects;
        this.projectFilterization();
      }
    });
  };

  projectFilterization = () => {
    this.allProjects.map(item => {
      if (item.status === "Ongoing") {
        this.ongoingCount++;
      }
      
    });
    this.allProjects.map(item => {
      if (item.status === "Completed") {
        this.completedCount++;
      } 
    });
    console.log("Ongoing=", this.ongoingCount );
    console.log("Completed=", this.completedCount );
    
  };

  

  fireTimer = () =>{
    var countDownDate = new Date("Dec 10, 2021 10:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById("demo").innerHTML ="Launching time remaining: "+ days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    // document.getElementById("demo").innerHTML = "EXPIRED";
    document.getElementById("demo").innerHTML = "Launched on Dec 10, 2021";
  }
}, 1000);
  }

  guestLogin = () => {
    this.router.navigate(["public-login"]);
  };

  setCache = async () => {
    const newCache = await caches.open("new-cache");
    let obj = {
      id: 1,
      name: "Pragyan"  
    };
    newCache.add("yes");
  };


  publicSiteView = () =>{
    let requestObject={
      email: 'gmccitizen@gmail.com',
      password: 'password'
    }
    this.loginService.loginVerify(requestObject, (res: any) => {
      this.isLogin = false;
      if (res.status == true) {
        let data = res.message;
        const userid = data.usr.email;
        localStorage.setItem("token", JSON.stringify(data));
        //  this.router.navigate(['/home']);
        window.location.href = "/#/home";
        location.reload();
      } else if (res.status == false) {
        if (res.type == "password") {
          this.toastr.error(
            "Please enter a valid password.",
            "Wrong password!",
            {
              disableTimeOut: false
            }
          );
        } else {
          this.toastr.error(
            "User with this Email cannot be found.",
            "Wrong email!",
            {
              disableTimeOut: false
            }
          );
        }
      }
    });
  }

  login = () => {
    if (this.userCredentials.email == "") {
      this.toastr.error("Please enter email id.", "Blank email", {
        disableTimeOut: false
      });
    } else if (this.userCredentials.password == "") {
      this.toastr.error("Please enter your password.", "Blank password", {
        disableTimeOut: false
      });
    } else {
      this.isLogin = true;
      const requestObject = {
        email: this.userCredentials.email,
        password: this.userCredentials.password
      };

      this.loginService.loginVerify(requestObject, (res: any) => {
        this.isLogin = false;
        if (res.status == true) {
          let data = res.message;
          const userid = data.usr.email;
          localStorage.setItem("token", JSON.stringify(data));
          this.setCache();
          //  this.router.navigate(['/home']);
          window.location.href = "/#/home";
          location.reload();
        } else if (res.status == false) {
          if (res.type == "password") {
            this.toastr.error(
              "Please enter a valid password.",
              "Wrong password!",
              {
                disableTimeOut: false
              }
            );
          } else {
            this.toastr.error(
              "User with this Email cannot be found.",
              "Wrong email!",
              {
                disableTimeOut: false
              }
            );
          }
        }
      });
    }
  };
}

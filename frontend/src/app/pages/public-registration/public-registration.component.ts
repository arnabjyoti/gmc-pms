import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { PublicRegistrationService } from "./public-registration.service";
import { PublicLoginService } from "../public-login/public-login.service";

@Component({
  selector: "app-public-registration",
  templateUrl: "./public-registration.component.html",
  styleUrls: ["./public-registration.component.css"],
  providers: [PublicRegistrationService]
})
export class PublicRegistrationComponent implements OnInit {
  public isRegister: boolean = false;
  public userDetails = {
    name: "",
    address: "",
    email: "",
    phone: "",
    role: ""
  };
  public OTP = {
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: ""
  };
  showOTPInput: boolean = false;
  mat0: any;
  mat1: any;
  mat2: any;
  mat3: any;
  mat4: any;
  Roles: any = ["Admin", "Author", "Reader"];
  constructor(
    private publicRegistrationService: PublicRegistrationService,
    private toastr: ToastrService,
    private router: Router,
    private publicLoginService: PublicLoginService
  ) {}

  ngOnInit(): void {}

  next() {
    this.mat0 = Math.floor(Math.random() * 9 + 1);
    this.mat1 = Math.floor(Math.random() * 9 + 1);
    this.mat2 = Math.floor(Math.random() * 9 + 1);
    this.mat3 = Math.floor(Math.random() * 9 + 1);
    this.mat4 = Math.floor(Math.random() * 9 + 1);

    let regExp = /^[0-9]{10}$/;
    let regExp_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regExp.test(this.userDetails.phone)) {
      //alert('Enter your 10 digit phone number')
      this.toastr.error("Enter your 10 digit phone number", "Warning");
    } else if (!regExp_email.test(this.userDetails.email)) {
      //alert('Enter valid email adress')
      this.toastr.error("Enter valid email address", "Warning");
    } else {
      this.getOTP();
    }
  }

  async getOTP() {
    this.publicRegistrationService.getOTP(this.userDetails, res => {
      console.log("REsponse===", res);
      if (res.type === "success") {
        this.showOTPInput = true;
      } else {
        this.toastr.error(
          "Oops! Something went wrong. Please try again",
          "Warning"
        );
      }
    });
  }

  verifyOtpData() {
    let otp =
      String(this.OTP.otp1) +
      String(this.OTP.otp2) +
      String(this.OTP.otp3) +
      String(this.OTP.otp4) +
      String(this.OTP.otp5);
    let requestObject = {
      phone: this.userDetails.phone,
      otp: otp
    };
    this.publicRegistrationService.verifyOtp(requestObject, response => {
      if (response.type !== "error") {
        this.registerMe();
      } else {
        this.toastr.error(response.message, "Warning");
      }
    });
  }

  registerMe = () => {
    let requestObject = this.userDetails;
    this.publicRegistrationService.registerCitizen(requestObject, response => {
      if (response.status === true) {
        if (response.type === "success") {
          let req = {
            phone: this.userDetails.phone
          };
          this.publicLoginService.publicLogin(req, res => {
            console.log(res);
            if (res.status === true) {
              let data = res.message;
              const userid = data.usr.email;
              localStorage.setItem("token", JSON.stringify(data));
              window.location.href = "/#/home";
              // this.router.navigate(["/home"]);
              window.location.reload()
            } else {
              this.toastr.error("Phone number not registered", "Warning");
            }
          });
          // this.router.navigate(["/home"]);
        } else if (response.type === "exist") {
          this.toastr.error("Already registered", "Warning");
        } else {
          this.toastr.error("Something went wrong.", "Warning");
        }
      } else {
        this.toastr.error("Something went wrong.", "Warning");
      }
    });
  };

  cancelRegistration = () => {
    this.router.navigate(["/home"]);
  };
}

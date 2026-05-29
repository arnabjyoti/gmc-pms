import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { PublicLoginService } from "./public-login.service";
import { PublicRegistrationService } from "../public-registration/public-registration.service";

@Component({
  selector: "app-public-login",
  templateUrl: "./public-login.component.html",
  styleUrls: ["./public-login.component.css"],
  providers: [PublicLoginService]
})
export class PublicLoginComponent implements OnInit {
  public isLogin: boolean = false;
  public userPhone: any;
  public isVerify = false;
  public OTP = {
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: ""
  };
  public showOTPInput = false;
  constructor(
    private publicLoginService: PublicLoginService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private publicRegistrationService: PublicRegistrationService
  ) {}

  ngOnInit(): void {}

  publicLogin = () => {
    console.log("login callllllllllllllllllllllllllllllll");
    
    let regExp = /^[0-9]{10}$/;
    if (!regExp.test(this.userPhone)) {
      this.toastr.error("Enter your 10 digit phone number", "Warning");
    } else {
      console.log("Phone", this.userPhone);
      let req = {
        phone: this.userPhone
      };
      this.publicLoginService.publicLogin(req, res => {
        console.log(res);
        if (res.status === true) {
          let data = res.message;
          const userid = data.usr.email;
          localStorage.setItem("token", JSON.stringify(data));
          //  this.router.navigate(['/home']);
          this.getOTP();
          // window.location.href = "/#/home";
          // location.reload();
        } else {
          this.toastr.error("Phone number not registered", "Warning");
        }
      });
    }
  };

  async getOTP() {
    let userDetails = {
      phone: this.userPhone
    };
    this.publicRegistrationService.getOTP(userDetails, res => {
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
    this.isVerify = true
    let otp =
      String(this.OTP.otp1) +
      String(this.OTP.otp2) +
      String(this.OTP.otp3) +
      String(this.OTP.otp4) +
      String(this.OTP.otp5);
    let requestObject = {
      phone: this.userPhone,
      otp: otp
    };
    console.log("requestObject==", requestObject);
    this.publicRegistrationService.verifyOtp(requestObject, response => {
      console.log("ResponseVerifyOtp==", response);
      if (response.type !== "error") {
        window.location.href = "/#/home";
        location.reload();
      } else {
        this.toastr.error(response.message, "Warning");
      }
    });
  }

  publicRegistration = () => {
    this.router.navigate(["/registration"]);
  };
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from './reset-password.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public reset: FormGroup;
  public userId;
  public isLodaing : boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private resetPasswordService:  ResetPasswordService
  ) { }

  ngOnInit(): void {
    this.reset = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      cPassword: new FormControl(null, [Validators.required])
    })
    this.userId = JSON.parse(localStorage.getItem('token')).usr.id;
  }
  //   PostData(resetForm: any)
  // {
  //   let OldPassword = resetForm.controls.oldPassword.value;
  //   let Password = resetForm.controls.password.value;
  //   let ConfirmPassword = resetForm.controls.cPassword.value;
  //   console.log(resetForm.controls);
  // }

  get resetForm() {
    return this.reset.controls;
  }

  submit() {
    if (this.resetForm.password.value == this.resetForm.cPassword.value) {
      console.log("Password Value",this.reset.value);
      let requestObject= {
        password: this.reset.get('password').value,
        id: this.userId
      }
      this.resetPasswordService.resetPassword(requestObject, (data:any) => {
        if(data) {
          this.router.navigate(['']);
        }
      })
    }
    else {
      this.toastr.error('Password and Confirm Password did not matched', 'Please check', {
        disableTimeOut: false
      });
    }
  }
  gotohome()
{
  this.router.navigate(['']);
}
}


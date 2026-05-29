import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { AppService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [AppService]
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean = false;
  title = "AUIIP";

  constructor(
    private appService: AppService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }
}

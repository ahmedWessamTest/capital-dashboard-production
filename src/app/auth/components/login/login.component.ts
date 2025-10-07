import { CommonModule, isPlatformBrowser } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerModule } from "ngx-spinner";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { DashboardFooterComponent } from "../../../pages/dashboard/dashboard-footer/dashboard-footer.component";
import { AuthService } from "../../services/auth.service";
import { TokenService } from "../../../core/services/token/token-service.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    DashboardFooterComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  userData: FormGroup;
  isErrorMessage: boolean = false;
  isLoading: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private _PLATFORM_ID: Object,
    private authService: AuthService,
    private _Router: Router,
    private tokenService: TokenService,
  ) {
    this.userData = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      rememberMe: new FormControl(false),
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) {
        this.userData.controls['email'].setValue(savedEmail);
        this.userData.controls['rememberMe'].setValue(true);
        this.userData.updateValueAndValidity();
      }
    }
  }
  onSignInFormSubmitClick() {
    this.isErrorMessage = false;
    this.isLoading = true;
    this.userData.markAllAsTouched();
  
    if (this.userData.valid) {
      const { email, password, rememberMe } = this.userData.value;
  
      if (isPlatformBrowser(this._PLATFORM_ID)) {
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
      }
  
      let userData = { email, password };
      this.authService.login(userData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.error || response.ar_error) {
            this.isErrorMessage = true;
            return;
          }
          if (response.access_token && ['admin', 'employee'].includes(response.user.role)) {
            if (isPlatformBrowser(this._PLATFORM_ID)) {
              localStorage.setItem('user', JSON.stringify(response.user));
              localStorage.setItem('token', JSON.stringify(response.access_token));
              this.tokenService.setToken(response.access_token, response.expires_in);            }
            this._Router.navigate(['/dashboard/home-statistics']);
          } else {
            this.isErrorMessage = true;
            this.isLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.isErrorMessage = true;
        },
      });
    } else {
      this.isLoading = false;
    }
  }
}
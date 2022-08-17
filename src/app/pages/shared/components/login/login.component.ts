declare var $: any;
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import { environment } from "../../../../../environments/environment";
import { CommonHelperService } from "../../../../services/common-helper.service";
import {CustomValidators} from "../../directives/custom-validator";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public configOptions = {
    length: 6,
    inputClass: "digit-otp",
  };
  otp!: string;
  inputDigitsLeft: string = "Verify COde";
  btnStatus: string = "btn-light";
  showOtpScreen: boolean = true;
  siteKey: string = environment.CAPTCHA_SITEKEY;
  enableCaptcha = environment.ENABLE_CAPTCHA ;
  loginForm: FormGroup;
  responseMessage;
  setUserNameClass;
  setPasswordClass;
  selectedLang = localStorage.getItem("lang") || "en";
  showLangButtons = environment.SHOWLANGBUTTON;
  loginHeaderLogo;
  loginFooterLogo = "";
  showButton: boolean = false;
  enableResendOTP = false;
  timer = "02:00";
  showPage = "forgotPassword";
  passwordRegex;

  showEye: Boolean = false;
  AuthenticationFactorRequired: Boolean = true;
  passwordRegexMessage;
  messages;
  setOTPClass;
  interval: any;

  constructor(
    private formBuilder: FormBuilder,
    private commonHelper: CommonHelperService,
    private router: Router,
    private translate: TranslateService
  ) {
    if (
      localStorage.getItem("authToken") &&
      localStorage.getItem("passwordExpired") == "false" &&
      localStorage.getItem("twoFactor") == "true"
    ) {
      this.router.navigate(["backoffice/home"]);
    } else if (
      localStorage.getItem("authToken") &&
      localStorage.getItem("passwordExpired") == "true"
    ) {
      this.router.navigate(["change_password"]);
    }
    this.commonHelper.setLogosConfiguration();
    this.commonHelper.loginHeaderLogo.subscribe((res) => {
      this.loginHeaderLogo = res;
    });
    this.commonHelper.loginFooterLogo.subscribe((res) => {
      this.loginFooterLogo = res;
    });
  }

  ngOnInit() {
    this.showOtpScreen = true;
    this.loginForm = this.formBuilder.group({
      userName: ["", CustomValidators.required],
      password: ["", CustomValidators.required],
      OTP: [""],
      recaptcha: [""],
    });
    if (this.enableCaptcha === true) {
      this.loginForm.get("recaptcha").setValidators([Validators.required]);
      this.loginForm.get("recaptcha").updateValueAndValidity();
    }
    this.loginForm.valueChanges.subscribe((res) => {
      this.responseMessage = "";
    });
  }

  authenticate() {
    if (this.loginForm.valid) {
      const requestData = {
        username: this.loginForm.controls.userName.value,
        password: this.loginForm.controls.password.value,
      };
      clearInterval(this.interval)
      this.setTimer();
      this.commonHelper.validateUserFor2FA(requestData).subscribe(res => {
        if (res.statusCode == 0) {
          let authConfig = res.data;
          if (authConfig['twoFactorAuthReq'].toLowerCase() == 'yes') {
            this.showOtpScreen = false;
          } else {
            this.proceedLogin();
          }
          console.log("Response ::", res);

        } else {
          this.responseMessage = res.message;
        }

      });

    } else {
      this.commonHelper.validateAllFormFields(this.loginForm);
      this.responseMessage = "";
    }
  }

  setLang(lang) {
    this.selectedLang = lang;
    localStorage.setItem("lang", lang);
    $(window).trigger("changeLang", []);
  }

  setClass(field) {
    if (field == "userName") {
      this.setUserNameClass = true;
    }
    if (field == "password") {
      this.setPasswordClass = true;
    }
    if (field == "OTP") {
      this.setOTPClass = true;
    }
  }
  submitOTP() {
    console.log("SUbmit OTp button clicked");
  }
 
  reloadCurrentPage() {
    clearInterval(this.interval);
    this.responseMessage = '';
    this.ngOnInit();
  }
  setTimer() {
    this.timer = "02:00";
    this.enableResendOTP = false;

    this.interval = setInterval(() => {
      let timer = this.timer.split(":");
      let minutes: any = timer[0];
      let seconds: any = timer[1];
      seconds -= 1;
      if (minutes < 0) return;
      else if (seconds < 0 && minutes != 0) {
        minutes -= 1;
        seconds = 59;
      } else if (seconds < 10 && seconds.toString.length != 2)
        seconds = "0" + seconds;

      this.timer = minutes + ":" + seconds;

      if (minutes == 0 && seconds == 0) {
        this.enableResendOTP = true;
        clearInterval(this.interval);
      }
    }, 1000);
  }
 

  removeClass(field) {
    if (field == "userName" && !this.loginForm.get("userName").value) {
      this.setUserNameClass = false;
    }
    if (field == "password" && !this.loginForm.get("password").value) {
      this.setPasswordClass = false;
    }
    if (field == "OTP" && !this.loginForm.get("OTP").value) {
      this.setOTPClass = false;
    }
  }

  showPassword() {
    this.showButton = !this.showButton;
    this.showEye = !this.showEye;
  }
  sendOTP() {
    this.responseMessage = '';
    clearInterval(this.interval)
    this.setTimer();
    if (this.loginForm.valid) {
      const requestData = {
        username: this.loginForm.controls.userName.value
      };
      console.log(requestData.username + "THis is username ");
      this.commonHelper.sendOtpFor2FA(requestData)
        .subscribe((res) => {
          if (res.statusCode == 0) {
            this.showOtpScreen = false;
            // console.log(JSON.stringify(res) + "This is otp response");
          } else {
            this.responseMessage = res.message;
          }
        },error => {
        this.responseMessage = this.commonHelper.getCustomMessages('somethingWentWrong');
      });
    }
  }

  validateOtp() {
    if (this.loginForm.valid) {
      const requestData = {
        username: this.loginForm.controls.userName.value,
        otp: this.loginForm.controls.OTP.value
      };
      this.commonHelper.validateOtpFor2FA(requestData)
        .subscribe((res) => {
          if (res.statusCode == 0) {
            this.proceedLogin();
          } else {
            console.log(
              JSON.stringify(res) + "THis is validate otp Fail response"
            );
            this.responseMessage = res.message;
          }
        });
    }
  }

  proceedLogin() {
    if (this.loginForm.valid) {
      const requestData = {
        username: this.loginForm.controls.userName.value,
        password: this.loginForm.controls.password.value,
      };
      this.commonHelper.getToken(requestData).subscribe(
        (res) => {
          if (res.statusCode == 0) {
            localStorage.setItem("passwordExpired", res.passwordExpired);
            localStorage.setItem("authToken", res.authToken);
            localStorage.setItem("expiryTime", res.expiryTime);
            localStorage.setItem("userId", res.userId);
            if (res.passwordExpired) {
              this.router.navigate(["/change_password"]);
            } else {
              this.router.navigate(["backoffice/home"]);
            }
          } else {
            this.responseMessage = res.message;
          }
        },
        (error) => {
          this.responseMessage = "No Internet Connection";
        }
      );
    } else {
      this.commonHelper.validateAllFormFields(this.loginForm);
      this.responseMessage = "";
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { CommonHelperService } from '../../../../services/common-helper.service';

import { CustomValidators } from '../../directives/custom-validator';
declare var $: any;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassword: FormGroup
  selectedLang = localStorage.getItem('lang') || 'en';
  timer = '02:00'
  responseMessage;
  enableResendOTP = false
  mobileCode = environment.MOBILECODE;
  loginHeaderLogo
  loginFooterLogo
  showPage = 'forgotPassword'
  showLangButtons = environment.SHOWLANGBUTTON;
  showButton: Boolean = false;
  showEye: Boolean = false;
  showButtonConfirm: Boolean = false;
  showEyeConfirm: Boolean = false;
  passwordRegexMessage;
  messages;
  passwordRegex;
  mobileMaxLength = environment.MOBILE_MAX_LENGTH;
  mobileMinLength = environment.MOBILE_MIN_LENGTH;
  patternRegex: any;
  otpMaxLength:number;

  selectedField = { 'keyValue': '', 'keyName': '' };
  selectData = [];
  setUserNameClass;
  setMobileNoClass;
  setFieldClass;
  setPasswordClass;
  setConfirmPasswordClass;
  setOTPClass;
  customMessages;
  canSee: boolean = false;
  constructor(private fb: FormBuilder, private commonHelper: CommonHelperService) {
    this.commonHelper.setLogosConfiguration()
    this.commonHelper.loginHeaderLogo.subscribe(res => {
      this.loginHeaderLogo = res
    })
    this.commonHelper.loginFooterLogo.subscribe(res => {
      this.loginFooterLogo = res;
    })
    this.commonHelper.getMessages.subscribe(res => {
      this.customMessages = res;
      this.selectData = [{
        keyValue: 'emailId',
        keyName: this.customMessages['emailId']
      }, {
        keyValue: 'mobileNumber',
        keyName: this.customMessages['mobileNumber']
      }
      ];
    })
  }

  ngOnInit() {
    this.forgotPassword = this.fb.group({
      userName: ['', CustomValidators.required],
      // mobileNo: ['', CustomValidators.required],
      OTP: ['', CustomValidators.required],
      newPassword: ['', CustomValidators.required],
      confirmPassword: ['', CustomValidators.required],
      mobileCode: [this.mobileCode[0]],
      selectedField: ['', CustomValidators.required],
      fieldValue: [''],
    })


    this.commonHelper.makeRequest({}, 'getConfigValues', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.otpMaxLength=res.data.OTP_LENGTH;
        let mobileCodeString = res.data.COUNTRY_CODES;
        this.mobileCode = mobileCodeString.split(',');
        this.forgotPassword.patchValue({ mobileCode: this.mobileCode[0] });
      } else {
        this.responseMessage = res.message;
      }
    });


    this.forgotPassword.valueChanges.subscribe(res => {
      this.responseMessage = ''
    })

    // setTimeout(() => {
    //   [this.passwordRegexMessage, this.messages] = this.commonHelper.checkRegex(environment.PASSWORD_REGEX);
    // }, 100)

    this.forgotPassword.get('selectedField').valueChanges.subscribe(selectedField => {
      this.selectedField = selectedField;
      this.patternRegex = ' ';
      this.forgotPassword.get('fieldValue').patchValue('');
      this.commonHelper.clearValidators.call(this, 'forgotPassword', ['fieldValue']);
      this.forgotPassword.get('fieldValue').markAsUntouched();

      if (selectedField == 'mobileNumber') {
        this.forgotPassword.get('fieldValue').setValidators([Validators.required])
        this.forgotPassword.get('fieldValue').updateValueAndValidity();
      }

      if (selectedField == 'emailId') {
        this.patternRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$'
        this.forgotPassword.get('fieldValue').setValidators([Validators.required, Validators.pattern(this.patternRegex)])
        this.forgotPassword.get('fieldValue').updateValueAndValidity();
      }

    })
  }

  setLang(lang) {
    this.selectedLang = lang
    localStorage.setItem('lang', lang);
    $(window).trigger('changeLang', []);
  }

  setClass(field) {
    if (field == 'userName') {
      this.setUserNameClass = true
    }
    if (field == 'fieldValue') {
      this.setMobileNoClass = true
    }
    if (field == 'selectedField') {
      this.setFieldClass = true
    }
    if (field == 'newPassword') {
      this.setPasswordClass = true
    }
    if (field == 'confirmPassword') {
      this.setConfirmPasswordClass = true
    }
    if (field == 'OTP') {
      this.setOTPClass = true
    }
  }
  removeClass(field) {
    if (field == 'userName' && !this.forgotPassword.get('userName').value) {
      this.setUserNameClass = false
    }
    if (field == 'fieldValue' && !this.forgotPassword.get('fieldValue').value) {
      this.setMobileNoClass = false
    }
    if (field == 'selectedField' && !this.forgotPassword.get('selectedField').value) {
      this.setFieldClass = false
    }
    if (field == 'newPassword' && !this.forgotPassword.get('newPassword').value) {
      this.setPasswordClass = false
    }
    if (field == 'confirmPassword' && !this.forgotPassword.get('confirmPassword').value) {
      this.setConfirmPasswordClass = false
    }
    if (field == 'OTP' && !this.forgotPassword.get('OTP').value) {
      this.setOTPClass = false
    }
  }

  sendOTP() {
    this.responseMessage = ''
    if (this.forgotPassword.get('userName').valid && this.forgotPassword.get('fieldValue').valid && this.forgotPassword.get('selectedField').valid) {
      const data = {
        userName: this.forgotPassword.get('userName').value,
        // mobileCode: this.forgotPassword.get('mobileCode').value,
        // mobileNumber: this.forgotPassword.get('mobileNo').value,
      }
      if (this.forgotPassword.get('selectedField').value == "mobileNumber") {
        data["mobileNumber"] = this.forgotPassword.get('fieldValue').value;
        data["mobileCode"] = this.forgotPassword.get('mobileCode').value;
      }
      if (this.forgotPassword.get('selectedField').value == "emailId") {
        data["emailId"] = this.forgotPassword.get('fieldValue').value;
      }

      this.commonHelper.initiateForgotPassword(data).subscribe(res => {
        if (res.statusCode == 0) {
          this.showPage = 'enterOTP'
          this.messages = Object.values(res.data.description);
          this.passwordRegex = res.data.regex;
          this.setTimer()
        }
        else {
          this.responseMessage = res.message;
        }

      }, error => {
        this.responseMessage = this.commonHelper.getCustomMessages('somethingWentWrong');
      })
    } else {
      this.commonHelper.validateAllFormFields(this.forgotPassword);
    }
  }


  submitOTP() {
    if (this.forgotPassword.valid) {
      if (this.forgotPassword.get('confirmPassword').value != this.forgotPassword.get('newPassword').value) {
        this.responseMessage = this.commonHelper.getCustomMessages('new&ConfirmPasswordDoNotMatch');
        return;
      }
      const data = {
        'confirmNewPassword': this.forgotPassword.get('confirmPassword').value,
        // 'mobileCode': this.forgotPassword.get('mobileCode').value,
        // 'mobileNumber': this.forgotPassword.get('mobileNo').value,
        'newPassword': this.forgotPassword.get('newPassword').value,
        'otp': this.forgotPassword.get('OTP').value,
        'userName': this.forgotPassword.get('userName').value
      }
      if (this.forgotPassword.get('selectedField').value == "mobileNumber") {
        data["mobileNumber"] = this.forgotPassword.get('fieldValue').value;
        data["mobileCode"] = this.forgotPassword.get('mobileCode').value;
      }
      if (this.forgotPassword.get('selectedField').value == "emailId") {
        data["emailId"] = this.forgotPassword.get('fieldValue').value;
      }
      this.commonHelper.resetPassword(data).subscribe(res => {
        if (res.statusCode == 0) {
          this.showPage = 'newPassword'
        } else {
          this.responseMessage = res.message
        }
      })
    } else {
      this.commonHelper.validateAllFormFields(this.forgotPassword);
    }
  }

  setTimer() {
    this.timer = '02:00'
    this.enableResendOTP = false;
    let interval = setInterval(() => {
      let timer = this.timer.split(':');
      let minutes: any = (timer[0]);
      let seconds: any = (timer[1]);
      seconds -= 1;
      if (minutes < 0) return;
      else if (seconds < 0 && minutes != 0) {
        minutes -= 1;
        seconds = 59;
      }
      else if (seconds < 10 && seconds.toString.length != 2) seconds = '0' + seconds;

      this.timer = (minutes + ':' + seconds);

      if (minutes == 0 && seconds == 0) {
        this.enableResendOTP = true;
        clearInterval(interval)
      };
    }, 1000);
  }

  showPassword(type) {
    if (type == 'password') {
      this.showButton = !this.showButton;
      this.showEye = !this.showEye;
    } else {
      this.showButtonConfirm = !this.showButtonConfirm;
      this.showEyeConfirm = !this.showEyeConfirm;
    }
  }


  show(e: any) {
    this.canSee = true;
  }

  hide(e: any) {
    this.canSee = false;
  }
}

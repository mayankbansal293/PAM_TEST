import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonHelperService } from '../../../../services/common-helper.service';
import { CustomValidators } from '../../directives/custom-validator';
import { Router } from '@angular/router';
import { IframeUrlService } from '../../../../services/iframeUrlService';
// import { IframeUrlService } from '../../../../services/iframeUrlService';
declare var $: any;
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  changePasswordForm: FormGroup
  responseMessage: any;
  errorMessage: any;
  passwordRegex;
  passwordRegexMessage;
  messages;
  navigationSubscription;
  showButton: Boolean = false;
  showEye: Boolean = false;
  setPasswordClass;
  showEyeConfirm: Boolean = false;
  showButtonConfirm: Boolean = false;
  passwordExpired = localStorage.getItem('passwordExpired');
  constructor(private fb: FormBuilder, private commonHelper: CommonHelperService,
    private router: Router, private iframeService: IframeUrlService) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
    });
     if (!localStorage.getItem('authToken') ) {
      this.router.navigate(['/signin']);
    }
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', CustomValidators.required],
      newPassword: ['', CustomValidators.required],
      conNewPassword: ['', CustomValidators.required]
    })
    this.iframeService.showMenuFromPasswordPage();
    this.iframeService.setIndex();
    
    if(localStorage.getItem('domainId')){
      const requestData =  { token: localStorage.getItem('authToken'),
      domainId: localStorage.getItem('accessSelfDomainOnly') == 'YES' ? localStorage.getItem('domainId') : 'ALL' 
     }
     this.commonHelper.makeRequest(requestData, 'getDomainList', true).subscribe(res => {
       if (res.statusCode == 0) {
         this.passwordRegex = res.data[0].PASSWORD_REGEX;
         let req = { 
           token: localStorage.getItem('authToken'),
           policyId: res.data[0].PASSWORD_POLICY_ID}
     
           this.commonHelper.makeRequest(req, 'getPasswordDescription', true).subscribe(res => {
             if (res.statusCode == 0) {
               this.messages = Object.values(res.data);
             } else {
               this.errorMessage = res.message;
               this.commonHelper.animateMessage.call(this, "containerWrap");
             }
           })
       }
       
     })
    }else{
    this.commonHelper.getLoginData({token: localStorage.getItem('authToken')}).subscribe(res => {
      if (res.statusCode == 0) {
        localStorage.setItem('domainId', res.data.domainId)
        localStorage.setItem('accessSelfDomainOnly', res.data.accessSelfDomainOnly)
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('orgTypeCode', res.data.orgTypeCode)
        localStorage.setItem('orgId', res.data.orgId)

      const requestData =  { token: localStorage.getItem('authToken'),
       domainId: localStorage.getItem('accessSelfDomainOnly') == 'YES' ? localStorage.getItem('domainId') : 'ALL' 
      }
      
      this.commonHelper.makeRequest(requestData, 'getDomainList', true).subscribe(res => {
        if (res.statusCode == 0) {
          this.passwordRegex = res.data[0].PASSWORD_REGEX;
          let req = { 
            token: localStorage.getItem('authToken'),
            policyId: res.data[0].PASSWORD_POLICY_ID}
      
            this.commonHelper.makeRequest(req, 'getPasswordDescription', true).subscribe(res => {
              if (res.statusCode == 0) {
                this.messages = Object.values(res.data);
              } else {
                this.errorMessage = res.message;
                this.commonHelper.animateMessage.call(this, "containerWrap");
              }
            })
        }
        
      })
    }
    })
  }

    
  }


  changePassword() {
    if (this.changePasswordForm.get('conNewPassword').value != this.changePasswordForm.get('newPassword').value) {
      this.errorMessage = this.commonHelper.getCustomMessages('new&ConfirmPasswordDoNotMatch');
      this.commonHelper.animateMessage.call(this, 'containerWrap')
      return;
    }
    let request = {
      "confirmNewPassword": this.changePasswordForm.get('conNewPassword').value,
      "newPassword": this.changePasswordForm.get('newPassword').value,
      "oldPassword": this.changePasswordForm.get('oldPassword').value,
      token: localStorage.getItem('authToken')
    }
    this.commonHelper.changePassword(request).subscribe(res => {
      if (res.statusCode == 0) {
        this.responseMessage = res.message;
        if (localStorage.getItem('passwordExpired') == 'true') {
          this.logout();
        }else{
          this.resetPage();
        }
      } else {
        this.errorMessage = res.message;
      }
      this.commonHelper.animateMessage.call(this, 'containerWrap');
    })
  }

  resetPage() {
    this.changePasswordForm.reset('');
    this.ngOnInit();
  }

  get f() { return this.changePasswordForm.controls; }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  showPassword(type) {
    if (type == 'newPassword') {
      this.showButton = !this.showButton;
      this.showEye = !this.showEye;
    } else {
      this.showButtonConfirm = !this.showButtonConfirm;
      this.showEyeConfirm = !this.showEyeConfirm;
    }
  }
  getMargin(){
    if (localStorage.getItem('passwordExpired') == 'false'){
      return "0px";
    }else{
      return "13%";
    }
  }
  logout() {
    this.commonHelper.logOut({ token: localStorage.getItem('authToken') }).subscribe(res => {
      let lang = localStorage.getItem('lang')
      localStorage.clear();
      localStorage.setItem('lang', lang)
      this.router.navigate(['signin']);
    })
  }
}
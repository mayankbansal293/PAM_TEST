declare var $: any;
import { Injectable } from "@angular/core";
import { environment } from "../src/environments/environment";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Injectable({
  providedIn: "root"
})
export class CommonHelperService {
  domain = environment.URL_Node;
  responseMessages = {};
  customMessages = {};
  private messages = new BehaviorSubject({});
  getMessages = this.messages.asObservable();
  twoFactAuthReq:string='NO'

  setMessages(data) {
    this.messages.next(data);
  }
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // this.prepareResponseJSON().subscribe(data => {
    //   this.responseMessages = data;
    // });
    this.prepareCustomMessages().subscribe(data => {
      this.setMessages(data);
      this.customMessages = data;
    });
  }

  makeRequest(data, url, loader): Observable<any> {
    
    return this.http.post(this.domain + "/api/PAM/" + url, data).pipe(
      map(response => {
        return response;
      })
    );
  }

  prepareResponseJSON(): Observable<any> {
    return this.http.get(
      "../../assets/responses/" + localStorage.getItem("lang") + ".json"
    );
  }

  prepareCustomMessages(): Observable<any> {
    return this.http.get(
      "../../assets/i18n/custom/" + localStorage.getItem("lang") + ".json"
    );
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
    if (!formGroup.valid) {
      let el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 150) }, 'slow', () => {
        el.focus();
      });
    }
  }

  validateAllFormFieldsIncludingFomrArray(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      if (control.controls) { // control is a FormGroup
        this.validateAllFormFieldsIncludingFomrArray(control);
      } else { // control is a FormControl
        control.markAsTouched();
      }
    });
  }
  getCustomMessages(key) {
    return this.customMessages[key];
  }

  attachRespMessage(response): any {
    if (this.responseMessages[response.statusCode])
      response.message = this.responseMessages[response.statusCode];
    return response;
  }

  getToken(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/get/token", data);
  }

  getMenuList(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/getUserMenus", data);
  }

  getLoginData(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/getLoginData", data);
  }

  logOut(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/logOut", data);
  }

  getEngineServices(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/getEngineServices", data);
  }

  changePassword(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/changePassword", data);
  }

  getEngineUrlForPPL(data): Observable<any> {
    const token = encodeURIComponent(data.token);
    return this.http.get(
      data.domain +
      data.userName +
      "/" +
      data.userType +
      "/" +
      token +
      "/" +
      data.lang +
      "/" +
      data.orgId
    );
  }

  // getEngineUrlForServices(data): Observable<any> {
  //   const token = encodeURIComponent(data.token);
  //   return this.http.get( data.domain + data.userId + "/" + data.userType + "/" + token + "/" + data.lang + "/" + data.orgId + "/" + data.domainName 
  //   );
  // }

  getEngineUrlForDGE(data): Observable<any> {
    const token = encodeURIComponent(data.token);
    return this.http.get(data.domain + data.userId + "/" + data.userType + "/" + token + "/" + data.lang + "/" + data.orgId + "/" + data.domainName);
  }

  getEngineUrlForModules(data): Observable<any> {
    const token = encodeURIComponent(data.token);
    let path = data.domain + data.userId + "/" + data.userType + "/" + token + "/" + data.lang + "/" + data.orgId + "/" + data.merchantId + "/" + data.domainId;
    return this.http.get(path);
  }
  focus(id) {
    let el = $("#" + id);
    $("html,body").animate({ scrollTop: el.offset().top - 150 }, "slow", () => {
      el.focus();
    });
  }

  responseMessage;
  errorMessage;
  animateMessage(className) {
    let el = $("." + className);
    let topObj;
    if (el && el.offset()) {
      topObj = { scrollTop: el.offset().top - 150 };
    } else {
      topObj = { scrollTop: 0 };
    }
    $("html,body").animate(topObj, "slow", () => {
      el.focus();
      setTimeout(() => {
        this.responseMessage = "";
        this.errorMessage = "";
      }, 3000);
    });
  }

  clearMessages(that) {
    that.responseMessage = "";
    that.errorMessage = "";
  }

  resetPassword(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/resetPassword", data);
  }
  validateUserFor2FA(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/validateUserFor2FA", data);
  }
  sendOtpFor2FA(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/sendOtpFor2FA", data);
  }
  validateOtpFor2FA(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/validateOtpFor2FA", data);
  }
  initiateForgotPassword(data): Observable<any> {
    return this.http.post(
      this.domain + "/api/PAM/initiateForgotPassword",
      data
    );
  }

  returnPagePermission(pageName): string[] {
    return JSON.parse(localStorage.getItem("permissions"))[pageName];
  }

  private getErrorMessage = new BehaviorSubject("");
  currentMessage = this.getErrorMessage.asObservable();

  changeMessage(url: string) {
    this.getErrorMessage.next(url);
  }

  private loginHeaderLogoPath = new BehaviorSubject({});
  loginHeaderLogo = this.loginHeaderLogoPath.asObservable();
  private loginFooterLogoPath = new BehaviorSubject("");
  loginFooterLogo = this.loginFooterLogoPath.asObservable();
  private siteLogoPath = new BehaviorSubject({});
  siteLogo = this.siteLogoPath.asObservable();
  private infinityLogoPath = new BehaviorSubject("");
  infinityLogo = this.infinityLogoPath.asObservable();
  private poweredByLogoPath = new BehaviorSubject({});
  poweredByLogo = this.poweredByLogoPath.asObservable();

  setLogosConfiguration() {
    if (environment.CLIENT_CODE == "ACDC") {
      this.loginHeaderLogoPath.next({
        logo: "../../../../assets/images/loginLogo.png",
        tag: "IPT"
      });
      this.loginFooterLogoPath.next("");
      this.siteLogoPath.next({
        logo: "../../../../assets/images/siteLogo.png",
        tag: "IPT",
        imgWidth: "160px"
      });
      this.infinityLogoPath.next("");
      this.poweredByLogoPath.next({ logo: "", tag: "" });
    } else if (environment.CLIENT_CODE == "SISAL") {
      this.loginHeaderLogoPath.next({
        logo: "../../../../assets/images/sisalLoginLogo.jpg",
        tag: "SISAL"
      });
      this.loginFooterLogoPath.next(
        "../../../../assets/images/hcmFooterBg.png"
      );
      this.siteLogoPath.next({
        logo: "../../../../assets/images/siteLogoSisal.png",
        tag: "SISAL",
        imgWidth: "275px"
      });
      this.infinityLogoPath.next(
        "../../../../assets/images/INFINITI_LimitlessGaming.png"
      );
      this.poweredByLogoPath.next({
        logo: "../../../../assets/images/poweredBy.png",
        tag: ""
      });
    } else if (environment.CLIENT_CODE == "CAMEROON") {
      this.loginHeaderLogoPath.next({
        logo: "../../../../assets/images/CamWinLoginLogo1.png",
        tag: "CAMEROON"
      });
      this.loginFooterLogoPath.next(
        "../../../../assets/images/hcmFooterBg.png"
      );
      this.siteLogoPath.next({
        logo: "../../../../assets/images/CamWinLoginLogo.png",
        tag: "CAMEROON",
        imgWidth: "200px"
      });
      this.infinityLogoPath.next(
        "../../../../assets/images/INFINITI_LimitlessGaming.png"
      );
      this.poweredByLogoPath.next({
        logo: "../../../../assets/images/poweredBy.png",
        tag: ""
      });
    } else if (environment.CLIENT_CODE == 'PAYPR') {
      this.loginHeaderLogoPath.next({ "logo": "../../../../assets/images/payprLoginLogo.png", "tag": "PAYPR" })
      this.loginFooterLogoPath.next("../../../../assets/images/payprFooter.png")
      this.siteLogoPath.next({ "logo": "../../../../assets/images/payprSiteLogo1.png", "tag": "PAYPR", "imgWidth": "220px" })
      this.infinityLogoPath.next("../../../../assets/images/INFINITI_LimitlessGaming.png")
      this.poweredByLogoPath.next({ "logo": "../../../../assets/images/poweredBy1.png", "tag": "" });
    } 
    else if (environment.CLIENT_CODE == 'MYANMAR') {
      this.loginHeaderLogoPath.next({ "logo": "../../../../assets/images/myanmar1.png", "tag": "MYANMAR" })
      // this.loginFooterLogoPath.next("../../../../assets/images/payprFooter.png")
      this.siteLogoPath.next({ "logo": "../../../../assets/images/myanmar.png", "tag": "MYANMAR", "imgWidth": "220px" })
      // this.infinityLogoPath.next("../../../../assets/images/INFINITI_LimitlessGaming.png")
      // this.poweredByLogoPath.next({ "logo": "../../../../assets/images/poweredBy1.png", "tag": "" });
    } 
    else {
      this.loginHeaderLogoPath.next({
        logo: "../../../../assets/images/skilrockLoginLogo.png",
        tag: "SISAL"
      });
      this.loginFooterLogoPath.next(
        "../../../../assets/images/hcmFooterBg.png"
      );
      this.siteLogoPath.next({
        logo: "../../../../assets/images/siteLogo1.1.png",
        tag: "SISAL",
        imgWidth: "220px"
      });
      this.infinityLogoPath.next(
        "../../../../assets/images/INFINITI_LimitlessGaming.png"
      );
      this.poweredByLogoPath.next({
        logo: "../../../../assets/images/poweredBy.png",
        tag: ""
      });
    }
  }

  private pageMenuTitle = new BehaviorSubject("");
  pageCurrentTitle = this.pageMenuTitle.asObservable();
  private menuArray = new BehaviorSubject([]);
  menuTitleArray = this.menuArray.asObservable();

  setPageTitle(title) {
    this.pageMenuTitle.next(title);
  }

  setMenuArray(array) {
    this.menuArray.next(array);
  }

  allowURL = environment.ALLOWED_ULRS;
  currentURl(url) {
    this.menuTitleArray.subscribe(res => {
      if (res) var caption = res.filter(data => data.relativePath == url);
      if (caption.length) {
        this.pageMenuTitle.next(caption[0].caption);
      } else {
        if (this.allowURL.filter(allowedUrl => allowedUrl == url).length) {
          this.pageMenuTitle.next("");
        } else {
          this.router.navigate(["/backoffice/home"]);
        }
      }
    });
  }

  requestDateFormat(date): string {
    let stringDate: string = "";
    if (date) {
      let stringDay = isNumber(date.day) ? padNumber(date.day) : "";
      let stringMonth = isNumber(date.month) ? padNumber(date.month) : "";
      let stringYear = isNumber(date.year) ? (date.year - 0).toString() : "";
      stringDate = stringYear + "-" + stringMonth + "-" + stringDay;
    }
    return stringDate;
  }

  private userName = new BehaviorSubject("");
  currentUserName = this.userName.asObservable();
  setUserName(name) {
    this.userName.next(name);
  }

  // checkRegex(regex) {
  //   if (regex == "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$") {
  //     return [
  //       this.getCustomMessages("pwdAlphanumeric"),
  //       `<li>` +
  //         this.getCustomMessages("oneUpperCase") +
  //         `</li><li>` +
  //         this.getCustomMessages("oneDigit") +
  //         `(0-9)</li><li>` +
  //         this.getCustomMessages("atLeastOneLowerCase") +
  //         `</li><li>` +
  //         this.getCustomMessages("minLength") +
  //         ` </li> <li> ` +
  //         this.getCustomMessages("maxLength") +
  //         ` </li>`
  //     ];
  //   } else if (regex == "^[0-9]{8,16}$") {
  //     return [
  //       this.getCustomMessages("onlyNumbersAllow"),
  //       `<li> ` +
  //         this.getCustomMessages("onlyNumbers") +
  //         ` </li><li>` +
  //         this.getCustomMessages("minLength") +
  //         `</li> <li>` +
  //         this.getCustomMessages("maxLength") +
  //         ` </li>`
  //     ];
  //   } else if (regex == "^[0-9]{5,5}$") {
  //     return [
  //       this.getCustomMessages("onlyNumbersAllow"),
  //       `<li>` +
  //         this.getCustomMessages("onlyNumbers") +
  //         `</li><li>` +
  //         this.getCustomMessages("minLengthFive") +
  //         ` </li> <li>` +
  //         this.getCustomMessages("maxLengthFive") +
  //         `</li>`
  //     ];
  //   } else {
  //     return ["", regex];
  //   }
  // }


  resetPage(resetObj: any) {
    var that = this;
    for (let resKey in resetObj) {
      const path = resKey.split(".");
      const length = path.length;
      path.forEach(function (key, index) {
        if (index === length - 1) {
          that[key] = resetObj[resKey];
        } else {
          if (!that[key]) {
            that[key] = {};
          }
          that = that[key];
        }
      });
    }
  }

  patchValues(formName, valuesObj: any) {
    for (var key in valuesObj) {
      if (this[formName] && this[formName].get(key)) {
        this[formName].get(key).patchValue(valuesObj[key]);
      }
    }
  }

  clearValidators(formName, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (this[formName] && this[formName].controls[arr[i]]) {
        this[formName].controls[arr[i]].clearValidators();
        this[formName].controls[arr[i]].updateValueAndValidity();
      }
    }
  }


  disableField(form, fieldName) {
    if (form && form.get([fieldName])) {
      form.get([fieldName]).disable({ emitEvent: false });
    }
  }

  enableField(form, fieldName) {
    if (form && form.get([fieldName])) {
      form.get([fieldName]).enable({ emitEvent: false });
    }
  }
  enableFields(formName, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (this[formName] && this[formName].get(arr[i])) {
        this[formName].get(arr[i]).enable({ emitEvent: false });
      }
    }
  }

  setFieldValues(form, fieldNames, values) {
    for (let i = 0; i < fieldNames.length; i++) {
      if (form && form.get([fieldNames[i]])) {
        form.get([fieldNames[i]]).patchValue(values[i]);
      }
    }
  }

  disableFields(formName, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (this[formName] && this[formName].get(arr[i])) {
        this[formName].get(arr[i]).disable({ emitEvent: false });
      }
    }
  }

  makeRequired(formControl, fieldNames) {
    for (let i = 0; i < fieldNames.length; i++) {
      if (formControl && formControl.controls[fieldNames[i]]) {
        formControl.controls[fieldNames[i]].setValidators([
          Validators.required
        ]);
        formControl.controls[fieldNames[i]].updateValueAndValidity({
          emitEvent: false
        });
      }
    }
  }

  setValidation(formName, validityObjectArr) {
    for (var i = 0; i < validityObjectArr.length; i++) {
      if (
        this[formName] &&
        this[formName].controls[validityObjectArr[i].fieldName]
      ) {
        this[formName].controls[validityObjectArr[i].fieldName].setValidators(
          validityObjectArr[i].validators
        );
        this[formName].controls[
          validityObjectArr[i].fieldName
        ].updateValueAndValidity();
      }
    }
  }

  resetValidation(formName, resetValidityArr) {
    for (var i = 0; i < resetValidityArr.length; i++) {
      if (
        this[formName] &&
        this[formName].controls[resetValidityArr[i].fieldName]
      ) {
        this[formName].controls[
          resetValidityArr[i].fieldName
        ].clearValidators();
        this[formName].controls[
          resetValidityArr[i].fieldName
        ].updateValueAndValidity();
        this[formName].controls[resetValidityArr[i].fieldName].setValidators(
          resetValidityArr[i].validators
        );
        this[formName].controls[
          resetValidityArr[i].fieldName
        ].updateValueAndValidity();
      }
    }
  }

  private MOBILECODE = new BehaviorSubject('');
  getMOBILECODE = this.MOBILECODE.asObservable();

  setMobileCode(mobileCode) {
    this.MOBILECODE.next(mobileCode);
  }

  private MOBILE_CODE_MIN_MAX_LENGTH = new BehaviorSubject('');
  getMOBILE_CODE_MIN_MAX_LENGTH = this.MOBILE_CODE_MIN_MAX_LENGTH.asObservable();

  setMobileCodeMinMax(mobileCodeMinMax) {
    this.MOBILE_CODE_MIN_MAX_LENGTH.next(mobileCodeMinMax);
  }

  getStateList(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/getStateList", data);
  }

  getCityList(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/getCityList", data);
  }

  getCountryList(data): Observable<any> {
    return this.http.post(this.domain + "/api/PAM/getCountryList", data);
  }

}


function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return "";
  }
}

function isNumber(value: any): boolean {
  return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}



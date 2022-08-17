import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonHelperService } from '../../../services/common-helper.service';
import { Router, NavigationEnd } from '@angular/router';
import { ValidationHelperService } from '../../../services/validation-helper.service';

@Component({
  selector: 'app-user-reg',
  templateUrl: './user-reg.component.html',
  styleUrls: ['./user-reg.component.scss']
})
export class UserRegComponent implements OnInit {
  createUserForm: FormGroup;
  userExists = '';
  submitted = false;
  responseMessage;
  errorMessage;
  verifyUser: boolean;
  boOrgId;
  zipCodeRegex;
  mobileNoRegex;
  navigationSubscription;
  addressDetails: any;
  showCheckBox = false;
  mobileMaxLengthMob;
  mobileMinLengthMob;
  mobileMaxLengthAlt;
  mobileMinLengthAlt;
  mobileMinMaxLength;
  roleList = [];
  countryList;
  stateList;
  cityList;
  channelNameList = [];
  orgTypeList = [];
  servingRegionList = [];
  countryCodes = [];
  loggedInOrgType = localStorage.getItem('orgTypeCode');
  mobileMinLength = 10;
  configChannel = {
    displayKey: "channelNameChannelId",
    search: true,
    height: 'auto',
    placeholder: 'Select Channel',
    customComparator: () => { },
    noResultsFound: 'No results found!',
    clearOnSelection: true,
    searchOnKey: 'channelName'
  };

  configState = {
    displayKey: "stateName",
    search: true,
    height: 'auto',
    placeholder: 'Select State',
    customComparator: () => { },
    noResultsFound: 'No results found!',
    clearOnSelection: true,
    searchOnKey: 'stateName'
  };

  configCity = {
    displayKey: "cityName",
    search: true,
    height: 'auto',
    placeholder: 'Select City',
    customComparator: () => { },
    noResultsFound: 'No results found!',
    clearOnSelection: true,
    searchOnKey: 'cityName'
  };
  constructor(private commonHelper: CommonHelperService,
    private fb: FormBuilder,
    private validationService: ValidationHelperService,
    private router: Router
  ) {
    this.commonHelper.getMOBILE_CODE_MIN_MAX_LENGTH.subscribe(mobileCodeMinMax => {
      this.mobileMinMaxLength = mobileCodeMinMax;
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.createUserForm) {
          this.resetPage();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.createUserForm = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      addressOne: ['', Validators.required],
      addressTwo: ['', Validators.required],
      altMobileNo: [''],
      channelId: ['', Validators.required],
      contactPerson: ['',],
      zipCode: ['', Validators.required],
      mobileNo: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.pattern]],
      roleId: ['', Validators.required],
      region: ['',],
      checkField: [false],
      countryCodeForMobileNo: [''],
      countryCodeForAltMobileNo: ['']
    });
    const sendToken = {
      token: localStorage.getItem('authToken'),
      channelId: localStorage.getItem('accessSelfChannelOnly') == 'YES' ? localStorage.getItem('channelId') : 'ALL'
    };

    this.commonHelper.makeRequest(sendToken, 'getChannelList', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.channelNameList = res.data
        this.channelNameList.forEach(channel => channel['channelNameChannelId'] = channel.channelName + ' (' + channel.channelId + ')')
        if (this.channelNameList.length == 1) {
          this.createUserForm.patchValue({ channelId: this.channelNameList[0] })
          this.createUserForm.get('channelId').disable({ emitEvent: false });
        }
      }
    });

    this.createUserForm.get('countryCodeForMobileNo').valueChanges.subscribe(mobileCode => {
      let mobileData = this.mobileMinMaxLength.filter(data => Object.keys(data) == mobileCode);
      this.mobileMaxLengthMob = mobileData[0] ? mobileData[0][Object.keys(mobileData[0])[0]].max || '8' : '10';
      this.mobileMinLengthMob = mobileData[0] ? mobileData[0][Object.keys(mobileData[0])[0]].min || '10' : '7';
    });

    this.createUserForm.get('countryCodeForAltMobileNo').valueChanges.subscribe(mobileCode => {
      let mobileData = this.mobileMinMaxLength.filter(data => Object.keys(data) == mobileCode);
      this.mobileMaxLengthAlt = mobileData[0] ? mobileData[0][Object.keys(mobileData[0])[0]].max || '8' : '10';
      this.mobileMinLengthAlt = mobileData[0] ? mobileData[0][Object.keys(mobileData[0])[0]].min || '10' : '7';
    });

    this.getCountry();

    this.createUserForm.get('userName').valueChanges.subscribe(userName => {
      this.userExists = '';
    });

    this.createUserForm.get('country').valueChanges.subscribe(country => {
      if (country) {
        this.createUserForm.get('state').patchValue('');
        this.f.state.markAsUntouched();
        const data = {
          token: localStorage.getItem('authToken'),
          countryCode: country
        }
        this.commonHelper.makeRequest(data, 'getStateList', false).subscribe(res => {
          if (res.statusCode == 0) {
            this.stateList = res.data;
            if (this.stateList.length == 1) {
              this.createUserForm.patchValue({ state: this.stateList[0] })
              this.createUserForm.get('state').disable({ emitEvent: false });
            } else {
              this.createUserForm.patchValue({ state: '' })
              this.f.state.markAsUntouched();
              this.f.state.markAsPristine();
              this.createUserForm.get('state').enable({ emitEvent: false });
            }
          }
        })
      }
    });

    this.createUserForm.get('state').valueChanges.subscribe(state => {
      this.cityList = [];
      this.createUserForm.get('city').patchValue('');
      this.f.city.markAsUntouched();
      this.f.city.markAsPristine();
      if (state && state.stateCode) {
        const data = {
          token: localStorage.getItem('authToken'),
          stateCode: state.stateCode
        }

        this.commonHelper.makeRequest(data, 'getCityList', false).subscribe(res => {
          if (res.statusCode == 0) {
            this.cityList = res.data;
            if (this.cityList.length == 1) {
              this.createUserForm.patchValue({ city: this.cityList[0] })
              this.createUserForm.get('city').disable({ emitEvent: false });
            } else {
              this.createUserForm.patchValue({ city: '' })
              this.f.city.markAsUntouched();
              this.f.city.markAsPristine();
              this.createUserForm.get('city').enable({ emitEvent: false });
            }
          }
        })
      }
    });

    this.createUserForm.get('channelId').valueChanges.subscribe(channel => {

      if (channel && channel.channelId) {
        Object.assign(this, {
          zipCodeRegex: channel.ZIPCODE_REGEX,
          mobileNoRegex: channel.MOBILE_REGEX,
          orgTypeList: [],
          countryCodes: channel.COUNTRY_CODES.split(',')
        })
        this.commonHelper.patchValues.call(this, 'createUserForm', {
          countryCodeForMobileNo: this.countryCodes[0],
          countryCodeForAltMobileNo: this.countryCodes[0]
        })
        if (this.loggedInOrgType == 'SUPER_BO') {
          const data = {
            token: localStorage.getItem('authToken'),
            channelId: channel.channelId
          }
          this.commonHelper.makeRequest(data, 'getBoOrgs', false).subscribe(res => {
            if (res.statusCode == 0) {
              this.boOrgId = res.data;
            }
          })
        }
      }
    });
    const data = {
      token: localStorage.getItem('authToken'),
    }
    this.commonHelper.makeRequest(data, 'getRoleList', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.roleList = res.data;
      }
    })
  }

  get f() { return this.createUserForm.controls; }

  doUserRegistration() {
    this.commonHelper.clearMessages(this);
    if (this.createUserForm.valid) {
      if (this.userExists != 'success') {
        this.verifyUser = true;
        this.commonHelper.focus('userError');
        return;
      }
      let requestDataForUserReg = {
        userData: {
          'addressOne': this.createUserForm.get('addressOne').value,
          'addressTwo': this.createUserForm.get('addressTwo').value,
          'altMobileCode': this.createUserForm.get('altMobileNo').value ? this.createUserForm.get('countryCodeForAltMobileNo').value : '',
          'altMobileNumber': this.createUserForm.get('altMobileNo').value ? this.createUserForm.get('altMobileNo').value : '',
          'emailId': this.createUserForm.get('emailId').value,
          'firstName': this.createUserForm.get('firstName').value,
          'middleName': this.createUserForm.get('middleName').value,
          'lastName': this.createUserForm.get('lastName').value,
          'channelId': this.createUserForm.get('channelId').value.channelId,
          'mobileCode': this.createUserForm.get('countryCodeForMobileNo').value,
          'mobileNumber': this.createUserForm.get('mobileNo').value,
          'roleId': this.createUserForm.get('roleId').value,
          'userName': this.createUserForm.get('userName').value,
          'countryCode': this.createUserForm.get('country').value,
          'stateCode': this.createUserForm.get('state').value.stateCode,
          'cityCode': this.createUserForm.get('city').value.cityCode,
          'zipCode': this.createUserForm.get('zipCode').value,
          'orgId': this.loggedInOrgType == 'SUPER_BO' ? this.boOrgId : localStorage.getItem('orgId')
        },
        token: localStorage.getItem('authToken')
      }
      this.commonHelper.makeRequest(requestDataForUserReg, 'doUserRegistration', true).subscribe(res => {
        if (res.statusCode == 0) {
          this.responseMessage = res.data;
          this.resetPage();
        } else {
          this.errorMessage = res.message;
        }
        this.commonHelper.animateMessage.call(this, 'containerWrap');
      })
    } else {
      this.validationService.validateAllFormFields(this.createUserForm);
    }
  }

  checkUserName() {
    this.verifyUser = false;
    let requestData = {
      token: localStorage.getItem('authToken'),
      userName: this.createUserForm.get('userName').value
    }
    this.commonHelper.makeRequest(requestData, 'checkLoginName', true).subscribe(res => {
      if (res.statusCode == 0) {
        this.userExists = 'userExists'
      } else {
        this.userExists = 'success'
      }
    })
  }

  resetPage() {
    this.ngOnInit();
    this.commonHelper.resetPage.call(this, {
      channelNameList: [],
      showOrgField: '',
      orgTypeList: [],
      userExists: ''
    })
  }

  selectionChanged(e) {
  }

  returnRegionIds(form): number[] {
    let regionIds = [];
    let selectedRegions = form.get('region').value;
    if (selectedRegions)
      selectedRegions.forEach(function (r) {
        regionIds.push(parseInt(r.regionId));
      })
    return regionIds;
  }

  getCountry() {
    const sendToken = {
      token: localStorage.getItem('authToken'),
      channelId: localStorage.getItem('accessSelfChannelOnly') == 'YES' ? localStorage.getItem('channelId') : 'ALL'
    };
    this.commonHelper.makeRequest(sendToken, 'getCountryList', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.countryList = res.data;
        if (this.countryList.length == 1) {
          this.createUserForm.patchValue({ country: this.countryList[0].countryCode })
          this.createUserForm.get('country').disable({ emitEvent: false });
        } else {
          this.createUserForm.patchValue({ country: '' })
          this.createUserForm.get('country').enable({ emitEvent: false });
        }
      }
    })
  }


}
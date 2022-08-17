import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CommonHelperService } from '../../../services/common-helper.service';

@Component({
  selector: 'app-channel-reg',
  templateUrl: './channel-reg.component.html',
  styleUrls: ['./channel-reg.component.scss']
})

export class ChannelRegComponent implements OnInit {
  createChannelForm: UntypedFormGroup;
  userExists = '';
  navigationSubscription;
  responseMessage = '';
  countryList = [];
  stateList = [];
  cityList = [];
  orgTypeList = [];
  errorMessage = ''
  loggedInOrgType = localStorage.getItem('orgTypeCode');
  loggedInOrgId = localStorage.getItem('orgId');
  loggedInOrgName = localStorage.getItem('orgName');
  regionList = [];
  zipCodeRegex;
  countryCodes: any;
  mobileMaxLengthMob;
  mobileMinLengthMob;
  mobileMaxLengthAlt;
  mobileMinLengthAlt;
  mobileMaxLengthPhone;
  mobileMinLengthPhone;
  mobileMinMaxLength;
  showDiv = false;
  manageConfigList: any;
  policies;
  messages = [];
  mobileMinLength = 10;
  userTypeSettings = {
    singleSelection: false,
    idField: 'userTypeCode',
    textField: 'userTypeName',
    itemsShowLimit: 10,
    allowSearchFilter: true
  }
  currencySettings = {
    singleSelection: false,
    idField: 'currencyCode',
    textField: 'currencyNameCurrencyCode',
    itemsShowLimit: 10,
    allowSearchFilter: true
  }
  countrySettings = {
    singleSelection: false,
    idField: 'isdCode',
    textField: 'countryNameIsdCode',
    itemsShowLimit: 10,
    allowSearchFilter: true
  }
  countryISDCodesList = [];
  currencyCodesList = [];
  userTypeList = [];
  constructor(private commonHelper: CommonHelperService,
    private formBuilder: UntypedFormBuilder,
    private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.createChannelForm) {
          this.resetPage();
        }
      }
    });
  }
  get policy() {
    return this.createChannelForm.get('policy').value;
  }
  ngOnInit() {
    this.createChannelForm = this.formBuilder.group({
      channelName: ['', Validators.required],
      aliasName: ['', Validators.required],
      contactPerson: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      addressOne: ['', Validators.required],
      addressTwo: ['', Validators.required],
      altMobileNumber: [''],
      zipCode: ['', Validators.required],
      mobileNumber: ['', [Validators.required]],
      phoneNumber: [''],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.pattern]],
      region: ['', Validators.required],
      countryCodeForMobileNo: [''],
      countryCodeForAltMobileNo: [''],
      countryCodeForPhoneNo: [''],
      policy: ['', Validators.required],
      engineArray: this.formBuilder.array([]),
    });


    let token = {
      token: localStorage.getItem('authToken')
    }
    this.commonHelper.makeRequest(token, 'getCountryISDCodes', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.countryISDCodesList = res.data;
        this.countryISDCodesList.forEach(country => country['countryNameIsdCode'] = country.countryName + ' (' + country.isdCode + ')')
      }
    })
    this.commonHelper.makeRequest(token, 'getCurrencyCodes', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.currencyCodesList = res.data;
        this.currencyCodesList.forEach(currency => currency['currencyNameCurrencyCode'] = currency.currencyName + ' (' + currency.currencyCode + ')')
      }
    })
    this.commonHelper.makeRequest(token, 'getUserTypes', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.userTypeList = res.data;
      }
      this.getConfigurations();
    })
    this.createChannelForm.get('channelName').valueChanges.subscribe(channel => {
      this.createChannelForm.patchValue({ aliasName: channel });
    });

    const request = {
      token: localStorage.getItem('authToken'),
      channelId: localStorage.getItem('accessSelfChannelOnly') == 'NO' ? localStorage.getItem('channelId') : '0'
    }

    this.commonHelper.makeRequest({ token: localStorage.getItem('authToken') }, 'getRegionList', false).subscribe(res => {
      this.regionList = [];
      if (res.statusCode == 0) {
        this.regionList = res.data;
      }
      if (this.regionList.length == 1) {
        this.commonHelper.setFieldValues(this.createChannelForm, ['region'], [this.regionList[0].regionCode]);
        this.commonHelper.disableField(this.createChannelForm, 'region');
      }

    })


    this.commonHelper.makeRequest(request, 'getCountryList', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.countryList = res.data;
        if (this.countryList.length == 1) {
          this.createChannelForm.patchValue({ country: this.countryList[0].countryCode })
          this.commonHelper.disableField(this.createChannelForm, 'country');
        }
      }
    })

    this.commonHelper.makeRequest({ token: localStorage.getItem('authToken') }, 'getPasswordPolicy', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.policies = res.data;
      }
    })

    this.createChannelForm.get('country').valueChanges.subscribe(country => {
      if (country) {
        const data = {
          token: localStorage.getItem('authToken'),
          countryCode: country
        }
        this.commonHelper.setFieldValues(this.createChannelForm, ['state'], [''])
        this.commonHelper.makeRequest(data, 'getStateList', false).subscribe(res => {
          if (res.statusCode == 0) {
            this.stateList = res.data;
          }
          if (this.stateList.length == 1) {
            this.createChannelForm.patchValue({ state: this.stateList[0].stateCode })
            this.commonHelper.disableField(this.createChannelForm, 'state');
          } else {
            this.createChannelForm.patchValue({ state: '' })
            this.commonHelper.enableField(this.createChannelForm, 'state');
          }
        })
      }
    });

    this.createChannelForm.get('userName').valueChanges.subscribe(userName => {
      this.userExists = ''
    });

    this.createChannelForm.get('state').valueChanges.subscribe(state => {
      if (state) {
        const data = {
          token: localStorage.getItem('authToken'),
          stateCode: state
        }
        this.commonHelper.setFieldValues(this.createChannelForm, ['city'], [''])
        this.commonHelper.makeRequest(data, 'getCityList', false).subscribe(res => {
          if (res.statusCode == 0) {
            this.cityList = res.data;
            if (this.cityList.length == 1) {
              this.createChannelForm.patchValue({ city: this.cityList[0].cityCode })
            }
          } else {
            this.cityList = [];
          }
          if (this.cityList.length == 1) {
            this.createChannelForm.patchValue({ city: this.cityList[0].cityCode });
            this.commonHelper.disableField(this.createChannelForm, 'city');
          } else {
            this.createChannelForm.patchValue({ city: '' });
            this.commonHelper.enableField(this.createChannelForm, 'city');
          }
        })
      }
    })
    this.createChannelForm.get('policy').valueChanges.subscribe(id => {
      this.messages = [];
      if (id) {
        let data = this.policies.filter(policy => policy.id == id)
        this.messages = Object.values(data[0].passwordDescription)
      }
    });
  }

  verifyUser = false;

  doChannelRegistration() {
    if (this.createChannelForm.valid) {
      this.errorMessage = ''
      if (this.userExists != 'success') {
        this.verifyUser = true;
        this.commonHelper.focus('userError');
        return;
      }

      let requestDataForOrgReg = {
        channelData: {
          'addressOne': this.controls.addressOne.value.trim(),
          'addressTwo': this.controls.addressTwo.value,
          'altMobileCode': this.controls.altMobileNumber.value ? this.controls.countryCodeForAltMobileNo.value : '',
          'altMobileNumber': this.controls.altMobileNumber.value ? this.controls.altMobileNumber.value : '',
          'cityCode': this.controls.city.value,
          'contactPerson': this.controls.firstName.value,
          'countryCode': this.controls.country.value,
          'emailId': this.controls.emailId.value,
          'firstName': this.controls.firstName.value,
          'lastName': this.controls.lastName.value,
          'channelName': this.controls.channelName.value,
          "aliasName": this.controls.aliasName.value,
          'middleName': this.controls.middleName.value,
          'mobileCode': this.controls.countryCodeForMobileNo.value,
          'mobileNumber': this.controls.mobileNumber.value,
          'phoneCode': this.controls.phoneNumber.value ? this.controls.countryCodeForPhoneNo.value : '',
          'phoneNumber': this.controls.phoneNumber.value ? this.controls.phoneNumber.value : '',
          'userName': this.controls.userName.value,
          'zipCode': this.controls.zipCode.value,
          'stateCode': this.controls.state.value,
          'regionCode': this.controls.region.value,
          'configuration': [],
          'policyId': this.policy
        },
        token: localStorage.getItem('authToken')
      }
      let control = this.control;
      control.forEach(data => {
        let userTypeCodes = [];
        let currencyCodes = [];
        let isdCodes = [];
        for (let config of data.controls) {
          let configCode = config.get('configCode').value;
          let configValue = config.get('configValue').value;
          if (configCode == 'ALLOWED_USER_TYPES') {
            userTypeCodes = configValue.map(config => {
              return config.userTypeCode;
            })
          } else if (configCode == 'ALLOWED_CURRENCIES') {
            currencyCodes = configValue.map(config => {
              return config.currencyCode;
            })
          } else if (configCode == 'COUNTRY_CODES') {
            isdCodes = configValue.map(config => {
              return config.isdCode;
            })
            isdCodes = Array.from(new Set(isdCodes))
          }
          requestDataForOrgReg.channelData.configuration.push({
            configCode: configCode,
            configValue: configCode == 'ALLOWED_USER_TYPES' ? userTypeCodes.join(',') :
              configCode == 'ALLOWED_CURRENCIES' ? currencyCodes.join(',') :
                configCode == 'COUNTRY_CODES' ? isdCodes.join(',') : configValue
          })
        }
      })

      this.commonHelper.makeRequest(requestDataForOrgReg, 'doChannelRegistration', true).subscribe(res => {
        if (res.statusCode == 0) {
          this.responseMessage = res.message;
          this.resetPage();
        } else {
          this.errorMessage = res.message;
        }
        this.commonHelper.animateMessage.call(this, 'containerWrap');
      })
    } else {
      this.commonHelper.validateAllFormFields(this.createChannelForm);
    }
  }

  checkUserName() {
    this.verifyUser = false;
    let requestData = {
      token: localStorage.getItem('authToken'),
      userName: this.createChannelForm.get('userName').value
    }
    this.commonHelper.makeRequest(requestData, 'checkLoginName', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.userExists = 'userExists'
      } else if (res.statusCode == 706) {
        this.userExists = 'success'
      } else {
        this.errorMessage = res.message;
        this.commonHelper.animateMessage.call(this, 'containerWrap');
      }
    })
  }

  resetPage() {
    this.ngOnInit();
    this.messages = [];
    this.commonHelper.resetPage.call(this, {
      stateList: [],
      cityList: [],
      userExists: ''
    })
  }


  get controls() {
    return this.createChannelForm.controls;
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  getConfigurations() {
    let data = {
      token: localStorage.getItem('authToken'),
      channelId: 0,
      channelApplicable: true,
      fetchCache: false,
      engineApplicable: true
    }
    this.commonHelper.makeRequest(data, 'getConfigurations', true).subscribe(res => {
      if (res.statusCode == 0) {
        let i = 0;
        this.manageConfigList = res.data;
        this.manageConfigList.forEach((config, index) => {
          this.configurationArray([config])
          if (config.engineCode == 'PAM') {
            i = index;
          }
        });
        this.countryCodes = [];
        this.countryCodes = this.manageConfigList[i].configurations.filter(data => {
          if (data.configCode === 'COUNTRY_CODES')
            return data;
        })
        this.countryCodes = this.countryCodes[0].configValue.split(",");
        this.zipCodeRegex = this.manageConfigList[i].configurations.filter(data => {
          if (data.configCode === 'ZIPCODE_REGEX')
            return data;
        })
        this.zipCodeRegex = this.zipCodeRegex[0].configValue;
        this.createChannelForm.patchValue({ countryCodeForMobileNo: this.countryCodes[0] });
        this.createChannelForm.patchValue({ countryCodeForAltMobileNo: this.countryCodes[0] });
        this.createChannelForm.patchValue({ countryCodeForPhoneNo: this.countryCodes[0] });

      } else {
        this.errorMessage = res.message;
      }
      this.commonHelper.animateMessage.call(this, 'containerWrap')
    })
  }
  configurationArray(data) {
    const form = this.createChannelForm.get('engineArray') as UntypedFormArray;
    data.map(config => {
      form.push(this.pushEngineConfig(config));
    })
  }
  pushEngineConfig(config) {
    const form = this.formBuilder.group({
      engineCode: config.engineCode,
      engineCodeDisplayName: config.engineCodeDisplayName,
      configurationArray: this.formBuilder.array([])
    })
    this.fillConfigArray(form, config.configurations)
    return form;
  }
  fillConfigArray(form, configs) {
    const control = form.controls.configurationArray as UntypedFormArray;
    for (let data of configs) {
      let multiSelect = data.configCode == 'ALLOWED_USER_TYPES' || data.configCode == 'ALLOWED_CURRENCIES' || data.configCode == 'COUNTRY_CODES';
      let userTypeList = [];
      let currencyList = [];
      let countryList = [];
      let configList = [];
      if (multiSelect) {
        configList = data.configValue.split(',');
      }
      if (data.configCode == 'ALLOWED_USER_TYPES') {
        userTypeList = this.userTypeList.filter(element => configList.some(config => config == element.userTypeCode))
      } else if (data.configCode == 'ALLOWED_CURRENCIES') {
        currencyList = this.currencyCodesList.filter(element => configList.some(config => config == element.currencyCode))
      } else if (data.configCode == 'COUNTRY_CODES') {
        countryList = this.countryISDCodesList.filter(element => configList.some(config => config == element.isdCode))
      }
      control.push(this.formBuilder.group({
        checkField: [false],
        displayName: [data.displayName],
        configCode: [data.configCode],
        configValue: [{
          value: data.configCode == 'ALLOWED_USER_TYPES' ? userTypeList :
            data.configCode == 'ALLOWED_CURRENCIES' ? currencyList :
              data.configCode == 'COUNTRY_CODES' ? countryList : data.configValue,
          disabled: true
        }]
      }))
    }
  }
  get control() {
    const engineArray = this.controls.engineArray as UntypedFormArray;
    let configurationArray = [];
    for (let control of engineArray.controls) {
      configurationArray.push(control.get('configurationArray'))
    }
    return configurationArray;
  }
  onCheck(data) {
    if (data.controls.checkField.value) {
      data.controls.configValue.enable()
    } else {
      data.controls.configValue.disable()

    }
  }
  onFocusOut(event) {
    let control = this.control;
    control.forEach(configs => {
      for (let data of configs.controls) {
        if (data.get('checkField').value && data.get('configCode').value === 'COUNTRY_CODES') {
          this.countryCodes = data.get('configValue').value;
          this.countryCodes = this.countryCodes.split(",");
          this.createChannelForm.patchValue({ countryCodeForMobileNo: this.countryCodes[0] });
          this.createChannelForm.patchValue({ countryCodeForAltMobileNo: this.countryCodes[0] });
          this.createChannelForm.patchValue({ countryCodeForPhoneNo: this.countryCodes[0] });
        }
        if (data.get('checkField').value && data.get('configCode').value === 'ZIPCODE_REGEX') {
          this.zipCodeRegex = data.get('configValue').value;
        }
      }
    })
  }
}
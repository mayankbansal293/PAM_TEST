declare var $: any;
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonHelperService } from '../../../../services/common-helper.service';
import { ValidationHelperService } from '../../../../services/validation-helper.service';
import { CustomValidators } from '../../../shared/directives/custom-validator';
@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.scss']
})
export class UserDetailsModalComponent implements OnInit {

  modalForm: UntypedFormGroup;
  channelList;
  data;
  userId;
  userModalData;
  selectAddressContent;
  selectPersonalContent;
  userUpdateForm: UntypedFormGroup;
  selectedField = { 'keyValue': '', 'keyName': '' };
  cityList = [];
  stateList = [];
  searchPermissions;
  errorMessage: any;
  responseMessage: string;
  patternRegex: any;
  zipCodeRegex;
  pRegex: any;
  countryCodes = [];
  messages = [];
  showButton: boolean = false;
  showEye: boolean = false;
  setPasswordClass;
  showEyeConfirm: boolean = false;
  showButtonConfirm: boolean = false;
  mobileMaxLength;
  mobileMinLength;
  mobileMinMaxLength;
  constructor(
    // public modal: NgbActiveModal,
     private fb: UntypedFormBuilder, private commonHelper: CommonHelperService,
    private validationService: ValidationHelperService,) {
    this.searchPermissions = this.commonHelper.returnPagePermission("USER_SEARCH");
    this.commonHelper.getMOBILE_CODE_MIN_MAX_LENGTH.subscribe(mobileCodeMinMax => {
      this.mobileMinMaxLength = mobileCodeMinMax;
    })
  }

  ngOnInit() {
    this.countryCodes = this.channelList.COUNTRY_CODES.split(',');
    this.userUpdateForm = this.fb.group({
      fieldValue: ['',],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      organizationType: ['',],
      addressOne: ['', CustomValidators.required],
      addressTwo: ['', CustomValidators.required],
      altMobileNo: ['',],
      channelId: ['',],
      contactPerson: ['',],
      zipCode: ['', CustomValidators.required],
      mobileNo: [''],
      firstName: ['',],
      middleName: [''],
      lastName: ['',],
      userName: ['',],
      emailId: ['',],
      roleId: ['',],
      masterAgent: ['',],
      agent: ['',],
      subAgent: ['',],
      confirmPassword: ['',],
      updateType: ['', Validators.required],
      selectedField: ['', Validators.required],
      countryCodeForMobileNo: ['']
    });

    this.userUpdateForm.get('countryCodeForMobileNo').valueChanges.subscribe(mobileCode => {
      let mobileData = this.mobileMinMaxLength.filter(data => Object.keys(data) == mobileCode);
      this.mobileMaxLength = mobileData[0] ? mobileData[0][Object.keys(mobileData[0])[0]].max || '8' : '10';
      this.mobileMinLength = mobileData[0] ? mobileData[0][Object.keys(mobileData[0])[0]].min || '10' : '7';
    });

    this.userUpdateForm.get('updateType').valueChanges.subscribe(updateType => {
      if (updateType == 'addressDetails') {
        this.zipCodeRegex = this.channelList.ZIPCODE_REGEX;
        this.commonHelper.clearValidators.call(this, 'userUpdateForm', ['selectedField', 'fieldValue', 'emailId', 'mobileNo', 'confirmPassword'])
        this.commonHelper.makeRequired(this.userUpdateForm, ['addressOne', 'addressTwo', 'country', 'state', 'city', 'zipCode']);
        const data = {
          token: localStorage.getItem('authToken'),
          countryCode: this.userModalData.countryCode
        }
        this.commonHelper.getStateList(data).subscribe(res1 => {
          if (res1 && res1.data) {
            this.stateList = res1.data;
            let state = this.stateList.filter(state => state.stateName == this.userModalData.state)
            if (state.length) {
              this.userUpdateForm.patchValue({ state: state[0].stateCode })
              const data = {
                token: localStorage.getItem('authToken'),
                stateCode: state[0].stateCode
              }
              this.commonHelper.getCityList(data).subscribe(res2 => {
                this.cityList = res2.data;
                let city = this.cityList.filter(city => city.cityName == this.userModalData.city)
                if (city.length) {
                  this.userUpdateForm.patchValue({ city: city[0].cityCode })
                }
              })
            }
          }
        })

        this.userUpdateForm.patchValue({
          addressOne: this.userModalData.addressOne,
          addressTwo: this.userModalData.addressTwo,
          country: this.userModalData.countryCode,
          zipCode: this.userModalData.zipCode
        })
      }

    })

    this.userUpdateForm.get('selectedField').valueChanges.subscribe(selectedField => {
      this.selectedField = selectedField;
      this.patternRegex = ' ';
      this.pRegex = ' ';
      this.userUpdateForm.patchValue({ confirmPassword: '' })
      if (!(selectedField.keyValue == 'password')) {
        if ((this.userModalData['' + selectedField.keyValue]) && selectedField.keyValue == 'mobileNumber') {
          // this.countryCodes.forEach(data => {
          //   if (this.userModalData && this.userModalData.mobileNumber && this.userModalData.mobileNumber.includes(data)) {
          //     this.userUpdateForm.patchValue({ countryCodeForMobileNo: data });
          //     let splitArray = this.userModalData.mobileNumber.split(data);
          //     if (splitArray.length > 1) {
          //       this.userUpdateForm.patchValue({ fieldValue: splitArray[1] })
          //     }
          //   }
          // })
          this.countryCodes.forEach(data => {
            if (this.userModalData.mobileCode && this.userModalData.mobileCode == data) {
              this.userUpdateForm.patchValue({ countryCodeForMobileNo: data })
            }
          })
          this.userUpdateForm.patchValue({ fieldValue: this.userModalData.mobileNumber })


        } else {
          this.userUpdateForm.patchValue({
            fieldValue: this.userModalData['' + selectedField.keyValue]
          })
        }
      }

      if (selectedField.keyValue == 'password') {
        this.userUpdateForm.patchValue({ fieldValue: '' })
        this.patternRegex = this.channelList.PASSWORD_REGEX
        let req = {
          token: localStorage.getItem('authToken'),
          policyId: this.channelList.PASSWORD_POLICY_ID
        }

        this.commonHelper.makeRequest(req, 'getPasswordDescription', false).subscribe(res => {
          if (res.statusCode == 0) {
            this.messages = Object.values(res.data);
          } else {
            this.errorMessage = res.message;
            this.commonHelper.animateMessage.call(this, "containerWrap");
          }
        })


        this.userUpdateForm.get('confirmPassword').setValidators([Validators.required, Validators.pattern(this.patternRegex)])
        this.userUpdateForm.get('fieldValue').setValidators([Validators.required, Validators.pattern(this.patternRegex)])
        this.userUpdateForm.get('fieldValue').updateValueAndValidity();
      }
      if (selectedField.keyValue == 'mobileNumber') {
        this.commonHelper.clearValidators.call(this, 'userUpdateForm', ['confirmPassword', 'fieldValue']);
        this.userUpdateForm.get('fieldValue').setValidators([Validators.required])
        this.userUpdateForm.get('fieldValue').updateValueAndValidity();

      }

      if (selectedField.keyValue == 'emailId') {
        this.patternRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$'
        this.commonHelper.clearValidators.call(this, 'userUpdateForm', ['confirmPassword']);
        this.userUpdateForm.get('fieldValue').setValidators([Validators.required, Validators.pattern(this.patternRegex)])
        this.userUpdateForm.get('fieldValue').updateValueAndValidity();
      }

    })


    this.userUpdateForm.get('updateType').valueChanges.subscribe(updateType => {
      if (updateType == 'personalDetails') {
        this.commonHelper.clearValidators.call(this, 'userUpdateForm', ['state', 'country', 'city', 'addressOne', 'addressTwo', 'zipCode']);
        this.commonHelper.makeRequired(this.userUpdateForm, ['selectedField', 'fieldValue']);
      }

      if (updateType == 'addressDetails') {
        this.commonHelper.clearValidators.call(this, 'userUpdateForm', ['selectedField', 'fieldValue']);
        this.commonHelper.makeRequired(this.userUpdateForm, ['state', 'country', 'city', 'addressOne', 'addressTwo', 'zipCode']);
      }
    })

    this.userUpdateForm.get('state').valueChanges.subscribe(state => {
      if (state) {
        const data = {
          token: localStorage.getItem('authToken'),
          stateCode: state
        }
        this.userUpdateForm.patchValue({ city: '' })
        this.commonHelper.getCityList(data).subscribe(res => {
          this.cityList = res.data;
        })
      }
    })
  }

  updateUserData(updateData): void {
    for (var key in updateData) {
      this.userModalData[key] = updateData[key]
    }
  }

  update() {
    if (this.userUpdateForm.get('confirmPassword').value && this.userUpdateForm.get('confirmPassword').value
      != this.userUpdateForm.get('fieldValue').value) {
      return;
    }

    if (this.userUpdateForm.valid) {
      let updateData = {}
      if (this.userUpdateForm.get('updateType').value == 'addressDetails') {
        updateData = {
          token: localStorage.getItem('authToken'),
          addressOne: this.userUpdateForm.get('addressOne').value,
          addressTwo: this.userUpdateForm.get('addressTwo').value,
          countryCode: this.userUpdateForm.get('country').value,
          stateCode: this.userUpdateForm.get('state').value,
          cityCode: this.userUpdateForm.get('city').value,
          zipCode: this.userUpdateForm.get('zipCode').value,
          userId: this.userId
        }
      }
      if (this.userUpdateForm.get('updateType').value == 'personalDetails') {
        updateData = {
          token: localStorage.getItem('authToken'),
          userId: this.userId,
          [this.userUpdateForm.get('selectedField').value.keyValue]: this.userUpdateForm.get('fieldValue').value
        }

        if (this.selectedField.keyValue == 'mobileNumber') {
          updateData = {
            token: localStorage.getItem('authToken'),
            userId: this.userId,

            [this.userUpdateForm.get('selectedField').value.keyValue]: this.userUpdateForm.get('fieldValue').value,
            mobileCode: this.userUpdateForm.get('countryCodeForMobileNo').value,

            // [this.userUpdateForm.get('selectedField').value.keyValue]: this.userUpdateForm.get('fieldValue').value,

            // mobileCode: this.userUpdateForm.get('countryCodeForMobileNo').value,
            // mobileNumber: this.userUpdateForm.get('fieldValue').value
          }
          //  this.userUpdateForm.get('countryCodeForMobileNo').value + this.userUpdateForm.get('fieldValue').value
        }
      }

      this.commonHelper.makeRequest(updateData, 'updateUserDetails', true).subscribe(res => {
        if (res.statusCode == 0) {
          this.responseMessage = res.message;
          if (this.userUpdateForm.get('updateType').value == 'addressDetails') {
            let state = this.stateList.filter(state => state.stateCode == this.userUpdateForm.get('state').value);
            let city = this.cityList.filter(city => city.cityCode == this.userUpdateForm.get('city').value);
            updateData['state'] = state[0].stateName;
            updateData['city'] = city[0].cityName;
          }
          this.updateUserData(updateData);
        } else {
          this.errorMessage = res.message;
        }
        this.commonHelper.animateMessage.call(this, 'containerWrap');
      })
    } else {
      this.validationService.validateAllFormFields(this.userUpdateForm);
    }
  }

  closeModal() {
    // this.modal.close();
  }

  checkPermission(permissionString: string): boolean {
    return this.searchPermissions.indexOf(permissionString) > -1 ? true : false;
  }

  get f() { return this.userUpdateForm.controls; }

  setClass(field) {
    if (field == 'password') {
      this.setPasswordClass = true
    }
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
}



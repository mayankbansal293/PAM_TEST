import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { count } from 'rxjs/operators';
import { CommonHelperService } from '../../../../services/common-helper.service';

@Component({
  selector: 'app-update-search-channel-modal',
  templateUrl: './update-search-channel-modal.component.html',
  styleUrls: ['./update-search-channel-modal.component.scss']
})
export class UpdateSearchChannelModalComponent implements OnInit {
  updateChannelForm: UntypedFormGroup;
  selectData;
  selectOtherContent;
  selectFinanceContent;
  countryList;
  stateList;
  cityList;
  errorMessage;
  responseMessage;
  selectedField: any;
  zipCodeRegex;
  channelRequest = {
    token: localStorage.getItem('authToken')
  };
  channelData;
  selectTypeArray = [];
  countryCodes = [];
  mobileMaxLength;
  mobileMinLength = 10;
  mobileMinMaxLength;
  channelList;
  constructor(
    // private activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private commonHelper: CommonHelperService,
  ) {
  }

  get updateType() {
    return this.updateChannelForm.get('updateType');
  }

  ngOnInit() {
    this.updateChannelForm = this.fb.group({
      updateType: ['', Validators.required],
      selectedField: ['', Validators.required],
      fieldValue: [''],
      addressOne: [''],
      addressTwo: [''],
      country: [''],
      state: [''],
      city: [''],
      zipCode: [''],
      countryCodeForMobileNo: ['']
    })

    this.commonHelper.getCountryList(this.channelRequest).subscribe(res => {
      if (res.statusCode == 0) {
        this.countryList = res.data;
      }
    })
    // this.countryCodes = this.channelList.COUNTRY_CODES.split(',');

    // var that = this;
    // this.countryCodes.forEach(function (cc) {
    //   if (that.channelData && that.channelData.mobileNumber && that.channelData.mobileNumber.includes(cc)) {
    //     that.updateChannelForm.patchValue({ countryCodeForMobileNo: cc });
    //   }
    // })


    // that.countryCodes.forEach(function (cc) {
    //   if (that.channelData  && that.channelData.mobileCode == cc) {
    //     that.updateChannelForm.patchValue({ countryCodeForMobileNo: cc });
    //   }
    // });



    this.updateChannelForm.get('country').valueChanges.subscribe(country => {
      this.updateChannelForm.patchValue({ city: '' });
      this.cityList = [];
      this.updateChannelForm.patchValue({ state: '' });
      this.stateList = [];
      if (country) {
        const data = {
          token: localStorage.getItem('authToken'),
          countryCode: country
        }
        this.commonHelper.getStateList(data).subscribe(res => {
          if (res.statusCode == 0) {
            this.stateList = res.data;
            this.updateChannelForm.patchValue({ state: '' });
            var that = this;
            this.stateList.forEach(function (s) {
              if (s.stateCode == that.channelData.stateCode) {
                that.updateChannelForm.patchValue({ state: that.channelData.stateCode })
              }
            })
          }
        })
      }
    });


    this.updateChannelForm.get('state').valueChanges.subscribe(state => {
      this.updateChannelForm.patchValue({ city: '' });
      this.cityList = [];
      if (state) {
        const data = {
          token: localStorage.getItem('authToken'),
          stateCode: state
        }
        this.commonHelper.getCityList(data).subscribe(res => {
          if (res.statusCode == 0) {
            this.cityList = res.data;
            this.updateChannelForm.patchValue({ city: '' });
            var that = this;
            this.cityList.forEach(function (c) {
              if (c.cityCode == that.channelData.cityCode) {
                that.updateChannelForm.patchValue({ city: that.channelData.cityCode });
              }
            })
          }
        })
      }
    })


    this.updateType.valueChanges.subscribe(selectedType => {
      this.selectedField = '';
      this.updateChannelForm.patchValue({ selectedField: '' });
      if (selectedType == 'OTHER') {
        this.selectData = this.selectOtherContent;
        this.selectedField = '';
        this.updateChannelForm.patchValue({
          selectedField: ''
        })
      }

    })

    this.updateChannelForm.get('selectedField').valueChanges.subscribe(selectedField => {
      this.selectedField = selectedField;
      if (!selectedField) {
        return;
      } else if (selectedField.keyValue == 'address') {
        this.zipCodeRegex = this.channelList.ZIPCODE_REGEX;
        this.updateChannelForm.patchValue({
          addressOne: this.channelData.addressOne,
          addressTwo: this.channelData.addressTwo,
          country: this.channelData.countryCode,
          zipCode: this.channelData.zipCode
        });

        this.commonHelper.makeRequired(this.updateChannelForm, ['addressOne', 'addressTwo', 'country', 'state', 'city', 'zipCode']);
        this.commonHelper.clearValidators(this.updateChannelForm, ['fieldValue']);

      } else {

        if (selectedField.keyValue == 'mobileNumber') {

          this.countryCodes = this.channelList.COUNTRY_CODES.split(',');
          var that = this;
          that.countryCodes.forEach(function (cc) {
            if (that.channelData && that.channelData.mobileCode == cc) {
              that.updateChannelForm.patchValue({ countryCodeForMobileNo: cc });
            }
          });
          // var countryCode;
          // var that = this;
          // this.countryCodes.forEach(function (cc) {
          //   if (that.channelData && that.channelData.mobileNumber && that.channelData.mobileNumber.includes(cc)) {
          //     countryCode = cc;
          //   }
          // })

          // this.countryCodes.forEach(function (cc) {
          //   if ( this.channelData && this.channelData.mobileCode == cc) {
          //       this.updateChannelForm.patchValue({countryCodeForMobileNo : cc });
          //   }
          // })

          // if ((this.channelData['' + selectedField.keyValue]).indexOf(countryCode) > -1) {
          //   this.updateChannelForm.patchValue({
          //     fieldValue: (this.channelData['' + selectedField.keyValue]).substring((countryCode).length)
          //   })
          // } 

          if ((this.channelData['' + selectedField.keyValue])) {
            this.updateChannelForm.patchValue({
              fieldValue: (this.channelData['' + selectedField.keyValue])
            })
          }


          else {
            this.updateChannelForm.patchValue({
              fieldValue: ''
            })
          }
        } else {
          this.updateChannelForm.patchValue({
            fieldValue: this.channelData['' + selectedField.keyValue]
          })
        }
        this.commonHelper.makeRequired(this.updateChannelForm, ['fieldValue']);
        this.commonHelper.clearValidators(this.updateChannelForm, ['addressOne', 'addressTwo', 'country', 'state', 'city', 'zipCode']);
      }

    })

  }


  updateOrgData(updateData): void {
    for (var key in updateData) {
      this.channelData[key] = updateData[key]


    }
  }

  updateOrganization(): void {
    if (this.updateChannelForm.valid) {
      let updateData: any;
      if (this.updateChannelForm.get('selectedField').value.keyValue == 'address') {
        updateData = {
          token: this.channelRequest.token,
          channelId: this.channelData.channelId,
          addressOne: this.updateChannelForm.get('addressOne').value,
          addressTwo: this.updateChannelForm.get('addressTwo').value,
          countryCode: this.updateChannelForm.get('country').value,
          stateCode: this.updateChannelForm.get('state').value,
          cityCode: this.updateChannelForm.get('city').value,
          zipCode: this.updateChannelForm.get('zipCode').value,
        }
      }
      else if (this.updateChannelForm.get('selectedField').value.keyValue == 'mobileNumber') {
        updateData = {
          token: this.channelRequest.token,
          channelId: this.channelData.channelId,
          mobileCode: this.updateChannelForm.get('countryCodeForMobileNo').value,
          mobileNumber: this.updateChannelForm.get('fieldValue').value
        }
      } else {
        updateData = {
          token: this.channelRequest.token,
          channelId: this.channelData.channelId,
          [this.updateChannelForm.get('selectedField').value.keyValue]: this.updateChannelForm.get('fieldValue').value

          // (this.updateChannelForm.get('selectedField').value.keyValue == 'mobileNumber' ?
          // this.updateChannelForm.get('countryCodeForMobileNo').value + this.updateChannelForm.get('fieldValue').value :
          // this.updateChannelForm.get('fieldValue').value)
        }
      }
      this.commonHelper.makeRequest(updateData, 'updateChannelDetails', true).subscribe(res => {
        if (res.statusCode == 0) {
          if (this.updateChannelForm.get('selectedField').value.keyValue == 'address') {
            let state = this.stateList.filter(state => state.stateCode == this.updateChannelForm.get('state').value);
            let city = this.cityList.filter(city => city.cityCode == this.updateChannelForm.get('city').value);
            updateData['state'] = state[0].stateName;
            updateData['city'] = city[0].cityName;
          }
          this.updateOrgData(updateData);
          this.responseMessage = res.message;
        } else {
          this.errorMessage = res.message;
        }
        this.commonHelper.animateMessage.call(this, 'containerWrap');
      })

    }
  }

  closeModal() {
    // this.activeModal.close(this.channelData);
  }
}

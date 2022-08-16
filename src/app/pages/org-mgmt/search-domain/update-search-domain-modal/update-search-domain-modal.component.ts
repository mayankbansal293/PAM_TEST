import { Component, OnInit } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonHelperService } from '../../../../services/common-helper.service';
// import { environment } from 'src/environments/environment';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-update-search-domain-modal',
  templateUrl: './update-search-domain-modal.component.html',
  styleUrls: ['./update-search-domain-modal.component.scss']
})
export class UpdateSearchDomainModalComponent implements OnInit {
  updateDomainForm: FormGroup;
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
  domainRequest = {
    token: localStorage.getItem('authToken')
  };
  domainData;
  selectTypeArray = [];
  countryCodes = [];
  mobileMaxLength;
  mobileMinLength = 10;
  mobileMinMaxLength;
  domainList;
  constructor(
    // private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private commonHelper: CommonHelperService,
  ) {
  }

  get updateType() {
    return this.updateDomainForm.get('updateType');
  }

  ngOnInit() {
    this.updateDomainForm = this.fb.group({
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

    this.commonHelper.getCountryList(this.domainRequest).subscribe(res => {
      if (res.statusCode == 0) {
        this.countryList = res.data;
      }
    })
    // this.countryCodes = this.domainList.COUNTRY_CODES.split(',');

    // var that = this;
    // this.countryCodes.forEach(function (cc) {
    //   if (that.domainData && that.domainData.mobileNumber && that.domainData.mobileNumber.includes(cc)) {
    //     that.updateDomainForm.patchValue({ countryCodeForMobileNo: cc });
    //   }
    // })


    // that.countryCodes.forEach(function (cc) {
    //   if (that.domainData  && that.domainData.mobileCode == cc) {
    //     that.updateDomainForm.patchValue({ countryCodeForMobileNo: cc });
    //   }
    // });



    this.updateDomainForm.get('country').valueChanges.subscribe(country => {
      this.updateDomainForm.patchValue({ city: '' });
      this.cityList = [];
      this.updateDomainForm.patchValue({ state: '' });
        this.stateList = [];
      if (country) {
        const data = {
          token: localStorage.getItem('authToken'),
          countryCode: country
        }
        this.commonHelper.getStateList(data).subscribe(res => {
          if (res.statusCode == 0) {
            this.stateList = res.data;
            this.updateDomainForm.patchValue({ state: '' });
            var that = this;
            this.stateList.forEach(function (s) {
              if (s.stateCode == that.domainData.stateCode) {
                that.updateDomainForm.patchValue({ state: that.domainData.stateCode })
              }
            })
          }
        })
      }
    });


    this.updateDomainForm.get('state').valueChanges.subscribe(state => {
      this.updateDomainForm.patchValue({ city: '' });
      this.cityList = [];
      if (state) {
        const data = {
          token: localStorage.getItem('authToken'),
          stateCode: state
        }
        this.commonHelper.getCityList(data).subscribe(res => {
          if (res.statusCode == 0) {
            this.cityList = res.data;
            this.updateDomainForm.patchValue({ city: '' });
            var that = this;
            this.cityList.forEach(function (c) {
              if (c.cityCode == that.domainData.cityCode) {
                that.updateDomainForm.patchValue({ city: that.domainData.cityCode });
              }
            })
          }
        })
      }
    })


    this.updateType.valueChanges.subscribe(selectedType => {
      this.selectedField = '';
      this.updateDomainForm.patchValue({ selectedField: '' });
      if (selectedType == 'OTHER') {
        this.selectData = this.selectOtherContent;
        this.selectedField = '';
        this.updateDomainForm.patchValue({
          selectedField: ''
        })
      }

    })

    this.updateDomainForm.get('selectedField').valueChanges.subscribe(selectedField => {
      this.selectedField = selectedField;
      if (!selectedField) {
        return;
      } else if (selectedField.keyValue == 'address') {
        this.zipCodeRegex = this.domainList.ZIPCODE_REGEX;
        this.updateDomainForm.patchValue({
          addressOne: this.domainData.addressOne,
          addressTwo: this.domainData.addressTwo,
          country: this.domainData.countryCode,
          zipCode: this.domainData.zipCode
        });

        this.commonHelper.makeRequired(this.updateDomainForm,['addressOne', 'addressTwo', 'country', 'state', 'city', 'zipCode']);
        this.commonHelper.clearValidators(this.updateDomainForm,['fieldValue']);

      } else {

        if (selectedField.keyValue == 'mobileNumber') {

          this.countryCodes = this.domainList.COUNTRY_CODES.split(',');
          var that = this;
          that.countryCodes.forEach(function (cc) {
           if (that.domainData  && that.domainData.mobileCode == cc) {
        that.updateDomainForm.patchValue({ countryCodeForMobileNo: cc });
      }
    });
          // var countryCode;
          // var that = this;
          // this.countryCodes.forEach(function (cc) {
          //   if (that.domainData && that.domainData.mobileNumber && that.domainData.mobileNumber.includes(cc)) {
          //     countryCode = cc;
          //   }
          // })

          // this.countryCodes.forEach(function (cc) {
          //   if ( this.domainData && this.domainData.mobileCode == cc) {
          //       this.updateDomainForm.patchValue({countryCodeForMobileNo : cc });
          //   }
          // })

          // if ((this.domainData['' + selectedField.keyValue]).indexOf(countryCode) > -1) {
          //   this.updateDomainForm.patchValue({
          //     fieldValue: (this.domainData['' + selectedField.keyValue]).substring((countryCode).length)
          //   })
          // } 
          
          if ((this.domainData['' + selectedField.keyValue])) {
            this.updateDomainForm.patchValue({
              fieldValue: (this.domainData['' + selectedField.keyValue])
            })
          }
          
          
          else {
            this.updateDomainForm.patchValue({
              fieldValue: ''
            })
          }
        } else {
          this.updateDomainForm.patchValue({
            fieldValue: this.domainData['' + selectedField.keyValue]
          })
        }
        this.commonHelper.makeRequired(this.updateDomainForm,['fieldValue']);
        this.commonHelper.clearValidators(this.updateDomainForm,['addressOne', 'addressTwo', 'country', 'state', 'city', 'zipCode']);
      }

    })

  }


  updateOrgData(updateData): void {
    for (var key in updateData) {
      this.domainData[key] = updateData[key]

      
    }
  }

  updateOrganization(): void {
    if (this.updateDomainForm.valid) {
      let updateData: any;
      if (this.updateDomainForm.get('selectedField').value.keyValue == 'address') {
        updateData = {
          token: this.domainRequest.token,
          domainId: this.domainData.domainId,
          addressOne: this.updateDomainForm.get('addressOne').value,
          addressTwo: this.updateDomainForm.get('addressTwo').value,
          countryCode: this.updateDomainForm.get('country').value,
          stateCode: this.updateDomainForm.get('state').value,
          cityCode: this.updateDomainForm.get('city').value,
          zipCode: this.updateDomainForm.get('zipCode').value,
        }
      } 
        else if(this.updateDomainForm.get('selectedField').value.keyValue == 'mobileNumber'){
          updateData = {
            token: this.domainRequest.token,
            domainId: this.domainData.domainId,
              mobileCode: this.updateDomainForm.get('countryCodeForMobileNo').value,
              mobileNumber: this.updateDomainForm.get('fieldValue').value
          }
        } else {
        updateData = {
          token: this.domainRequest.token,
          domainId: this.domainData.domainId,
          [this.updateDomainForm.get('selectedField').value.keyValue] : this.updateDomainForm.get('fieldValue').value

          // (this.updateDomainForm.get('selectedField').value.keyValue == 'mobileNumber' ?
          // this.updateDomainForm.get('countryCodeForMobileNo').value + this.updateDomainForm.get('fieldValue').value :
          // this.updateDomainForm.get('fieldValue').value)
        }
      }
      this.commonHelper.makeRequest(updateData, 'updateDomainDetails', true).subscribe(res => {
        if (res.statusCode == 0) {
          if (this.updateDomainForm.get('selectedField').value.keyValue == 'address') {
            let state = this.stateList.filter(state => state.stateCode == this.updateDomainForm.get('state').value);
            let city = this.cityList.filter(city => city.cityCode == this.updateDomainForm.get('city').value);
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
    // this.activeModal.close(this.domainData);
  }
}

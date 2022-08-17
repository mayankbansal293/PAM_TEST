import { Component, OnInit, Input } from '@angular/core';
// import { CommonHelperService } from '../../../../services/common-helper.service';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { CommonHelperService } from '../../../../services/common-helper.service';

@Component({
  selector: 'country-state-city-form',
  templateUrl: './country-state-city-form.component.html',
  styleUrls: ['./country-state-city-form.component.scss']
})
export class CountryStateCityFormComponent implements OnInit {
  @Input() divsToShow;
  @Input() divsToMakeRequired;
  @Input() defaultPatchValue;
  countryList;
  stateList;
  cityList;
  regionList;
  countryStateCityForm: FormGroup;
  form;
  constructor(private commonHelper: CommonHelperService,
    private formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective) { }
    
  get formControl() {
    return (<FormGroup>this.form.controls['countryStateCityForm'])
  }

  ngOnInit() {
    this.form = this.ctrlContainer.form;
    this.form.addControl('countryStateCityForm',
      this.formBuilder.group({
        country: [''],
        state: [''],
        city: [''],
        zipCode: [''],
        region: ['']
      })
    )

    this.commonHelper.makeRequired(this.formControl, this.divsToMakeRequired || []);

    const request = {
      token: localStorage.getItem('authToken'),
      domainId: localStorage.getItem('accessSelfDomainOnly') == 'YES' ? localStorage.getItem('domainId') : 'ALL'
    }

    this.commonHelper.makeRequest(request, 'getCountryList', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.countryList = res.data;
        if (this.defaultPatchValue && this.countryList.length == 1) {
          this.formControl.patchValue({ country: this.countryList[0].countryCode })
          this.commonHelper.disableField(this.formControl, 'country');
        }
      }
    })

    this.formControl.get('country').valueChanges.subscribe(country => {
      if (country) {
        const data = {
          token: localStorage.getItem('authToken'),
          countryCode: country
        }
        this.commonHelper.setFieldValues(this.formControl, ['state'], [''])
        this.commonHelper.makeRequest(data, 'getStateList', false).subscribe(res => {
          if (res.statusCode == 0) {
            this.stateList = res.data;
            if (this.defaultPatchValue && this.stateList.length == 1) {
              this.formControl.patchValue({ state: this.stateList[0].stateCode })
              this.commonHelper.disableField(this.formControl, 'state');
            } else {
              this.formControl.patchValue({ state: '' })
              this.commonHelper.enableField(this.formControl, 'state');
            }
          }
        })
      }
    });

    this.formControl.get('state').valueChanges.subscribe(state => {
      if (state) {
        const data = {
          token: localStorage.getItem('authToken'),
          stateCode: state
        }
        this.commonHelper.setFieldValues(this.formControl, ['city'], [''])
        this.commonHelper.makeRequest(data, 'getCityList', false).subscribe(res => {
          if (res.statusCode == 0) {
            this.cityList = res.data;
            if (this.defaultPatchValue && this.cityList.length == 1) {
              this.formControl.patchValue({ city: this.cityList[0].cityCode })
              this.commonHelper.disableField(this.formControl, 'city');
            } else {
              this.formControl.patchValue({ city: '' })
              this.commonHelper.enableField(this.formControl, 'city');
            }
          }
        })
      }
    })

    if (this.divsToShow.includes('region')) {
      this.commonHelper.makeRequest({ token: localStorage.getItem('authToken') }, 'getRegionList', false).subscribe(res => {
        this.regionList = [];
        if (res.statusCode == 0) {
          this.regionList = res.data;
        }
        if (this.defaultPatchValue && this.regionList.length == 1) {
          this.commonHelper.setFieldValues(this.formControl, ['region'], [this.regionList[0].regionCode])
          this.commonHelper.disableField(this.formControl, 'region')
        }
      })
    }
  }
}

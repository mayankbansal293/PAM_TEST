declare var $: any;
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonHelperService } from '../../../services/common-helper.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';import { ValidationHelperService } from '../../../services/validation-helper.service';
@Component({
  selector: "app-search-user",
  templateUrl: "./search-user.component.html",
  styleUrls: ["./search-user.component.scss"]
})

export class SearchUserComponent implements OnInit, AfterViewInit {
  searchUserForm: UntypedFormGroup;
  orgTypeList = [];
  roleList = [];
  showTable = false;
  showComponent = true;
  userId: number;
  userData: any;
  showView = false;
  searchUserList: any;
  data: any;
  showViewButton;
  searchPermissions;
  roleId: number;
  responseMessage: any;
  errorMessage: any;
  navigationSubscription: any;
  mobileNoRegex = '';
  countryCodes = [];
  searchForm: UntypedFormGroup;
  countryStateCityForm: UntypedFormGroup;
  searchQuery = "";
  mobileMinMaxLength;
  mobileMaxLengthMob;
  mobileMinLengthMob;
  channelList = [];
  orgList = [];
  defaultDateFormat = localStorage.getItem("defaultDateFormat");
  request = {
    token: localStorage.getItem('authToken'),
    channelId: localStorage.getItem('accessSelfChannelOnly') == 'YES' ? localStorage.getItem('channelId') : 'ALL'
  };

  statusList = [
    {
      key: this.commonHelper.getCustomMessages("active"),
      value: "ACTIVE"
    }, {
      key: this.commonHelper.getCustomMessages("INACTIVE"),
      value: "INACTIVE"
    }, {
      key: this.commonHelper.getCustomMessages("terminate"),
      value: "TERMINATE"
    },
  ];

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

  constructor(
    private commonHelper: CommonHelperService,
    private fb: UntypedFormBuilder,
    private validationService: ValidationHelperService,
    private router: Router
  ) {
    this.countryStateCityForm = this.fb.group({});
    this.searchPermissions = this.commonHelper.returnPagePermission(
      "USER_SEARCH"
    );
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.searchUserForm) {
          this.showComponent = true;
          this.showView = false;
          this.resetPage();
        }
      }
    });
    this.commonHelper.getMOBILE_CODE_MIN_MAX_LENGTH.subscribe(mobileCodeMinMax => {
      this.mobileMinMaxLength = mobileCodeMinMax;
    })
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  ngOnInit() {

    this.searchUserForm = this.fb.group({
      roleId: [''],
      firstName: [''],
      lastName: [''],
      emailId: [''],
      mobileNo: [''],
      userName: ['',],
      userId: [''],
      countryCodeForMobileNo: [''],
      country: [''],
      state: [''],
      city: [''],
      isFinanceHead: [''],
      isHead: [''],
      status: [this.statusList[0].value],
      channelId: ['', Validators.required]
    });


    this.getChannelList(this.request, (err, data) => {
      this.channelList = data;
      this.channelList.forEach(channel => channel['channelNameChannelId'] = channel.channelName + ' (' + channel.channelId + ')')
      if (this.channelList.length == 1) {
        this.searchUserForm.patchValue({ channelId: this.channelList[0] });
        this.searchUserForm.controls.channelId.disable({ emitEvent: false });
      }
    })

    this.searchUserForm.get('countryCodeForMobileNo').valueChanges.subscribe(mobileCode => {
      let mobileData = this.mobileMinMaxLength.filter(data => Object.keys(data) == mobileCode);
      this.mobileMaxLengthMob = mobileData[0] ? mobileData[0][Object.keys(mobileData[0])[0]].max || '8' : '10';
      this.mobileMinLengthMob = mobileData[0] ? mobileData[0][Object.keys(mobileData[0])[0]].min || '10' : '7';
    });

    const data = {
      token: localStorage.getItem('authToken'),
    }
    this.commonHelper.makeRequest(data, 'getRoleList', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.roleList = res.data;
      }
    })
    this.searchUserForm.get('channelId').valueChanges.subscribe(channel => {
      if (channel && channel.COUNTRY_CODES) {
        this.countryCodes = channel.COUNTRY_CODES.split(',');
        this.searchUserForm.patchValue({ countryCodeForMobileNo: this.countryCodes[0] }, { emitEvent: false });
      }
    })

    this.searchForm = this.fb.group({
      searchField: [""]
    });

  }

  get countryStateCityFormControl() {
    return (<UntypedFormGroup>this.countryStateCityForm.get('countryStateCityForm'));
  }

  ngAfterViewInit(): void {

    this.searchForm.get('searchField').valueChanges.subscribe(res => {
      this.searchQuery = res;
    })

  }
  onSearch() {
    if (this.searchUserForm.valid) {
      let searchData = { request: {}, token: localStorage.getItem('authToken') };
      let formData = {
        emailId: this.searchUserForm.get('emailId').value || undefined,
        mobileCode: this.searchUserForm.get('mobileNo').value ? this.searchUserForm.get('countryCodeForMobileNo').value : '' || undefined,
        mobileNumber: this.searchUserForm.get('mobileNo').value ? this.searchUserForm.get('mobileNo').value : '' || undefined,
        userId: this.searchUserForm.get('userId').value || undefined,
        userName: this.searchUserForm.get('userName').value || undefined,
        city: this.countryStateCityFormControl.get('city').value || undefined,
        country: this.countryStateCityFormControl.get('country').value || undefined,
        firstName: this.searchUserForm.get('firstName').value || undefined,
        isHead: this.searchUserForm.get('isHead').value || undefined,
        lastName: this.searchUserForm.get('lastName').value || undefined,
        roleId: this.searchUserForm.get('roleId').value.roleId || undefined,
        state: this.countryStateCityFormControl.get('state').value || undefined,
        status: this.searchUserForm.get('status').value || undefined,
        channelId: this.searchUserForm.get('channelId').value.channelId
      }

      for (let key in formData) {
        if (formData[key]) {
          searchData.request[key] = formData[key]
        }
      }

      this.commonHelper.makeRequest(searchData, 'doUserSearch', true).subscribe(res => {
        this.data = [];
        if (res.statusCode == 0) {
          this.data = res.data;
          this.showTable = true;
          this.commonHelper.animateMessage.call(this, 'result');
        } else {
          this.errorMessage = res.message;
          this.showTable = false;
          this.commonHelper.animateMessage.call(this, 'containerWrap');
        }
      })
    }
    this.validationService.validateAllFormFields(this.searchUserForm)
  }

  resetPage() {
    Object.assign(this, {
      showTable: false,
      mobileNoRegex: '',
      searchQuery: ''
    })
    this.countryCodes = [];
    this.ngOnInit();
    this.searchUserForm.patchValue({ countryCodeForMobileNo: this.countryCodes[0] });
    Object.keys(this.countryStateCityFormControl.controls).forEach(key => {
      this.countryStateCityFormControl.get(key).patchValue('');
    });
    this.commonHelper.animateMessage.call(this, 'form');
    let accords = document.querySelectorAll('.accordion');
    for (var i = 0; i < accords.length; i++) {
      if ((<HTMLElement>accords[i].nextElementSibling).style.maxHeight)
        (<HTMLElement>accords[i]).click()
    }
  }
  getChannelList(requestData, callback): void {
    let channelList = [];
    this.commonHelper.makeRequest(requestData, 'getChannelList', false).subscribe(res => {
      if (res.statusCode == 0) {
        if (res.data instanceof Array) {
          for (let i = 0; i < res.data.length; i++) {
            channelList.push(res.data[i]);
          }
        } else {
          channelList.push(res.data);
        }
        callback(null, channelList);
      } else {
        this.errorMessage = res.message;
        this.commonHelper.animateMessage.call(this, 'containerWrap');
        callback(null, []);
      }
    });
  }
  showPage(event) {
    if (event) {
      Object.assign(this, {
        showView: false,
        showComponent: true,
        showTable: true
      })
    }
  }

  onEditPage(userid) {
    Object.assign(this, {
      userId: userid,
      showTable: false,
      showComponent: false,
      showView: true,
    })
  }

  checkPermission(permissionString: string): boolean {
    return this.searchPermissions.indexOf(permissionString) > -1 ? true : false;
  }

  get f() { return this.searchUserForm.controls; }


}

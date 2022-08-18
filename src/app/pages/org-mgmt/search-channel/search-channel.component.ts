import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CommonHelperService } from '../../../services/common-helper.service';

@Component({
  selector: 'app-search-channel',
  templateUrl: './search-channel.component.html',
  styleUrls: ['./search-channel.component.scss']
})
export class SearchChannelComponent implements OnInit {
  channelSearchForm: UntypedFormGroup;
  showTable = false;
  showEditDetail = false;
  navigationSubscription;
  activePage = 1;
  rPerPage = 200;
  channels = [];
  responseMessage = '';
  errorMessage = '';
  indexSelected;
  searchForm: UntypedFormGroup;
  searchQuery = '';
  addressForm: UntypedFormGroup;
  channelData;
  searchPermissions;
  channelList = [];
  countryCodes;
  request = {
    token: localStorage.getItem('authToken'),
    channelId: localStorage.getItem('accessSelfChannelOnly') == 'YES' ? localStorage.getItem('channelId') : 'ALL'
  };
  constructor(private router: Router, private fb: UntypedFormBuilder, private commonHelper: CommonHelperService,) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.channelSearchForm) {
          this.showEditDetail = false;
          this.resetPage();
        }
      }
    });

    this.searchPermissions = commonHelper.returnPagePermission("CHANNEL_SEARCH");
  }

  get channelId(): any {
    return this.channelSearchForm.get('channelId');
  }

  get channelName(): any {
    return this.channelSearchForm.get('channelName');
  }


  ngOnInit() {
    this.channelSearchForm = this.fb.group({
      channelId: [''],
      channelName: ['']
    })

    this.searchForm = this.fb.group({
      searchField: ['']
    });

    this.searchForm.get('searchField').valueChanges.subscribe(res => {
      this.searchQuery = res;
    })


    this.commonHelper.makeRequest(this.request, 'getChannelList', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.channelList = res.data;
      } else {
        this.errorMessage = res.message;
        this.commonHelper.animateMessage.call(this, 'containerWrap');
      }
    });
  }


  resetPage(): void {
    this.commonHelper.resetPage.call(this, {
      errorMessage: '',
      channels: [],
      showTable: false,
      searchQuery: '',
    })
    this.ngOnInit();
    this.commonHelper.animateMessage.call(this, 'form');
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  searchOrg(): void {
    if (this.channelSearchForm.valid) {
      let searchReqObj = {};
      let formData = {
        token: localStorage.getItem('authToken'),
        channelId: this.channelId.value || undefined,
        channelName: this.channelName.value || undefined,
      }
      for (let key in formData) {
        if (formData[key]) {
          searchReqObj[key] = formData[key]
        }
      }

      this.commonHelper.makeRequest(searchReqObj, 'doDomainSearch', true).subscribe(res => {
        this.channels = [];
        if (res.statusCode == 0) {
          this.channels = res.data;
          if (this.channels.length) {
            this.showTable = true;
            this.commonHelper.animateMessage.call(this, 'result');
          } else {
            this.showTable = false;
          }
        } else {
          this.errorMessage = res.message;
          this.commonHelper.animateMessage.call(this, 'containerWrap');
        }
      })
    } else {
      this.commonHelper.validateAllFormFields(this.channelSearchForm);
    }

  }
  displayedColumns=[{key:'domainName', value:'Domain Name'}, {key:'createdAt', value: 'Created At'}, {key:'createdBy', value:'Created By'}];

  getEditDetailForm(data, index: number): void {
    index = (this.activePage - 1) * this.rPerPage + index;
    this.indexSelected = index - 1;
    this.channelData = data
    this.showEditDetail = true;
    this.showTable = false;
  }

  childTalk(data: any): void {
    var updatedIndex = data.indexSelected;
    delete data.indexSelected;
    if (this.channels[updatedIndex]) {
      for (var key in data) {
        this.channels[updatedIndex][key] = data[key];
      }
    }
    this.showEditDetail = false;
    this.showTable = true;
  }

  onPageChange(pNum) {
    this.activePage = pNum;
  }

  checkPermission(permissionString: string): boolean {
    return this.searchPermissions.indexOf(permissionString) > -1 ? true : false;
  }

  getChannelData(channelId: number): any {
    var channelObj = {
      COUNTRY_CODES: "",
    };
    this.channelList.map(data => {
      if (data.channelId == channelId) {
        channelObj = data;
      }
    })
    return channelObj;
  }
}
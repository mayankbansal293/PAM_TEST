import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CommonHelperService } from '../../../services/common-helper.service';

@Component({
  selector: 'app-search-domain',
  templateUrl: './search-domain.component.html',
  styleUrls: ['./search-domain.component.scss']
})
export class SearchDomainComponent implements OnInit {
  domainSearchForm: FormGroup;
  showTable = false;
  showEditDetail = false;
  navigationSubscription;
  activePage = 1;
  rPerPage = 200;
  domains = [];
  responseMessage = '';
  errorMessage = '';
  indexSelected;
  searchForm: FormGroup;
  searchQuery = '';
  addressForm:FormGroup;
  domainData;
  searchPermissions;
  domainList = [];
  countryCodes;
  request = {
    token: localStorage.getItem('authToken'),
    domainId: localStorage.getItem('accessSelfDomainOnly') == 'YES' ? localStorage.getItem('domainId') : 'ALL'
  };
  constructor(private router: Router,private fb: FormBuilder,private commonHelper: CommonHelperService,) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.domainSearchForm) {
          this.showEditDetail = false;
          this.resetPage();
        }
      }
    });

    // this.searchPermissions = commonHelper.returnPagePermission("DOMAIN_SEARCH");
  }

  get domainId(): any {
    return this.domainSearchForm.get('domainId');
  }

  get domainName(): any {
    return this.domainSearchForm.get('domainName');
  }
 

  ngOnInit() {
    this.domainSearchForm = this.fb.group({
      domainId: [''],
      domainName:['']
    })

    this.searchForm = this.fb.group({
      searchField: ['']
    });

    this.searchForm.get('searchField').valueChanges.subscribe(res => {
      this.searchQuery = res;
    })


    this.commonHelper.makeRequest(this.request, 'getDomainList', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.domainList = res.data;
        }else{
          this.errorMessage=res.message;
          this.commonHelper.animateMessage.call(this, 'containerWrap');
        }
      });              
  }


  resetPage(): void {
    this.commonHelper.resetPage.call(this, {
      errorMessage: '',
      domains: [],
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
    if (this.domainSearchForm.valid) {
      let searchReqObj = {};
      let formData = {
        token: localStorage.getItem('authToken'),
        domainId: this.domainId.value || undefined,
        domainName: this.domainName.value || undefined,
      }
      for (let key in formData) {
        if (formData[key]) {
          searchReqObj[key] = formData[key]
        }
      }

      this.commonHelper.makeRequest(searchReqObj, 'doDomainSearch', true).subscribe(res => {
        this.domains = [];
        if (res.statusCode == 0) {
          this.domains = res.data;
          if (this.domains.length) {
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
      this.commonHelper.validateAllFormFields(this.domainSearchForm);
    }

  }

  getEditDetailForm(data, index: number): void {
    index = (this.activePage - 1) * this.rPerPage + index;
    this.indexSelected = index - 1;
    this.domainData=data
    this.showEditDetail = true;
    this.showTable = false;
  }

  childTalk(data: any): void {
    var updatedIndex = data.indexSelected;
    delete data.indexSelected;
    if (this.domains[updatedIndex]) {
      for (var key in data) {
        this.domains[updatedIndex][key] = data[key];
      }
    }
    this.showEditDetail = false;
    this.showTable = true;
  }

  onPageChange(pNum) {
    this.activePage = pNum;
  }

  checkPermission(permissionString: string): boolean {
    // return this.searchPermissions.indexOf(permissionString) > -1 ? true : false;
    return true;
  }

  getDomainData(domainId: number): any {
    var domainObj = {
      COUNTRY_CODES: "",
    };
    this.domainList.map(data=>{
      if (data.domainId == domainId) {
        domainObj = data;
      }
    })
    return domainObj;
  }
}
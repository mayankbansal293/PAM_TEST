import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {CommonHelperService} from '../../../../services/common-helper.service';
import {UtilService} from 'src/app/services/util.service';
import {BankingProfileModel} from 'src/app/model/audit-report.model'
import {DestroyService} from 'src/app/services/destroy.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-mobile-number',
  templateUrl: './mobile-number.component.html',
  styleUrls: ['./mobile-number.component.scss']
})
export class MobileNumberComponent implements OnInit {
  //changeByList = BankingProfileModel.changeByList;
  changeByConfig = BankingProfileModel.changeByConfig;
  navigationSubscription: any;
  mobileNumberForm: UntypedFormGroup;
  aliasList: Array<any> = [];
  changeByList:Array<any>=[];
  primaryIdTypeName;
  configDomain = {
    displayKey: "domainNameDomainId",
    search: true,
    height: 'auto',
    placeholder: 'Select Domain',
    customComparator: () => {},
    noResultsFound: 'No results found!',
    clearOnSelection: true,
    searchOnKey: 'domainName'
  };

  configAlias = {
    limitTo: 1000,
    displayKey: "aliasNameAliasId",
    search: true,
    height: 'auto',
    placeholder: 'Select Alias',
    noResultsFound: 'No results found!',
    clearOnSelection: true,
    searchOnKey: 'aliasNameAliasId'
  };
  toDateMax = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
  domainList: Array<any> = [];
  mobileChangeReportData: Array<any> = [];
  errorMessage: any;
  responseMessage: any;
  activePage = 1;
  rPerPage = 200;
  domainConfig: any;
  get domain() {
    return this.mobileNumberForm.get('domainId');
  }
  get alias() {
    return this.mobileNumberForm.get('aliasId');
  }

  get f() {
    return this.mobileNumberForm.controls;
  }
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private commonHelper: CommonHelperService,
    private utilService: UtilService,
    private destroy$: DestroyService
  ) {
    this.navigationSubscription = this.router.events.pipe(takeUntil(this.destroy$)).subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.mobileNumberForm) {
          this.ngOnInit();
        }
      }
    });

  }

  ngOnInit() {
    this.mobileNumberForm = this.fb.group({
      domainId: ['', Validators.required],
      aliasId: ['', Validators.required],
      startDate: [this.toDateMax, Validators.required],
      endDate: [this.toDateMax, Validators.required],
      firstName: [null],
      lastName: [null],
      changeBy: [null],
      rsaId: [null],
      oldMobileNo: [null],
      newMobileNo: [null]
    });
    this.getDomainList();

    this.mobileNumberForm.get('domainId').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(domain => {
      if (this.mobileNumberForm.controls.aliasId.value) {
        this.mobileNumberForm.controls.aliasId.setValue(['', Validators.required])
      }
      this.domainConfig = domain;
      this.primaryIdTypeName = this.domainConfig.PRIMARY_ID_TYPE_NAME;
      this.mobileNumberForm.controls.oldMobileNo.setValidators([Validators.pattern(this.domainConfig.UI_MOBILE_REGEX)]);
      this.mobileNumberForm.controls.oldMobileNo.updateValueAndValidity();
      this.mobileNumberForm.controls.newMobileNo.setValidators([Validators.pattern(this.domainConfig.UI_MOBILE_REGEX)]);
      this.mobileNumberForm.controls.newMobileNo.updateValueAndValidity();
      this.mobileNumberForm.controls.rsaId.setValidators([Validators.pattern(this.domainConfig.PRIMARY_ID_REGEX)]);
      this.mobileNumberForm.controls.rsaId.updateValueAndValidity();
      if (domain.domainId)
        this.getAliasLiast()
     })

    this.mobileNumberForm.get('domainId').valueChanges.subscribe(domain=>{
      this.changeByList=[];
      this.f.changeBy.patchValue('')
      if(domain && domain.domainId){
        let reqData={
          request:{
            domainId : domain.domainId,
            roleCheckAllowed: "NO",
            isAuditReport:"YES"
          },
          token: localStorage.getItem('authToken')
        }
        this.commonHelper.makeRequest(reqData,'doUserSearch',false).subscribe(res=>{
          this.changeByList=res.data;
        })
      }
    })
        
    this.mobileNumberForm.get('startDate').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(date => {
      let startDate = this.utilService.formatDate(date);
      let endDate = this.utilService.formatDate(this.mobileNumberForm.get('endDate').value);
      if (endDate < startDate) {
        this.mobileNumberForm.get('endDate').setValue(date);
        this.mobileNumberForm.controls.endDate.updateValueAndValidity();
      }
    })
  }
  getDomainList() {
    const sendToken = {
      token: localStorage.getItem('authToken'),
      domainId: localStorage.getItem('accessSelfDomainOnly') == 'YES' ? localStorage.getItem('domainId') : 'ALL'
    };
    this.commonHelper.makeRequest(sendToken, 'getDomainList', false).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.statusCode == 0) {
        this.domainList = res.data;
        this.domainList.forEach(domain => domain['domainNameDomainId'] = domain.domainName + ' (' + domain.domainId + ')')
        if (this.domainList.length == 1) {
          this.mobileNumberForm.patchValue({domainId: this.domainList[0]},{ emitEvent: false });
        }
      }
    });
  }
  getAliasLiast(){
    let requestBody = {
      domainId: this.domainConfig.domainId,
      token: localStorage.getItem('authToken'),
    }
    this.commonHelper.makeRequest(requestBody, 'getAlias', true).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.statusCode == 0) {
          this.aliasList = res.data;
          this.aliasList.forEach(aliasList => aliasList['aliasNameAliasId'] = aliasList.aliasName + ' (' + aliasList.aliasId + ')')
        }
      })
  }
  resetPage() {
    this.mobileChangeReportData = [];
    this.aliasList = [];
    this.domainList = [];
    this.changeByList=[];
    this.ngOnInit();
  }
  onSearch(type?) {
    if (this.mobileNumberForm.valid) {
      let request = {
        token: localStorage.getItem('authToken'),
        mobileChangeData: {
          aliasId: this.alias.value.aliasId,
          domainId: this.domain.value.domainId,
          startDate: this.utilService.formatDate(this.mobileNumberForm.get('startDate').value),
          endDate: this.utilService.formatDate(this.mobileNumberForm.get('endDate').value),
          fileType: type,
          firstName: this.f.firstName.value,
          lastName: this.f.lastName.value,
          changedBy: this.f.changeBy.value ? this.f.changeBy.value.userId : null,
          newMobileNo: this.f.newMobileNo.value,
          oldMobileNo: this.f.oldMobileNo.value,
          rsaId: this.f.rsaId.value,
        }
      }
      this.commonHelper.makeRequest(request, "fetchMobileNumberChangeReport", true).pipe(takeUntil(this.destroy$)).subscribe(res => {
        console.log("response :::", res);
        if (res.statusCode == 0) {
          if (type) {
            for (let url of res.data) {
              const link = document.createElement('a');
              link.setAttribute('target', '_blank');
              link.setAttribute('href', url);
              document.body.appendChild(link);
              link.click();
            }
          } else {
            this.mobileChangeReportData = res.data;
            this.mobileChangeReportData.map(res => {
              res.merchantPlayerId = Number(res.merchantPlayerId);
            })
          }
        } else {
          this.errorMessage = res.message;
          if (this.errorMessage) {
            this.mobileChangeReportData = [];
          }
          this.commonHelper.animateMessage.call(this, 'containerWrap');
        }
      })
    } else {
      this.commonHelper.validateAllFormFields(this.mobileNumberForm);
    }
    // console.log("FORM value is::", this.mobileNumberForm.value);

  }
  onPageChange(pNum) {
    this.activePage = pNum;
  }
  downloadReport(type: string) {
    this.mobileNumberForm.patchValue({fileType: type});
    this.onSearch(type);
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}

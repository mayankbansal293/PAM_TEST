import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {CommonHelperService} from '../../../../services/common-helper.service';
import {UtilService} from 'src/app/services/util.service';
import {BankingProfileModel} from 'src/app/model/audit-report.model'
import {takeUntil} from 'rxjs/operators';
import {DestroyService} from 'src/app/services/destroy.service';
@Component({
  selector: 'app-email-change-report',
  templateUrl: './email-change-report.component.html',
  styleUrls: ['./email-change-report.component.scss']
})
export class EmailChangeReportComponent implements OnInit {
  changeByList = [];
  changeByConfig = BankingProfileModel.changeByConfig;
  navigationSubscription: any;
  emailChangeForm: UntypedFormGroup;
  regexConfig: any;
  aliasList: Array<any> = [];
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
  emailChangeReportData: Array<any> = [];
  errorMessage: any;
  responseMessage: any;
  activePage = 1;
  rPerPage = 200;
  get domain() {
    return this.emailChangeForm.get('domainId');
  }
  get alias() {
    return this.emailChangeForm.get('aliasId');
  }

  get f() {
    return this.emailChangeForm.controls;
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
        if (this.emailChangeForm) {
          this.ngOnInit();
        }
      }
    });

  }

  ngOnInit() {
    this.getDomainList();
    this.emailChangeForm.get('domainId').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(domain => {
      if (this.emailChangeForm.controls.aliasId.value) {
        this.emailChangeForm.controls.aliasId.setValue(['']);
      }
      this.primaryIdTypeName = domain.PRIMARY_ID_TYPE_NAME;
      this.emailChangeForm.controls.oldEmailId.setValidators([Validators.pattern(domain.EMAIL_REGEX)]);
      this.emailChangeForm.controls.oldEmailId.updateValueAndValidity();
      this.emailChangeForm.controls.newEmailId.setValidators([Validators.pattern(domain.EMAIL_REGEX)]);
      this.emailChangeForm.controls.newEmailId.updateValueAndValidity();
      this.emailChangeForm.controls.rsaId.setValidators([Validators.pattern(domain.PRIMARY_ID_REGEX)]);
      this.emailChangeForm.controls.rsaId.updateValueAndValidity();
      if (domain.domainId) {
        let requestBody = {
          domainId: domain.domainId,
          token: localStorage.getItem('authToken'),
        }
        this.commonHelper.makeRequest(requestBody, 'getAlias', true).pipe(takeUntil(this.destroy$)).subscribe(res => {
          if (res.statusCode == 0) {
            this.aliasList = res.data;
            this.aliasList.forEach(aliasList => aliasList['aliasNameAliasId'] = aliasList.aliasName + ' (' + aliasList.aliasId + ')')
          }
        })
      }
    })

    this.emailChangeForm.get('domainId').valueChanges.subscribe(domain=>{
      this.changeByList=[];
      this.f.changeBy.patchValue('');
      if(domain && domain.domainId){
        let reqData={
          request:{
            domainId : domain.domainId,
            roleCheckAllowed: "NO",
            isAuditReport:"YES"},
            token: localStorage.getItem('authToken')
        }
        this.commonHelper.makeRequest(reqData,'doUserSearch',false).subscribe(res=>{
          this.changeByList=res.data;
        })
      }
    })

    this.emailChangeForm.get('startDate').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(date => {
      let startDate = this.utilService.formatDate(date);
      let endDate = this.utilService.formatDate(this.emailChangeForm.get('endDate').value);
      if (endDate < startDate) {
        this.emailChangeForm.get('endDate').setValue(date);
        this.emailChangeForm.controls.endDate.updateValueAndValidity();
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
        this.domainList.forEach(domain => domain['domainNameDomainId'] = domain.domainName + ' (' + domain.domainId + ')');
        if (this.domainList.length == 1) {
          this.emailChangeForm.patchValue({domainId: this.domainList[0]}, {emitEvent: false});
        }
      }
    });
    this.emailChangeForm = this.fb.group({
      domainId: ['', Validators.required],
      aliasId: ['', Validators.required],
      startDate: [this.toDateMax, Validators.required],
      endDate: [this.toDateMax, Validators.required],
      firstName: [null],
      lastName: [null],
      changeBy: [null],
      rsaId: [null],
      oldEmailId: [null],
      newEmailId: [null]
    });
  }
  resetPage() {
    this.emailChangeReportData = [];
    this.aliasList = [];
    this.domainList = [];
    this.changeByList=[];
    this.ngOnInit();
  }
  onSearch(type?) {
    if (this.emailChangeForm.valid) {
      let request = {
        token: localStorage.getItem('authToken'),
        emailChangeData: {
          aliasId: this.alias.value.aliasId,
          domainId: this.domain.value.domainId,
          startDate: this.utilService.formatDate(this.emailChangeForm.get('startDate').value),
          endDate: this.utilService.formatDate(this.emailChangeForm.get('endDate').value),
          fileType: type,
          firstName: this.f.firstName.value,
          lastName: this.f.lastName.value,
          changedBy: this.f.changeBy.value ? this.f.changeBy.value.userId : null,
          oldEmailId: this.f.oldEmailId.value,
          newEmailId: this.f.newEmailId.value,
          rsaId: this.f.rsaId.value
        }
      }
      this.commonHelper.makeRequest(request, "fetchEmailChangeReport", true).pipe(takeUntil(this.destroy$)).subscribe(res => {
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
            this.emailChangeReportData = res.data;
            this.emailChangeReportData.map(res=>{
              res.merchantPlayerId = Number(res.merchantPlayerId)
            })
          }
        } else {
          this.errorMessage = res.message;
          this.commonHelper.animateMessage.call(this, 'containerWrap');
          if (this.errorMessage) {
            this.emailChangeReportData = [];
          }
        }
      })
    } else {
      this.commonHelper.validateAllFormFields(this.emailChangeForm);
    }
    // console.log("FORM value is::", this.emailChangeForm.value);


  }
  onPageChange(pNum) {
    this.activePage = pNum;
  }
  downloadReport(type: string) {
    this.emailChangeForm.patchValue({fileType: type});
    this.onSearch(type);
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  returnNumber(str) {
    return Number(str);
  }
}


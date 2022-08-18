import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import { BankingProfileModel } from '../../../@core/model/audit-report.model';
import { CommonHelperService } from '../../../services/common-helper.service';
import { DestroyService } from '../../../services/destroy.service';
import { UtilService } from '../../../services/util.service';
@Component({
  selector: 'app-rsa-id-change-report',
  templateUrl: './rsa-id-change-report.component.html',
  styleUrls: ['./rsa-id-change-report.component.scss']
})
export class RsaIdChangeReportComponent implements OnInit {
  changeByList = []
  changeByConfig = BankingProfileModel.changeByConfig;
  navigationSubscription: any;
  rsaIdChangeForm: UntypedFormGroup;
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
  rsaIdChangeReportData: Array<any> = [];
  errorMessage: any;
  responseMessage: any;
  activePage = 1;
  rPerPage = 200;
  get domain() {
    return this.rsaIdChangeForm.get('domainId');
  }
  get alias() {
    return this.rsaIdChangeForm.get('aliasId');
  }

  get f() {
    return this.rsaIdChangeForm.controls;
  }
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private commonHelper: CommonHelperService,
    private utilService: UtilService,
    private readonly destroy$: DestroyService
  ) {
    this.navigationSubscription = this.router.events.pipe(takeUntil(this.destroy$)).subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.rsaIdChangeForm) {
          this.ngOnInit();
        }
      }
    });

  }

  ngOnInit() {
    this.rsaIdChangeForm = this.fb.group({
      domainId: ['', Validators.required],
      aliasId: ['', Validators.required],
      startDate: [this.toDateMax, Validators.required],
      endDate: [this.toDateMax, Validators.required],
      firstName: [null],
      lastName: [null],
      changeBy: [null],
      rsaId: [null],
      oldRsaId: [null],
      newRsaId: [null]
    });
    this.getDomainList();

    this.rsaIdChangeForm.get('domainId').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(domain => {
      if(this.rsaIdChangeForm.controls.aliasId.value){
        this.rsaIdChangeForm.controls.aliasId.setValue(['']);
      }
      this.primaryIdTypeName = domain.PRIMARY_ID_TYPE_NAME;
      this.rsaIdChangeForm.controls.rsaId.setValidators([Validators.pattern(domain.PRIMARY_ID_REGEX)]);
      this.rsaIdChangeForm.controls.rsaId.updateValueAndValidity();
      this.rsaIdChangeForm.controls.oldRsaId.setValidators([Validators.pattern(domain.PRIMARY_ID_REGEX)]);
      this.rsaIdChangeForm.controls.oldRsaId.updateValueAndValidity();
      this.rsaIdChangeForm.controls.newRsaId.setValidators([Validators.pattern(domain.PRIMARY_ID_REGEX)]);
      this.rsaIdChangeForm.controls.newRsaId.updateValueAndValidity();
      if (domain.domainId){
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

    this.rsaIdChangeForm.get('domainId').valueChanges.subscribe(domain=>{
      this.changeByList=[];
      this.f.changeBy.patchValue('')
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

    this.rsaIdChangeForm.get('startDate').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(date => {
      let startDate = this.utilService.formatDate(date);
      let endDate = this.utilService.formatDate(this.rsaIdChangeForm.get('endDate').value);
      if(endDate < startDate){
        this.rsaIdChangeForm.get('endDate').setValue(date);
        this.rsaIdChangeForm.controls.endDate.updateValueAndValidity();
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
          this.rsaIdChangeForm.patchValue({domainId: this.domainList[0]},{ emitEvent: false });
        }
      }
    });
  }
  resetPage() {
    this.rsaIdChangeReportData = [];
    this.aliasList = [];
    this.domainList = [];
    this.changeByList=[];
    this.ngOnInit();
  }
  onSearch(type?) {
    if (this.rsaIdChangeForm.valid) {
      let request = {
        token: localStorage.getItem('authToken'),
        rsaIdChangeData: {
          aliasId: this.alias.value.aliasId,
          domainId: this.domain.value.domainId,
          startDate: this.utilService.formatDate(this.rsaIdChangeForm.get('startDate').value),
          endDate: this.utilService.formatDate(this.rsaIdChangeForm.get('endDate').value),
          fileType: type,
          firstName: this.f.firstName.value,
          lastName: this.f.lastName.value,
          changedBy: this.f.changeBy.value?this.f.changeBy.value.userId:null,
          newRsaId: this.f.newRsaId.value,
          oldRsaId: this.f.oldRsaId.value,
          rsaId: this.f.rsaId.value
        }
      }
      this.commonHelper.makeRequest(request, "fetchRsaIdChangeReport", true).pipe(takeUntil(this.destroy$)).subscribe(res => {
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
            this.rsaIdChangeReportData = res.data;
            this.rsaIdChangeReportData.map(res => {
              res.merchantPlayerId = Number(res.merchantPlayerId);
            })
          }
        } else {
          this.errorMessage = res.message;
          this.commonHelper.animateMessage.call(this, 'containerWrap');
          if(this.errorMessage){
            this.rsaIdChangeReportData = [];
          }
        }
      })
    } else {
      this.commonHelper.validateAllFormFields(this.rsaIdChangeForm);
    }
    // console.log("FORM value is::", this.rsaIdChangeForm.value);


  }
  onPageChange(pNum) {
    this.activePage = pNum;
  }
  downloadReport(type: string) {
    this.rsaIdChangeForm.patchValue({fileType: type});
    this.onSearch(type);
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}

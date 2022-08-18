import {Component, OnInit, Pipe} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import { BankingProfileModel, userUpdate } from '../../../@core/model/audit-report.model';
import { CommonHelperService } from '../../../services/common-helper.service';
import { DestroyService } from '../../../services/destroy.service';
import { UtilService } from '../../../services/util.service';
@Component({
  selector: 'app-user-update-report',
  templateUrl: './user-update-report.component.html',
  styleUrls: ['./user-update-report.component.scss']
})
export class UserUpdateReportComponent implements OnInit {
  changeByList = BankingProfileModel.changeByList;
  changeByConfig = BankingProfileModel.changeByConfig;
  configDomain= userUpdate.configChannel;
  userUpdateForm: UntypedFormGroup;
  domainList: Array<any> = [];
  errorMessage: any;
  rPerPage = 200;
  activePage = 1;
  tableData: Array<any> = [];
  placeHolderDate: any;
  toDateMax = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
  userUpdateModel = userUpdate;

  constructor(
    private fb: UntypedFormBuilder,
    private commonHelper: CommonHelperService,
    private utilService: UtilService,
    private router:Router,
    private destroy$:DestroyService
  ) {
    //  this.router.events.pipe(takeUntil(this.destroy$)).subscribe((e: any) => {
    //   if (e instanceof NavigationEnd) {
    //     if (this.userUpdateForm) {
    //       this.ngOnInit();
    //     }
    //   }
    // });
  }

  ngOnInit() {
    this.userUpdateForm = this.fb.group({
      domainId: ['', Validators.required],
      userName: [null],
      startDate: [this.toDateMax, Validators.required],
      endDate: [this.toDateMax, Validators.required],
    });
    this.getDomainList();
    this.userUpdateForm.get('startDate').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(date => {
      let startDate = this.utilService.formatDate(date);
      let endDate = this.utilService.formatDate(this.userUpdateForm.get('endDate').value);
      if (endDate < startDate) {
        this.userUpdateForm.get('endDate').setValue(date);
        this.userUpdateForm.controls.endDate.updateValueAndValidity();
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
          this.userUpdateForm.patchValue({domainId: this.domainList[0]});
        }
      }
    });
  }

  onSearch() {
    if (this.userUpdateForm.valid) {
      let request = {
        token: localStorage.getItem('authToken'),
        userDataChangeReportRequest: {
          domainId: this.controls.domainId.value.domainId,
          startDate: this.utilService.formatDate(this.userUpdateForm.get('startDate').value),
          endDate: this.utilService.formatDate(this.userUpdateForm.get('endDate').value),
          userName: this.controls.userName.value ? this.controls.userName.value : null
        }
      }

      this.commonHelper.makeRequest(request, 'canFetchUserUpdateReport', true).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res.statusCode == 0) {
          this.tableData = res.data;
          this.tableData.map(x => {
            let changedkeys = this.userUpdateModel.changedDataKeys;
            for (let newDataKey in x.oldData) {
              changedkeys.forEach(changekey => {
                changekey.keys.forEach(key => {
                  if (key === newDataKey) {
                    if (changekey.values === 'Address'){
                      x['changedType'] = changekey.values;
                      x['oldValue'] = this.address(x.oldData);
                      x['newValue'] = this.address(x.newData);
                    } else {
                      x['changedType'] = changekey.values;
                      x['oldValue'] = x.oldData[key];
                      x['newValue'] = x.newData[key];
                    }
                  }
                })
              })
            }
            return x;
          })
        } else {
          this.errorMessage = res.message;
          this.commonHelper.animateMessage.call(this, 'containerWrap');
          if (this.errorMessage) {
            this.tableData = [];
          }
        }
      });
    }
    else {
      this.commonHelper.validateAllFormFields(this.userUpdateForm);
      this.tableData = [];
    }
  }

  resetPage() {
    this.errorMessage = "";
    this.tableData = [];
    this.ngOnInit();
  }

  address(item){
    let address = item.addressOne +','+ 
                  item.addressTwo +','+ 
                  item.city +','+
                  item.state +','+
                  item.country +','+
                  item.zipCode;
    return address;
  }

  onPageChange(pNum) {
    this.activePage = pNum;
  }

  get controls() {
    return this.userUpdateForm.controls;
  }
}

declare var $: any;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonHelperService } from '../../../../services/common-helper.service';
import { UpdateSearchDomainModalComponent } from '../update-search-domain-modal/update-search-domain-modal.component';

@Component({
  selector: 'app-edit-domain',
  templateUrl: './edit-domain.component.html',
  styleUrls: ['./edit-domain.component.scss']
})
export class EditDomainComponent implements OnInit {

  @Input() inputDomainData;
  @Input() domainList;
  @Input() indexSelected;
  @Output() talk: EventEmitter<string> = new EventEmitter<string>();
  dynamicSelect;
  detailData;
  responseMessage = '';
  errorMessage = '';
  noData = false;
  request = {
    token: localStorage.getItem('authToken'),
  }

  parentTalk() {
    if (this.detailData) {
      for (var key in this.inputDomainData) {
        if (this.detailData[key]) this.inputDomainData[key] = this.detailData[key];
      }
      this.inputDomainData.indexSelected = this.indexSelected;
    }
    this.talk.emit(this.inputDomainData);
  }

  searchPermissions;

  constructor(
    // private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private commonHelper: CommonHelperService,
  ) {
    this.searchPermissions = commonHelper.returnPagePermission("DOMAIN_SEARCH");
  }

  ngOnInit() {

    this.commonHelper.makeRequest({
      token: localStorage.getItem('authToken'),
      domainId: parseInt(this.inputDomainData.domainId),
    }, 'getDomainDetails', true).subscribe(res => {
      if (res.statusCode == 0) {
        this.detailData = res.data;
      }
    })

  }

  checkPermission(permissionString: string): boolean {
    return this.searchPermissions.indexOf(permissionString) > -1 ? true : false;
  }
  blockOrg(): void {

    var blockData = {
      token: this.request.token,
      orgId: this.inputDomainData.orgId
    }

    this.commonHelper.makeRequest(blockData, 'blockOrg', true).subscribe(res => {
      if (res.statusCode == 0) {
        this.detailData.status = 'INACTIVE';
        this.responseMessage = res.message;
      } else {
        this.errorMessage = res.message;
      }
      this.commonHelper.animateMessage.call(this, 'containerWrap');
    })

  }

  unblockOrg(): void {

    var unblockData = {
      token: this.request.token,
      orgId: this.inputDomainData.orgId
    }

    this.commonHelper.makeRequest(unblockData, 'unblockOrg', true).subscribe(res => {
      if (res.statusCode == 0) {
        this.detailData.status = 'ACTIVE';
        this.responseMessage = res.message;
      } else {
        this.errorMessage = res.message;
      }
      this.commonHelper.animateMessage.call(this, 'containerWrap');
    })

  }

  updateOrg(): void {
  //   const activeModal = this.modalService.open(UpdateSearchDomainModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
  //   activeModal.componentInstance.modalHeader = this.commonHelper.getCustomMessages('updateDetails');
  //   activeModal.componentInstance.selectTypeArray = [];
  //   if (this.searchPermissions.indexOf('CAN_UPDATE_DOMAIN') > -1) {
  //     activeModal.componentInstance.selectTypeArray.push({
  //       keyValue: 'OTHER',
  //       keyName: this.commonHelper.getCustomMessages('personalDetails')
  //     });
  //   }

  //   activeModal.componentInstance.domainData = this.detailData;
  //   activeModal.componentInstance.domainList = this.domainList;

  //   activeModal.componentInstance.selectOtherContent = [
    
  //  {
  //     keyValue: 'mobileNumber',
  //     keyName: this.commonHelper.getCustomMessages('mobileNumber')
  //   }, {
  //     keyValue: 'address',
  //     keyName: this.commonHelper.getCustomMessages('address')
  //   }
  //   ];

  //   activeModal.componentInstance.detailData = this.detailData;
  //   activeModal.result.then((data) => {
  //     if (data && !data.error) {
  //       this.detailData = data;
  //     } else if (data && data.error) {
  //       this.errorMessage = data.message;
  //       this.commonHelper.animateMessage.call(this, 'containerWrap');
  //     }
  //   });
  }


  ngOnDestroy() {
    // this.modalService.dismissAll();
  }
}

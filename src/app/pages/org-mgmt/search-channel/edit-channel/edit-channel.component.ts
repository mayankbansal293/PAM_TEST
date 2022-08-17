declare var $: any;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonHelperService } from '../../../../services/common-helper.service';
import { UpdateSearchChannelModalComponent } from '../update-search-channel-modal/update-search-channel-modal.component';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent implements OnInit {

  @Input() inputChannelData;
  @Input() channelList;
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
      for (var key in this.inputChannelData) {
        if (this.detailData[key]) this.inputChannelData[key] = this.detailData[key];
      }
      this.inputChannelData.indexSelected = this.indexSelected;
    }
    this.talk.emit(this.inputChannelData);
  }

  searchPermissions;

  constructor(
    // private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private commonHelper: CommonHelperService,
  ) {
    this.searchPermissions = commonHelper.returnPagePermission("CHANNEL_SEARCH");
  }

  ngOnInit() {

    this.commonHelper.makeRequest({
      token: localStorage.getItem('authToken'),
      channelId: parseInt(this.inputChannelData.channelId),
    }, 'getChannelDetails', true).subscribe(res => {
      if (res.statusCode == 0) {
        this.detailData = res.data;
      }
    })

  }

  checkPermission(permissionString: string): boolean {
    return this.searchPermissions.indexOf(permissionString) > -1 ? true : false;
  }
  blockOrg(): void {

    let blockData = {
      token: this.request.token,
      orgId: this.inputChannelData.orgId
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

    let unblockData = {
      token: this.request.token,
      orgId: this.inputChannelData.orgId
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
    // const activeModal = this.modalService.open(UpdateSearchChannelModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
    // activeModal.componentInstance.modalHeader = this.commonHelper.getCustomMessages('updateDetails');
    // activeModal.componentInstance.selectTypeArray = [];
    // if (this.searchPermissions.indexOf('CAN_UPDATE_CHANNEL') > -1) {
    //   activeModal.componentInstance.selectTypeArray.push({
    //     keyValue: 'OTHER',
    //     keyName: this.commonHelper.getCustomMessages('personalDetails')
    //   });
    // }

    // activeModal.componentInstance.channelData = this.detailData;
    // activeModal.componentInstance.channelList = this.channelList;

    // activeModal.componentInstance.selectOtherContent = [

    //   {
    //     keyValue: 'mobileNumber',
    //     keyName: this.commonHelper.getCustomMessages('mobileNumber')
    //   }, {
    //     keyValue: 'address',
    //     keyName: this.commonHelper.getCustomMessages('address')
    //   }
    // ];

    // activeModal.componentInstance.detailData = this.detailData;
    // activeModal.result.then((data) => {
    //   if (data && !data.error) {
    //     this.detailData = data;
    //   } else if (data && data.error) {
    //     this.errorMessage = data.message;
    //     this.commonHelper.animateMessage.call(this, 'containerWrap');
    //   }
    // });
  }


  ngOnDestroy() {
    // this.modalService.dismissAll();
  }
}

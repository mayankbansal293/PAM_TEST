import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonHelperService } from '../../../../services/common-helper.service';

@Component({
  selector: 'app-update-search-alias-modal',
  templateUrl: './update-search-alias-modal.component.html',
  styleUrls: ['./update-search-alias-modal.component.scss']
})
export class UpdateSearchAliasModalComponent implements OnInit {

  updateAliasForm: UntypedFormGroup;
  orgTypeList = [];
  data;
  statusList = [{
    "key": this.commonHelper.getCustomMessages('select'),
    "value": ""
  },
  {
    "key": this.commonHelper.getCustomMessages('active'),
    "value": "ACTIVE"
  },
  {
    "key": this.commonHelper.getCustomMessages('INACTIVE'),
    "value": "INACTIVE"
  }
  ];
  assignableOrgTypeList = [];
  channelId;
  channelList;
  isDisabled = false;
  dropdownSettings = {
    singleSelection: false,
    idField: 'orgTypeCode',
    textField: 'orgDisplayName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: false
  };
  constructor(private fb: UntypedFormBuilder, private commonHelper: CommonHelperService, 
    // public modal: NgbActiveModal
    )
     {
  }

  ngOnInit() {
    this.updateAliasForm = this.fb.group({
      status: ['', Validators.required],
      channel: ['', Validators.required],
      aliasName: ['', Validators.required],
    })

    this.updateAliasForm.get('status').patchValue(this.data.status || '');
    this.updateAliasForm.get('aliasName').patchValue(this.data.aliasName || '');
    let channelData = this.channelList.filter(channel => channel.channelId == this.channelId)[0];
    this.updateAliasForm.get('channel').patchValue(channelData.channelName);
  }


  closeModal() {
    // this.modal.close(this.data);
  }

  errorMessage;
  responseMessage;

  updateAlias() {
    if (this.updateAliasForm.valid) {
      const updateAliasRequest = {
        'token': localStorage.getItem('authToken'),
        'aliasId': this.data.aliasId,
        'status': this.updateAliasForm.get('status').value,
        'aliasName': this.updateAliasForm.get('aliasName').value,
        'channelId': this.channelId
      }
      Object.assign(this.data, {
        aliasName: this.updateAliasForm.get('aliasName').value,
        status: this.updateAliasForm.get('status').value,
      })
      this.commonHelper.makeRequest(updateAliasRequest, 'updateAlias', true).subscribe(res => {
        if (res.statusCode == 0) {
          this.responseMessage = res.message;
        } else {
          this.errorMessage = res.message;
        }
        this.isDisabled = true;
        this.commonHelper.animateMessage.call(this, 'messageWrap');
        setTimeout(() => {
          this.isDisabled = false;
        }, 4000);
      });
    } else {
      this.commonHelper.validateAllFormFields(this.updateAliasForm);
    }
  }
}
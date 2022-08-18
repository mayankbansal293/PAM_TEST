import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonHelperService } from '../../../services/common-helper.service';
import { Router, NavigationEnd } from '@angular/router';
import { UpdateSearchAliasModalComponent } from './update-search-alias-modal/update-search-alias-modal.component';

declare var $: any;

@Component({
  selector: "app-search-alias",
  templateUrl: "./search-alias.component.html",
  styleUrls: ["./search-alias.component.scss"],
})
export class SearchAliasComponent implements OnInit {
  addAliasForm: UntypedFormGroup;
  aliasForm: UntypedFormGroup;
  navigationSubscription;
  statusList = [];
  modelList = [];
  addNewAlias = false;
  errorMessage;
  responseMessage;
  dropdownSettings = {
    singleSelection: false,
    idField: "orgTypeCode",
    textField: "orgDisplayName",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 10,
    allowSearchFilter: false,
  };
  rPerPage = 200;
  channelList = [];
  activeModal;
  configChannel = {
    displayKey: "channelNameChannelId",
    search: true,
    height: "auto",
    placeholder: "Select Channel",
    customComparator: () => {},
    noResultsFound: "No results found!",
    clearOnSelection: true,
    searchOnKey: "channelName",
  };
  displayedColumns = [
    {
      key: "aliasName",
      value: `searchAlias.aliasName`,
    },
    {
      key: "status",
      value: `searchAlias.status`,
    },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private commonHelper: CommonHelperService,
    private router: Router
  ) // private modalService: NgbModal
  {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.aliasForm) {
          this.ngOnInit();
        }
      }
    });
  }
  ngOnInit() {
    this.addNewAlias = false;
    this.statusList = [
      {
        name: this.commonHelper.getCustomMessages("INACTIVE"),
        value: "INACTIVE",
      },
      {
        name: this.commonHelper.getCustomMessages("active"),
        value: "ACTIVE",
      },
    ];
    this.addAliasForm = this.fb.group({
      channel: ["", Validators.required],
      aliasName: ["", Validators.required],
      status: [this.statusList[1].value],
    });

    this.aliasForm = this.fb.group({
      channel: ["", Validators.required],
      aliasName: [""],
    });

    this.getChannelList();
  }

  get channel() {
    return this.aliasForm.get("channel");
  }

  get status() {
    return this.addAliasForm.get("status");
  }

  get addAliasChannel() {
    return this.addAliasForm.get("channel");
  }

  getChannelList() {
    const sendToken = {
      token: localStorage.getItem("authToken"),
      channelId:
        localStorage.getItem("accessSelfChannelOnly") == "YES"
          ? localStorage.getItem("channelId")
          : "ALL",
    };
    this.commonHelper
      .makeRequest(sendToken, "getChannelList", false)
      .subscribe((res) => {
        if (res.statusCode == 0) {
          this.channelList = res.data;
          this.channelList.forEach(
            (channel) =>
              (channel["channelNameChannelId"] =
                channel.channelName + " (" + channel.channelId + ")")
          );
          if (this.channelList.length == 1) {
            this.aliasForm.patchValue({ channel: this.channelList[0] });
            this.aliasForm.get("channel").disable({ emitEvent: false });
            this.addAliasForm.patchValue({ channel: this.channelList[0] });
            this.addAliasForm.get("channel").disable({ emitEvent: false });
          }
        }
      });
    this.status.disable();
  }

  get controls() {
    return this.aliasForm.controls;
  }
  onAddButton() {
    this.addNewAlias = true;
  }
  onBackClick() {
    this.modelList = [];
    this.ngOnInit();
  }
  onSearch() {
    if (this.aliasForm.valid) {
      this.modelList = [];
      const getAliasRequest = {
        token: localStorage.getItem("authToken"),
        channelId: this.channel.value.channelId,
        aliasName: this.aliasForm.get("aliasName").value || undefined,
      };

      this.commonHelper
        .makeRequest(getAliasRequest, "getAlias", true)
        .subscribe((res) => {
          if (res.statusCode == 0) {
            this.modelList = res.data;
          } else {
            this.errorMessage = res.message;
            this.commonHelper.animateMessage.call(this, "containerWrap");
          }
        });
    } else {
      this.commonHelper.validateAllFormFields(this.aliasForm);
    }
  }

  addAlias() {
    if (this.addAliasForm.valid) {
      const addAliasRequest = {
        token: localStorage.getItem("authToken"),
        channelId: this.addAliasChannel.value.channelId,
        status: this.status.value,
        aliasName: this.addAliasForm.get("aliasName").value,
      };

      this.commonHelper
        .makeRequest(addAliasRequest, "createAlias", true)
        .subscribe((res) => {
          if (res.statusCode == 0) {
            this.responseMessage = res.message;
            this.onReset();
          } else {
            this.errorMessage = res.message;
          }
          this.commonHelper.animateMessage.call(this, "containerWrap");
        });
    } else {
      this.commonHelper.validateAllFormFields(this.addAliasForm);
    }
  }

  resetPage() {
    this.modelList = [];
    this.ngOnInit();
  }
  onReset() {
    //this.addAliasForm.reset();
    this.addAliasForm.patchValue({ status: this.statusList[1].value });
    this.addAliasForm.patchValue({ aliasName: "" });
    this.addAliasForm.patchValue({ channel: "" });
    this.getChannelList();
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.activeModal) {
      this.activeModal.close();
    }
  }

  updateAlias(data, index): void {
    // this.activeModal = this.modalService.open(UpdateSearchAliasModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
    // this.activeModal.componentInstance.data = data;
    // this.activeModal.componentInstance.channelId = this.aliasForm.get('channel').value.channelId;
    // this.activeModal.componentInstance.channelList = this.channelList;
    // this.activeModal.result.then((data) => {
    //   if (data && !data.error) {
    //     this.modelList[index].aliasName = data.aliasName;
    //     this.modelList[index].status = data.status;
    //   } else if (data && data.error) {
    //     this.commonHelper.animateMessage.call(this, 'containerWrap');
    //   }
    // });
  }
}
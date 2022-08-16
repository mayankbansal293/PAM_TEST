import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, ControlContainer } from "@angular/forms";
import { CommonHelperService } from "../../../../services/common-helper.service";
import { ValidationHelperService } from "src/app/services/validation-helper.service";
import { NavigationEnd, Router } from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-privilege-report',
  templateUrl: './privilege-report.component.html',
  styleUrls: ['./privilege-report.component.scss']
})
export class PrivilegeReportComponent implements OnInit {
  responseMessage: any;
  errorMessage: any;
  operationType = "MENU";
  priviledgeReportForm: FormGroup;
  addUsersForm: FormGroup;
  menuForm: FormGroup;
  permissionForm: FormGroup;
  domainNameList = [];
  roleList = [];
  userList = [];
  priviledgeList = [];
  showTable = "";
  apptypeList = [];
  moduleList = [];
  menuPriviledgeList = [];
  orgTypeList = [];
  navigationSubscription;
  menuList = [];
  permissionList = [];
  showMenus = false;
  isDisable: boolean = true;
  isDisabled: boolean = true;
  showAdd = false;
  permissionName;
  permissionId;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonHelper: CommonHelperService,
    private validationService: ValidationHelperService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.priviledgeReportForm) {
          this.resetPage();
        }
      }
    });
  }
  configDomain = {
    displayKey: "domainNameDomainId",
    search: true,
    height: 'auto',
    placeholder: 'Select',
    customComparator: () => { },
    noResultsFound: 'No results found!',
    clearOnSelection: true,
    searchOnKey: 'domainName'
  };

  ngOnInit() {
    this.priviledgeReportForm = this.fb.group({
      domainId: ["", Validators.required],
      // appType: ["", Validators.required],
      module: ["", Validators.required],
      roleId: [""],
      userId: [""],
      // orgType: ["", Validators.required],
      menu: ["", Validators.required],
      permission: ["", Validators.required]
    });
    this.permissionForm = this.fb.group({
      permissionArray: this.fb.array([])
    });
    this.addUsersForm = this.fb.group({
      checkBoxArray: this.fb.array([])
    });
    this.permissionName = "";
    this.showAdd = false;
    const sendToken = {
      token: localStorage.getItem("authToken"),
      domainId: localStorage.getItem("accessSelfDomainOnly") == "YES" ? localStorage.getItem("domainId") : "ALL"
    };

    this.commonHelper
      .makeRequest(sendToken, "getDomainList", true)
      .subscribe(res => {
        if (res.statusCode == 0) {
          this.domainNameList = res.data;
          this.domainNameList.forEach(domain => domain['domainNameDomainId'] = domain.domainName + ' (' + domain.domainId + ')')
          if (this.domainNameList.length == 1) {
            this.priviledgeReportForm.patchValue({
              domainId: this.domainNameList[0]
            });
          }
        }
      });
    this.priviledgeReportForm.get("domainId").valueChanges.subscribe(domainId => {
      if (domainId && domainId.domainId) {
        const data = {
          token: localStorage.getItem("authToken"),
          domainId: this.domainId.value.domainId, //localStorage.getItem("domainId")
        };
      }
    });

    this.priviledgeReportForm.get("module").valueChanges.subscribe(moduleId => {
      this.priviledgeReportForm.patchValue({ menu: "" });
      this.priviledgeReportForm.patchValue({ permission: "" });
      this.menuList = [];
      if (moduleId) {
        let reqObj = {
          token: localStorage.getItem("authToken"),
          moduleId: moduleId.id,
          appType: "Web_Panel",                //this.priviledgeReportForm.get("appType").value.appType,
          parentMenu: undefined
        };
        this.showTable = "";
        this.commonHelper
          .makeRequest(reqObj, "getMenuModule", false)
          .subscribe(res => {
            this.menuList = [];
            if (res.statusCode == 0) {
              this.menuList = res.data;
            }
          });
      }
    });
    this.priviledgeReportForm.get("menu").valueChanges.subscribe(menuId => {
      this.priviledgeReportForm.patchValue({ permission: "" });
      if (menuId) {
        let reqObj = {
          token: localStorage.getItem("authToken"),
          menuId: menuId.menuId,
          moduleId: this.priviledgeReportForm.get("module").value.id,
          appType: "Web_Panel",                                         //this.priviledgeReportForm.get("appType").value.appType
        };
        this.commonHelper
          .makeRequest(reqObj, "getPermission", false)
          .subscribe(res => {
            this.permissionList = [];
            if (res.statusCode == 0) {
              this.permissionList = res.data;
            }
          });
      } else {
        this.permissionList = [];
      }
    });
    if (this.operationType == "USER") {
      this.commonHelper.setValidation.call(this, "priviledgeReportForm", [
        {
          fieldName: "roleId",
          validators: [Validators.required]
        },
        {
          fieldName: "userId",
          validators: [Validators.required]
        }
      ]);

      this.commonHelper.clearValidators.call(this, "priviledgeReportForm", [
        "module",
        "menu",
        "permission"
      ]);

      const data = {
        token: localStorage.getItem("authToken"),
        orgTypeCode: localStorage.getItem("orgTypeCode")
      };

      this.commonHelper.makeRequest(data, "getRoleList", false).subscribe(res => {
        if (res.statusCode == 0) {
          this.roleList = res.data;
        }
      });
      this.priviledgeReportForm.get("roleId").valueChanges.subscribe(roleId => {
        this.priviledgeReportForm.patchValue({ userId: "" });
        this.showTable = "";
        let data = {
          token: localStorage.getItem("authToken"),
          domainId: this.domainId.value.domainId,
          roleId: roleId
        };
        this.commonHelper
          .makeRequest(data, "getUsersByRole", false)
          .subscribe(res => {
            this.userList = [];
            if (res.statusCode == 0) {
              this.userList = res.data;
            }
          });
      });
      this.priviledgeReportForm.get("userId").valueChanges.subscribe(roleId => {
        this.showTable = "";
      });
    } else {
      this.commonHelper.clearValidators.call(this, "priviledgeReportForm", [
        "userId",
        "roleId"
      ]);
      const data = {
        token: localStorage.getItem("authToken")
      };
      // this.commonHelper
      //   .makeRequest(data, "getAppTypeList", false)
      //   .subscribe(res => {
      //     if (res.statusCode == 0) {
      //       this.apptypeList = res.data;
      //     }
      // });
      this.commonHelper
        .makeRequest(data, "getModuleList", false)
        .subscribe(res => {
          if (res.statusCode == 0) {
            this.moduleList = res.data;
          }
        });
      // this.priviledgeReportForm
      //   .get("appType")
      //   .valueChanges.subscribe(roleId => {
      //     this.showTable = "";
      //     this.priviledgeReportForm.patchValue({ module: "" });
      //     this.priviledgeReportForm.patchValue({ menu: "" });
      //     this.priviledgeReportForm.patchValue({ permission: "" });
      //   });
    }
  }

  get domainId() {
    return this.priviledgeReportForm.get('domainId');
  }

  setOperationType(operationType: String) {
    if (operationType == "USER") {
      this.operationType = "USER";
      this.showTable = "";
      this.ngOnInit();
      this.userList = [];
    } else {
      this.operationType = "MENU";
      this.showTable = "";
      this.ngOnInit();
    }
  }

  permissionRowSpan = [];
  permissionRowSpanModule = [];

  onSearch() {
    if (this.priviledgeReportForm.valid) {
      this.permissionRowSpan = [];
      this.permissionRowSpanModule = [];
      var that = this;
      if (this.operationType == "USER") {
        const request = {
          token: localStorage.getItem("authToken"),
          roleId: this.priviledgeReportForm.get("roleId").value,
          userId: this.priviledgeReportForm.get("userId").value
        };
        this.commonHelper
          .makeRequest(request, "getUserMenusData", true)
          .subscribe(res => {
            if (res.statusCode == 0) {
              this.priviledgeList = res.appTypeModuleIdBeanList;
              this.showTable = "USER";
            } else {
              this.errorMessage = res.message;
              this.commonHelper.animateMessage.call(this, "containerWrap");
            }
          });
      } else {
        this.getPrivilegeReport();
      }
    } else {
      this.validationService.validateAllFormFields(this.priviledgeReportForm);
    }
  }

  resetPage() {
    this.ngOnInit();
    this.showTable = "";
    this.menuList = [];
    this.userList = [];
    this.permissionList = [];
    this.orgTypeList = [];
  }

  get f() {
    return this.priviledgeReportForm.controls;
  }

  getPrivilegeReport() {
    const request = {
      token: localStorage.getItem("authToken"),
      appType: "Web_Panel", //this.priviledgeReportForm.get("appType").value.appType,
      moduleId: this.priviledgeReportForm.get("module").value.id,
      userStatus: "ASSIGNED",
      orgTypeCode: "BO", //this.priviledgeReportForm.get("orgType").value,
      permissionId:
        this.priviledgeReportForm.get("permission").value || undefined,
      menuId: this.priviledgeReportForm.get("menu").value.menuId,
      domainId: this.domainId.value.domainId
    };
    this.commonHelper
      .makeRequest(request, "getPrivilegeReport", true)
      .subscribe(res => {
        if (res.statusCode == 0) {
          this.menuPriviledgeList = res.data;
          this.isDisable = true;
          this.permissionForm = this.fb.group({
            permissionArray: this.fb.array([])
          });
          this.permissionArray(this.menuPriviledgeList);
          this.showTable = "MENU";
        } else {
          this.errorMessage = res.message;
          this.commonHelper.animateMessage.call(this, "containerWrap");
        }
      });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  permissionArray(data) {
    const form = <FormArray>this.permissionForm.get("permissionArray");
    data.map(data => {
      form.push(this.fillPermissionArray(data));
    });
  }
  fillPermissionArray(data) {
    const form = this.fb.group({
      permissionName: [data.permissionName],
      permissionId: [data.permissionId],
      checkBoxArray: this.fb.array([])
    });
    this.addUserArray(form, data.mappedUsers);
    return form;
  }
  addUserArray(form, userData) {
    const control = <FormArray>form.get("checkBoxArray");
    userData.map(data => {
      control.push(
        this.fb.group({
          checkBoxValue: [true],
          userName: [data.username],
          userId: [data.userId]
        })
      );
    });
  }
  onSave(controls) {
    let requestId = [];
    let data = controls.get("checkBoxArray").value;
    data.forEach(user => {
      if (!user.checkBoxValue) {
        requestId.push(user.userId);
      }
    });
    const request = {
      token: localStorage.getItem("authToken"),
      appType: "Web_Panel",                                          //this.priviledgeReportForm.get("appType").value.appType,
      moduleId: this.priviledgeReportForm.get("module").value.id,
      permissionId: controls.get("permissionId").value,
      menuId: this.priviledgeReportForm.get("menu").value.menuId,
      updateStatus: "REMOVE",
      userIds: requestId,
      domainId: this.domainId.value.domainId
    };
    this.commonHelper
      .makeRequest(request, "updateUserPrivileges", true)
      .subscribe(res => {
        if (res.statusCode == 0) {
          this.responseMessage = res.message;
          this.getPrivilegeReport();
        } else {
          this.errorMessage = res.message;
        }
      });
    this.commonHelper.animateMessage.call(this, "containerWrap");

  }
  
  disable(event, controls) {
    this.isDisable = true;
    
    let data = controls.get("checkBoxArray").value;
    data.forEach(user => {
      if (!user.checkBoxValue) {
        this.isDisable = false;
      }
    });
  }

  disabled(e, controls){
    this.isDisabled = true;
    for(let i of controls){
      if(i.controls.checkBoxValue.value == true){
        this.isDisabled = false;
      }
    }
  }

  addPermissionArray(data) {
    const form = <FormArray>this.addUsersForm.get("checkBoxArray");
    data.forEach(u => {
      u.mappedUsers.map(d => {
        form.push(
          this.fb.group({
            checkBoxValue: [false],
            userName: [d.username],
            userId: [d.userId]
          })
        );
      });
    });
  }

  add(btnName, data) {
    if(btnName == 'onAddBtn'){
      
      this.permissionName = data.get("permissionName").value;
      this.permissionId = data.get('permissionId').value
    }
    let reqObj = {
      token: localStorage.getItem("authToken"),
      appType: "Web_Panel",                   //this.priviledgeReportForm.get("appType").value.appType,
      moduleId: this.priviledgeReportForm.get("module").value.id,
      userStatus: "UN_ASSIGNED",
      orgTypeCode: "BO",  //this.priviledgeReportForm.get("orgType").value,
      permissionId: this.priviledgeReportForm.get("permission").value || undefined,
      menuId: this.priviledgeReportForm.get("menu").value.menuId,
      domainId: this.domainId.value.domainId
    };

    this.commonHelper
      .makeRequest(reqObj, "getPrivilegeReport", true)
      .subscribe(res => {
        if (res.statusCode == 0) {
          this.menuPriviledgeList = res.data;
          this.addUsersForm = this.fb.group({
            checkBoxArray: this.fb.array([])
          });
          this.addPermissionArray(this.menuPriviledgeList);
          this.showTable = "MENU";
          this.showAdd = true;
          this.isDisabled = true;
        } else {
          this.errorMessage = res.message;
          this.commonHelper.animateMessage.call(this, "containerWrap");
        }
      });
  }

  backClicked() {
    this.showAdd = false;
    this.getPrivilegeReport();
  }

  submitAddUsers() {
    let requestId = [];
    const addUsers = this.addUsersForm.get("checkBoxArray").value;
    addUsers.forEach(data => {
      if (data.checkBoxValue) {
        requestId.push(data.userId);
      }
    })
    const request = {
      token: localStorage.getItem("authToken"),
      appType: "Web_Panel",                                                //this.priviledgeReportForm.get("appType").value.appType,
      moduleId: this.priviledgeReportForm.get("module").value.id,
      permissionId: this.permissionId,
      menuId: this.priviledgeReportForm.get("menu").value.menuId,
      updateStatus: "ADD",
      userIds: requestId,
      domainId: this.domainId.value.domainId
    };
    this.commonHelper
      .makeRequest(request, "updateUserPrivileges", true)
      .subscribe(res => {
        if (res.statusCode == 0) {
          this.responseMessage = res.message;
          this.add('onSubmitAddUser', '');
        } else {
          this.errorMessage = res.message;
        }
        this.commonHelper.animateMessage.call(this, "containerWrap");
      });
  }
}
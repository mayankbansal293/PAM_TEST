declare var $: any;
import { Component, OnInit } from '@angular/core';
import { CommonHelperService } from '../../../services/common-helper.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormArray } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: "app-manage-menu",
  templateUrl: "./manage-menu.component.html",
  styleUrls: ["./manage-menu.component.scss"],
})
export class ManageMenuComponent implements OnInit {
  responseMessage;
  errorMessage;
  addMenuForm: UntypedFormGroup;
  manageMenuFormForList: UntypedFormGroup;
  editMenuForm: UntypedFormGroup;
  permissions = [];
  addMenuIsOpen = 0;
  editMenuIsOpen = 0;
  navigationSubscription;
  moduleList = [];
  permissionSearches = [];
  editFormData;
  optionalPermissionsList = [];
  mandatoryPermissionsList = [];
  parentMenuList = [];
  selectedMandatoryItems = [];
  selectedOptionalItems = [];
  selectedOptionalCodes = [];
  selectedOptional = [];
  selectedMandatory = [];
  selectedMandatoryCodes = [];
  currentMenuId;
  activePage = 1;
  rPerPage = 200;
  indexSelected;
  dropdownMandatoryPermissionsSettings = {
    singleSelection: false,
    idField: "permissionCode",
    textField: "displayName",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 10,
    allowSearchFilter: false,
  };
  displayedColumn = [
    { key: "menuId", value: `manageMenuForm.table.menuId` },
    { key: "parent", value: `manageMenuForm.table.parentMenu` },
    { key: "caption", value: `manageMenuForm.table.menuName` },
  ];
  dropdownOptionalPermissionsSettings = {
    singleSelection: false,
    idField: "permissionCode",
    textField: "displayName",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 10,
    allowSearchFilter: false,
  };

  appTypeList = [
    {
      appTypeName: "Web Panel",
      appTypeValue: "Web_Panel",
    },
    {
      appTypeName: "Android",
      appTypeValue: "Android_Mobile",
    },
    {
      appTypeName: "Terminal",
      appTypeValue: "Terminal",
    },
  ];

  engineList = [
    {
      engineCode: "RMS",
      engineName: "RMS",
    },
    {
      engineCode: "SCRATCH",
      engineName: "Scratch",
    },
    {
      engineCode: "DGE",
      engineName: "DGE",
    },
    {
      engineCode: "SLE",
      engineName: "SLE",
    },
    {
      engineCode: "OLA",
      engineName: "OLA",
    },
    {
      engineCode: "SBS",
      engineName: "SBS",
    },
  ];
  selectedOptionalDisplayNames = [];
  selectedMandatoryDisplayNames = [];

  constructor(
    private commonHelper: CommonHelperService,
    private fb: UntypedFormBuilder,
    private router: Router
  ) {
    // this.permissions = this.commonHelper.returnPagePermission("PAYMENT_REPORT");
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.addMenuForm) {
          this.resetPage();
        }
      }
    });
  }

  ngOnInit() {
    this.manageMenuFormForList = this.fb.group({
      module: ["", Validators.required],
      appType: ["", Validators.required],
    });

    this.addMenuForm = this.fb.group({
      appType: ["", Validators.required],
      module: ["", Validators.required],
      parentMenuId: ["0"],
      menuCode: ["", Validators.required],
      caption: ["", Validators.required],
      basePath: [""],
      relativePath: [""],
      sequence: [
        "",
        [Validators.required, Validators.max(20), Validators.min(1)],
      ],
      apiDetails: [""],
      mandatoryPermissions: ["", Validators.required],
      optionalPermissions: [""],
      engineCode: ["", Validators.required],
    });

    this.editMenuForm = this.fb.group({
      appType: [""],
      parentMenu: [""],
      menuCode: [""],
      caption: [""],
      basePath: [""],
      relativePath: [""],
      sequence: [""],
      apiDetails: [""],
      mandatoryPermissions: [""],
      optionalPermissions: [""],
      engineCode: [""],
    });

    this.commonHelper
      .makeRequest(
        { token: localStorage.getItem("authToken") },
        "getModule",
        false
      )
      .subscribe((res) => {
        if (res.statusCode == 0) {
          this.moduleList = res.data;
        }
      });

    this.addMenuForm.get("module").valueChanges.subscribe((moduleId) => {
      if (moduleId) {
        let reqObj = {
          token: localStorage.getItem("authToken"),
          moduleId: moduleId,
          appType: "Web_Panel",
          parentMenu: "Yes",
        };
        this.commonHelper
          .makeRequest(reqObj, "getMenuModule", false)
          .subscribe((res) => {
            if (res.statusCode == 0) {
              this.parentMenuList = res.data;
              !this.parentMenuList
                ? this.addMenuForm.get("parentMenuId").disable()
                : this.addMenuForm.get("parentMenuId").enable();
            } else {
              this.addMenuForm.get("parentMenuId").disable();
              this.parentMenuList = [];
            }
          });
      }
    });
  }

  resetPage(): void {
    this.parentMenuList = [];
    this.permissionSearches = [];
    this.ngOnInit();
  }

  resetmanageMenuFormForList(): void {
    this.manageMenuFormForList.reset();
    this.manageMenuFormForList.patchValue({ appType: "" });
    this.manageMenuFormForList.patchValue({ module: "" });
    this.permissionSearches = []; //to empty
  }

  resetAddMenuForm(): void {
    this.addMenuForm.reset();
    this.addMenuForm.patchValue({ appType: "" });
    this.addMenuForm.patchValue({ module: "" });
    this.parentMenuList = [];
    this.addMenuForm.patchValue({ parentMenuId: "0" });
    this.addMenuForm.patchValue({ engineCode: "" });
  }

  resetEditMenuForm(): void {
    this.editMenuForm.reset();
    this.editMenuForm.patchValue({ appType: "" });

    if (this.editFormData.parentId) {
      this.editMenuForm.patchValue({ parentMenu: "Yes" });
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  getMenuModuleList() {
    if (this.manageMenuFormForList.valid) {
      this.errorMessage = "";
      let reqObj = {
        token: localStorage.getItem("authToken"),
        moduleId: this.manageMenuFormForList.get("module").value.moduleId,
        appType: this.manageMenuFormForList.get("appType").value.appTypeValue,
      };
      this.getMenuModule(reqObj);
    } else {
      this.permissionSearches = [];
      this.validateAllFormFields(this.manageMenuFormForList);
    }
  }

  addMenu() {
    if (this.addMenuForm.valid) {
      var mandatoryList = (
        this.addMenuForm.get("mandatoryPermissions").value || []
      ).map(function (m) {
        return typeof m == "string" ? m : m.permissionCode;
      });

      var optionalList = (
        this.addMenuForm.get("optionalPermissions").value || []
      ).map(function (m) {
        return typeof m == "string" ? m : m.permissionCode;
      });

      var reqObj = {
        token: localStorage.getItem("authToken"),
        engineCode: this.addMenuForm.get("engineCode").value,
        menuCode: this.addMenuForm.get("menuCode").value,
        moduleId: this.addMenuForm.get("module").value,
        appType: this.addMenuForm.get("appType").value,
        caption: this.addMenuForm.get("caption").value,
        basePath: this.addMenuForm.get("basePath").value,
        relativePath: this.addMenuForm.get("relativePath").value,
        parentMenuId: this.addMenuForm.get("parentMenuId").value,
        sequence: this.addMenuForm.get("sequence").value,
        apiDetails: this.addMenuForm.get("apiDetails").value,
        checkForPermissions: "1",
        permissions: {
          requiredPermissions: mandatoryList,
          optionalPermissions: optionalList,
        },
      };

      this.commonHelper
        .makeRequest(reqObj, "addMenu", false)
        .subscribe((res) => {
          if (res.statusCode == 0) {
            this.responseMessage = res.message;
            this.selectedOptional = [];
            this.selectedMandatory = [];
          } else {
            this.errorMessage = res.message;
          }
          this.commonHelper.animateMessage("containerWrap");
        });
    } else {
      this.validateAllFormFields(this.addMenuForm);
    }
  }

  editMenu() {
    if (this.editMenuForm.valid) {
      var mandatoryNames = (
        this.editMenuForm.get("mandatoryPermissions").value || []
      ).map(function (m) {
        return typeof m == "string" ? m : m.displayName;
      });

      var optionalNames = (
        this.editMenuForm.get("optionalPermissions").value || []
      ).map(function (m) {
        return typeof m == "string" ? m : m.displayName;
      });

      var mandatoryList = (
        this.editMenuForm.get("mandatoryPermissions").value || []
      ).map(function (m) {
        return typeof m == "string" ? m : m.permissionCode;
      });

      var optionalList = (
        this.editMenuForm.get("optionalPermissions").value || []
      ).map(function (m) {
        return typeof m == "string" ? m : m.permissionCode;
      });

      var reqObj = {
        token: localStorage.getItem("authToken"),
        engineCode: this.editMenuForm.get("engineCode").value,
        appType: this.editMenuForm.get("appType").value,
        parentMenuId: this.editMenuForm.get("parentMenu").value,
        menuCode: this.editMenuForm.get("menuCode").value,
        menuId: this.currentMenuId,
        moduleId: this.manageMenuFormForList.get("module").value.moduleId,
        caption: this.editMenuForm.get("caption").value,
        basePath: this.editMenuForm.get("basePath").value,
        relativePath: this.editMenuForm.get("relativePath").value,
        sequence: this.editMenuForm.get("sequence").value,
        apiDetails: this.editMenuForm.get("apiDetails").value,
        permissions: {
          requiredPermissions: mandatoryList,
          optionalPermissions: optionalList,
        },
      };

      this.commonHelper
        .makeRequest(reqObj, "updateMenu", false)
        .subscribe((res) => {
          if (res.statusCode == 0) {
            this.responseMessage = res.data;
            if (this.permissionSearches.length > this.indexSelected) {
              this.permissionSearches[this.indexSelected].sequence =
                reqObj.sequence;
              this.permissionSearches[this.indexSelected].menuCode =
                reqObj.menuCode;
              this.permissionSearches[this.indexSelected].caption =
                reqObj.caption;
              this.permissionSearches[this.indexSelected].menuId =
                reqObj.menuId;
            }

            this.selectedOptional = [];
            this.selectedMandatory = [];

            this.selectedMandatoryDisplayNames =
              this.selectedMandatoryDisplayNames.concat(mandatoryNames);
            this.selectedOptionalDisplayNames =
              this.selectedOptionalDisplayNames.concat(optionalNames);
          } else {
            this.errorMessage = res.message;
          }
          this.commonHelper.animateMessage("containerWrap");
        });
    } else {
      this.validateAllFormFields(this.editMenuForm);
    }
  }

  openEditForm(menuId, index) {
    this.currentMenuId = menuId;
    index = (this.activePage - 1) * this.rPerPage + index;
    this.indexSelected = index - 1;
    let reqObj = {
      token: localStorage.getItem("authToken"),
      menuId: menuId,
    };
    this.commonHelper
      .makeRequest(reqObj, "getMenuDetail", false)
      .subscribe((res1) => {
        if (res1.statusCode == 0) {
          this.editFormData = res1.data;
          if (!this.editFormData.parentId) {
            this.editMenuForm.get("parentMenu").disable();
          } else {
            this.editMenuForm.get("parentMenu").enable();
          }
          this.commonHelper
            .makeRequest(
              { token: localStorage.getItem("authToken") },
              "getPermission",
              false
            )
            .subscribe((res2) => {
              if (res2.statusCode == 0) {
                this.optionalPermissionsList = res2.data;
                this.mandatoryPermissionsList = res2.data;

                var selectedOptionalItems =
                  this.editFormData.permissions.filter(function (o) {
                    return o.isRequired == "NO";
                  });

                this.selectedOptionalCodes = selectedOptionalItems.map(
                  function (o) {
                    return o.permissionCode;
                  }
                );

                this.selectedOptionalDisplayNames = selectedOptionalItems.map(
                  function (o) {
                    return o.displayName;
                  }
                );

                var selectedMandatoryItems =
                  this.editFormData.permissions.filter(function (o) {
                    return o.isRequired == "YES";
                  });

                this.selectedMandatoryCodes = selectedMandatoryItems.map(
                  function (o) {
                    return o.permissionCode;
                  }
                );

                this.selectedMandatoryDisplayNames = selectedMandatoryItems.map(
                  function (o) {
                    return o.displayName;
                  }
                );

                var that = this;

                this.mandatoryPermissionsList =
                  this.mandatoryPermissionsList.filter(function (o) {
                    return (
                      that.selectedMandatoryCodes.indexOf(o.permissionCode) <=
                        -1 &&
                      that.selectedOptionalCodes.indexOf(o.permissionCode) <= -1
                    );
                  });

                this.optionalPermissionsList =
                  this.optionalPermissionsList.filter(function (o) {
                    return (
                      that.selectedMandatoryCodes.indexOf(o.permissionCode) <=
                        -1 &&
                      that.selectedOptionalCodes.indexOf(o.permissionCode) <= -1
                    );
                  });
              }
            });

          let reqObj = {
            token: localStorage.getItem("authToken"),
            moduleId: this.manageMenuFormForList.get("module").value.moduleId,
            appType: "Web_Panel",
            parentMenu: "Yes",
          };
          this.commonHelper
            .makeRequest(reqObj, "getMenuModule", false)
            .subscribe((res) => {
              if (res.statusCode == 0) {
                this.parentMenuList = res.data;
              } else {
                this.parentMenuList = [];
              }
            });

          this.editMenuForm.patchValue({ caption: this.editFormData.caption });
          this.editMenuForm.patchValue({ appType: this.editFormData.appType });
          this.editMenuForm.patchValue({
            sequence: this.editFormData.sequence,
          });
          this.editMenuForm.patchValue({
            basePath: this.editFormData.basePath,
          });
          this.editMenuForm.patchValue({
            relativePath: this.editFormData.relativePath,
          });
          this.editMenuForm.patchValue({
            apiDetails: this.editFormData.apiDetails,
          });
          this.editMenuForm.patchValue({
            menuCode: this.editFormData.menuCode,
          });

          this.editFormData.menuCode
            ? this.editMenuForm.get("menuCode").disable()
            : this.editMenuForm.get("menuCode").enable();

          this.editMenuForm.patchValue({
            engineCode: this.editFormData.engineCode,
          });
          this.editMenuForm.patchValue({
            parentMenu: this.editFormData.parentId,
          });
          this.editMenuIsOpen = 1;
        } else {
          this.errorMessage = res1.message;
          this.commonHelper.animateMessage("containerWrap");
        }
      });
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        //{4}
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });

    if (!formGroup.valid) {
      // let el = $('.ng-invalid:not(form):first');
      // $('html,body').animate({ scrollTop: (el.offset().top - 150) }, 'slow', () => {
      //   el.focus();
      // });
    }
  }

  addMenuClicked() {
    this.addMenuIsOpen = 1;
    this.resetAddMenuForm();
    this.commonHelper
      .makeRequest(
        { token: localStorage.getItem("authToken") },
        "getPermission",
        false
      )
      .subscribe((res) => {
        if (res.statusCode == 0) {
          this.optionalPermissionsList = res.data;
          this.mandatoryPermissionsList = res.data;
        }
      });
  }

  backButtonClicked() {
    this.addMenuIsOpen = 0;
    this.editMenuIsOpen = 0;
    this.selectedMandatory = this.selectedOptional = [];

    if (!this.manageMenuFormForList.get("module").value.moduleId) {
      return;
    }

    let reqObj = {
      token: localStorage.getItem("authToken"),
      moduleId: this.manageMenuFormForList.get("module").value.moduleId,
      appType: this.manageMenuFormForList.get("appType").value.appTypeValue,
    };

    this.getMenuModule(reqObj);
  }

  getMenuModule(reqObj) {
    this.commonHelper
      .makeRequest(reqObj, "getMenuModule", false)
      .subscribe((res) => {
        if (res.statusCode == 0) {
          this.permissionSearches = res.data;
          this.editMenuIsOpen = 0;
        } else {
          this.errorMessage = res.message;
          this.permissionSearches = [];
          this.commonHelper.animateMessage("containerWrap");
        }
      });
  }

  onSelectingSingleMandatoryPermission(event) {
    this.optionalPermissionsList = this.optionalPermissionsList.filter(
      function (d) {
        if (typeof event == "string") {
          return d.permissionCode != event;
        } else {
          return d.permissionCode != event.permissionCode;
        }
      }
    );
  }

  onDeSelectingSingleMandatoryPermission(event) {
    if (typeof event == "string") {
      this.optionalPermissionsList = this.optionalPermissionsList.concat([
        {
          displayName: event,
          permissionCode: event,
        },
      ]);
    } else {
      this.optionalPermissionsList = this.optionalPermissionsList.concat([
        event,
      ]);
    }
  }

  onSelectingAllMandatoryPermission(event) {
    var selectedCodes = this.mandatoryPermissionsList.map(function (o) {
      return o.permissionCode;
    });
    this.optionalPermissionsList = this.optionalPermissionsList.filter(
      function (o) {
        return selectedCodes.indexOf(o.permissionCode) <= -1;
      }
    );
  }

  onDeSelectingAllMandatoryPermission(event) {
    this.optionalPermissionsList = this.optionalPermissionsList.concat(
      this.mandatoryPermissionsList
    );
  }

  onSelectingSingleOptionalPermission(event) {
    this.mandatoryPermissionsList = this.mandatoryPermissionsList.filter(
      function (d) {
        return d.permissionCode != event.permissionCode;
      }
    );
  }

  onDeSelectingSingleOptionalPermission(event) {
    if (typeof event == "string") {
      this.mandatoryPermissionsList = this.mandatoryPermissionsList.concat([
        {
          displayName: event,
          permissionCode: event,
        },
      ]);
    } else {
      this.mandatoryPermissionsList = this.mandatoryPermissionsList.concat([
        event,
      ]);
    }
  }

  onSelectingAllOptionalPermission(event) {
    var selectedCodes = this.optionalPermissionsList.map(function (o) {
      return o.permissionCode;
    });
    this.mandatoryPermissionsList = this.mandatoryPermissionsList.filter(
      function (o) {
        return selectedCodes.indexOf(o.permissionCode) <= -1;
      }
    );
  }

  onDeSelectingAllOptionalPermission(event) {
    this.mandatoryPermissionsList = this.mandatoryPermissionsList.concat(
      this.optionalPermissionsList
    );
  }

  onPageChange(pNum) {
    this.activePage = pNum;
  }
}

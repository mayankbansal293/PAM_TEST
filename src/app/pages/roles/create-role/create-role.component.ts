import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { CommonHelperService } from '../../../services/common-helper.service';
import { Router, NavigationEnd } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})

export class CreateRoleComponent implements OnInit {
  createRoleForm: UntypedFormGroup;
  orgTypeList = [];
  roleMenus = [];
  menuForm: UntypedFormGroup;
  showMenus = false;
  responseMessage = ''
  errorMessage = ''
  navigationSubscription;
  constructor(private fb: UntypedFormBuilder, private commonHelper: CommonHelperService,
    private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.createRoleForm = this.fb.group({
      orgType: ['Backoffice'],
      roleName: ['', Validators.required],
    })

    this.menuForm = this.fb.group({
      appArray: this.fb.array([]),
    })

    this.showMenus = false;
    this.roleMenus = [];
    const requestData = {
      token: localStorage.getItem('authToken'),
      roleId: 0,
    }
    this.commonHelper.makeRequest(requestData, 'getRoleMenus', true).subscribe(res => {
      if (res.statusCode == 0) {
        this.roleMenus = res.appTypeModuleIdBeanList;
        this.menuForm = this.fb.group({
          appArray: this.fb.array([]),
        })
        this.showMenus = true;
        this.addAppArray(this.roleMenus);
        window.addEventListener('resize', this.cbGroupColumnCheck);
      } else {
        this.showMenus = false;
        this.errorMessage = res.message;
        this.roleMenus = [];
        this.commonHelper.animateMessage.call(this, 'containerWrap')
      }
    })

    this.createRoleForm.valueChanges.subscribe(res => {
      this.responseMessage = '';
    })
  }

  addAppArray(appData) {
    const control = <UntypedFormArray>this.menuForm.controls['appArray'];
    appData.map((appData, k) => {
      control.push(this.initAppArray(appData));
    });
  }

  initAppArray(appData) {
    const form = this.fb.group({
      appTypeName: [appData.appType.split('_').join(' ').toUpperCase()],
      moduleArray: this.fb.array([])
    })
    this.addModule(appData.moduleIdList, form);
    return form;
  }

  addModule(data, form) {
    const control = form.controls.moduleArray as UntypedFormArray;
    data.map((moduledata, i) => {
      control.push(this.initModule(moduledata));
    })
  }

  initModule(moduledata) {
    const form = this.fb.group({
      moduleName: [moduledata.moduleCaption],
      moduleId: [moduledata.moduleId],
      moduleIdSelected: [''],
      menuArray: this.fb.array([])
    });
    this.addMenu(moduledata.menuIdPermIsReqLstBeanList, form)
    return form;
  }

  addMenu(data, form) {
    const control = form.controls.menuArray as UntypedFormArray;
    data.map((menudata, i) => {
      control.push(this.initMenu(menudata));
    })
  }

  initMenu(menuData) {
    const form = this.fb.group({
      menuName: [menuData.caption],
      menuId: [menuData.menuId],
      menuIdSelected: [{ value: menuData.checkForPermissions == '0' ? true : false, disabled: !menuData.checkForPermissions }],
      menuRequired: [{ value: menuData.checkForPermissions == '0' ? true : false, disabled: !menuData.checkForPermissions }],
      permissionsArray: this.fb.array([])
    })
    this.addPermission(menuData.permissionCodeStatusBeanList, form)
    return form;
  }

  addPermission(data, form) {
    const control = form.controls.permissionsArray as UntypedFormArray;
    data.map((permissions, i) => {
      control.push(this.initPermission(permissions));
    })
  }

  initPermission(data) {
    return this.fb.group({
      permissionName: [data.permissionDisplayName],
      isRequired: [data.isRequired == 'YES' ? true : false],
      permissionCode: [data.permissionCode],
      permissionSelected: [{ value: '', disabled: data.isRequired == 'YES' ? true : false }],
      status: [data.status]
    })
  }

  cbGroupColumnCheck() {
    const rowHeight = parseInt($('.privPanelWrap .cbGroupColumnWrap').css('grid-auto-rows'));
    const rowGap = parseInt($('.privPanelWrap .cbGroupColumnWrap').css('grid-row-gap'));
    $('.privPanelWrap .cbGroupColumn').each(function () {
      const rowSpan = Math.ceil(($(this).find('> .cbwrap').height() + rowGap) / (rowHeight + rowGap));
      $(this).css('grid-row-end', 'span ' + rowSpan);
    })
  }

  createRole() {
    let menuPermissionList = [];
    let appArray = (<UntypedFormArray>this.menuForm.controls.appArray)
    for (let i = 0; i < appArray.controls.length; i++) {
      let moduleArray = (<UntypedFormArray>appArray.controls[i].get('moduleArray'))
      for (let j = 0; j < moduleArray.length; j++) {
        let menuArray = (<UntypedFormArray>moduleArray.controls[j].get('menuArray'))
        for (let k = 0; k < menuArray.length; k++) {
          if (menuArray.controls[k].get('menuIdSelected').value) {
            let menuId = menuArray.controls[k].get('menuId').value
            let permissionArray = (<UntypedFormArray>menuArray.controls[k].get('permissionsArray'))
            let permissionCodeList = [];
            for (let l = 0; l < permissionArray.length; l++) {
              if (permissionArray.controls[l].get('permissionSelected').value || permissionArray.controls[l].get('isRequired').value) {
                let permissionCode = permissionArray.controls[l].get('permissionCode').value
                permissionCodeList.push(permissionCode)
              }
            }
            menuPermissionList.push({ menuId: menuId, permissionCodeList: permissionCodeList })
          }
        }
      }
    }
    if (this.createRoleForm.valid) {
      if (menuPermissionList.length > 0) {
        const roleName = (this.createRoleForm.get('roleName').value).toUpperCase().split(' ').join('_').trim()
        const data = {
          'requestData': {
            'isHead': 'NO',
            'maxAllowedTokens': 1,
            'menuIdPermCodeList': menuPermissionList,
            'roleDisplayName': this.createRoleForm.get('roleName').value.trim(),
            'roleName': roleName
          },
          'token': localStorage.getItem('authToken')
        }

        this.commonHelper.makeRequest(data, 'createRole', true).subscribe(res => {
          if (res.statusCode == 0) {
            this.responseMessage = res.message;
            this.commonHelper.animateMessage.call(this, 'containerWrap')
            this.ngOnInit();
          } else {
            this.errorMessage = res.message
            this.commonHelper.animateMessage.call(this, 'containerWrap')
          }
        })
      } else {
        this.errorMessage = this.commonHelper.getCustomMessages('selAtLeastOneMenuWithPermissionCaps');
        this.commonHelper.animateMessage.call(this, 'containerWrap')
      }
    } else {
      this.commonHelper.validateAllFormFields(this.createRoleForm)
    }
  }

  changedModule(form, index) {
    let menus = form.get('menuArray').controls as UntypedFormArray;
    if (form.get('moduleIdSelected').value) {
      for (let i = 0; i < menus.length; i++) {
        menus[i].patchValue({ menuIdSelected: true });
      }
    } else {
      for (let i = 0; i < menus.length; i++) {
        if (!menus[i].get('menuRequired').value)
          menus[i].patchValue({ menuIdSelected: '' });
      }
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}


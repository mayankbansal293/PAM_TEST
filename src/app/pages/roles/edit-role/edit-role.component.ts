import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonHelperService } from '../../../services/common-helper.service';
import { NavigationEnd, Router } from '@angular/router';
// import { error } from 'console';
// import { error } from 'util';

declare var $: any;
@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  editRoleForm: UntypedFormGroup;
  orgTypeList = [];
  roleMenus = [];
  menuForm: UntypedFormGroup;
  roleTypeList = [];
  showMenus = false;
  errorMessage = ''
  navigationSubscription;
  constructor(private fb: UntypedFormBuilder, private commonHelper: CommonHelperService, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.roleTypeList = [];
    this.editRoleForm = this.fb.group({
      orgType: ['Backoffice'],
      roleId: ['', Validators.required],

    })
    this.menuForm = this.fb.group({
      appArray: this.fb.array([]),
    })
    this.showMenus = false;

    this.roleTypeList = [];
    const requestData = {
      token: localStorage.getItem('authToken'),
    }
    this.editRoleForm.patchValue({ roleId: '' })
    this.commonHelper.makeRequest(requestData, 'getRoleList', false).subscribe(res => {
      this.checkStatusOfResponse(res, (error, data) => {
        if (!error) {
          this.roleTypeList = data
        }
      });
    })

    this.editRoleForm.get('roleId').valueChanges.subscribe(roleId => {
      this.roleMenus = [];
      if (roleId) {
        const requestData = {
          token: localStorage.getItem('authToken'),
          roleId: roleId,
          orgType: 'NA'
        }
        this.commonHelper.makeRequest(requestData, 'getRoleMenus', true).subscribe(res => {
          if (res.statusCode == 0) {
            this.roleMenus = res.appTypeModuleIdBeanList;
            this.menuForm = this.fb.group({
              appArray: this.fb.array([]),
            })
            this.showMenus = true;
            this.addAppArray(this.roleMenus)
          }
          else {
            this.showMenus = false;
            this.errorMessage = res.message;
            this.commonHelper.animateMessage.call(this, 'containerWrap')
          }
        })
      } else {
        this.showMenus = false
      }
    });

    this.menuForm.get('appArray').valueChanges.subscribe(res => {
      this.responseMessage = '';
    })

    this.editRoleForm.valueChanges.subscribe(res => {
      this.responseMessage = '';
    })
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  addAppArray(appData) {
    const control = <UntypedFormArray>this.menuForm.controls['appArray'];
    appData.map((appData, k) => {
      control.push(this.initAppArray(appData));
    });
  }

  addX(data, form) {
    const control = form.controls.moduleArray as UntypedFormArray;
    data.map((moduledata, i) => {
      control.push(this.initX(moduledata));
    })
  }


  addY(data, form) {
    const control = form.controls.menuArray as UntypedFormArray;
    data.map((menudata, i) => {
      control.push(this.initY(menudata));
    })
  }

  addZ(data, form) {
    const control = form.controls.permissionsArray as UntypedFormArray;
    data.map((permissions, i) => {
      control.push(this.initZ(permissions));
    })
  }

  initAppArray(appData) {
    const form = this.fb.group({
      appTypeName: [appData.appType.split('_').join(' ').toUpperCase()],
      moduleArray: this.fb.array([])
    })
    this.addX(appData.moduleIdList, form);
    return form;
  }

  initX(moduledata) {
    const form = this.fb.group({
      moduleName: [moduledata.moduleCaption],
      moduleId: [moduledata.moduleId],
      moduleIdSelected: [''],
      menuArray: this.fb.array([])
    });
    this.addY(moduledata.menuIdPermIsReqLstBeanList, form)
    return form;
  }

  initY(menuData) {
    const form = this.fb.group({
      menuName: [menuData.caption],
      menuId: [menuData.menuId],
      menuIdSelected: [{ value: menuData.status == '1' ? true : false, disabled: !menuData.checkForPermissions }],
      menuRequired: [{ value: menuData.checkForPermissions == '0' ? true : false, disabled: !menuData.checkForPermissions }],
      status: [menuData.status == '1' ? true : false],
      checkForPermissions: [menuData.checkForPermissions],
      permissionsArray: this.fb.array([])
    })
    this.addZ(menuData.permissionCodeStatusBeanList, form)
    return form;
  }

  initZ(data) {
    return this.fb.group({
      permissionName: [data.permissionDisplayName],
      isRequired: [data.isRequired == 'YES' ? true : false],
      permissionCode: [data.permissionCode],
      permissionSelected: [{ value: data.status == 1 ? true : '', disabled: data.isRequired == 'YES' ? true : false }],
      status: [data.status]
    })
  }

  responseMessage = ''
  updateRole() {
    let requestData = [];
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
            requestData.push({ menuId: menuId, permissionCodeList: permissionCodeList })
          }
        }
      }
    }
    if (this.editRoleForm.valid) {
      if (requestData.length > 0) {

        let data = {
          'requestData': {
            'menuIdPermCodeList': requestData,
            'roleId': this.editRoleForm.get('roleId').value

          },
          'token': localStorage.getItem('authToken')
        }

        this.commonHelper.makeRequest(data, 'updateRole', true).subscribe(res => {
          if (res.statusCode == 0) {
            this.responseMessage = res.message;
            this.commonHelper.animateMessage.call(this, 'containerWrap');
            this.ngOnInit();
          } else {
            this.errorMessage = res.message
            this.commonHelper.animateMessage.call(this, 'containerWrap');
          }
        })
      } else {
        this.errorMessage = this.commonHelper.getCustomMessages('selAtLeastOneMenuWithPermissionCaps');
        this.commonHelper.animateMessage.call(this, 'containerWrap');
      }
    } else {
      this.commonHelper.validateAllFormFields(this.editRoleForm)
    }
  }

  cbGroupColumnCheck() {
    const rowHeight = parseInt($('.privPanelWrap .cbGroupColumnWrap').css('grid-auto-rows'));
    const rowGap = parseInt($('.privPanelWrap .cbGroupColumnWrap').css('grid-row-gap'));
    $('.privPanelWrap .cbGroupColumn').each(function () {
      const rowSpan = Math.ceil(($(this).find('> .cbwrap').height() + rowGap) / (rowHeight + rowGap));
      $(this).css('grid-row-end', 'span ' + rowSpan);
    })
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

  checkStatusOfResponse(response, cb) {
    if (response.statusCode == 0) {
      return cb(null, response.data);
    } else {
      this.errorMessage = response.message;
      // return cb(error, '');
    }
  }

}
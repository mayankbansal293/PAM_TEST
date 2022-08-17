import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CommonHelperService } from '../../../services/common-helper.service';
declare var $: any;

@Component({
  selector: 'app-user-menu-privileges',
  templateUrl: './user-menu-privileges.component.html',
  styleUrls: ['./user-menu-privileges.component.scss']
})
export class UserMenuPrivilegesComponent implements OnInit {
  @Input('priviledgeList') priviledgeList;
  @Input('userId') userId;
  menuForm: FormGroup;
  errorMessage="";
  responseMessage="";
  constructor(private fb: FormBuilder,private commonHelper: CommonHelperService) { }

  ngOnInit() {
    this.menuForm = this.fb.group({
      appArray: this.fb.array([]),
    })
    this.addAppArray(this.priviledgeList);
  }
  addAppArray(appData) {
    const app = <FormArray>this.menuForm.get('appArray');
    appData.map(appData => {
      app.push(this.addAppData(appData))
    });
  }
  addAppData(appData) {
    const form = this.fb.group({
      appTypeName: appData.appType.split('_').join(' ').toUpperCase(),
      moduleArray: this.fb.array([])
    });
    this.addModuleArray(appData.moduleIdList, form);
    return form;
  }
  addModuleArray(moduleArray, control) {
    const mod = <FormArray>control.get('moduleArray');
    moduleArray.map(data => {
      mod.push(this.addModuleData(data));
    })
  }
  addModuleData(moduleData) {
    const form = this.fb.group({
      moduleName: [moduleData.moduleCaption],
      moduleId: [moduleData.moduleId],
      moduleIdSelected: [''],
      menuArray: this.fb.array([])
    });
    this.addMenuArray(moduleData.menuIdPermIsReqLstBeanList, form);
    return form;
  }
  addMenuArray(menuArray, control) {
    const menu = <FormArray>control.get('menuArray');
    menuArray.map(data => {
      menu.push(this.addMenuData(data));
    })
  }
  addMenuData(menuData) {
    const form = this.fb.group({
      menuName: [menuData.caption],
      menuId: [menuData.menuId],
      menuIdSelected: [{ value: menuData.status == '1' ? true : false, disabled: !menuData.checkForPermissions }],
      menuRequired: [{ value: menuData.checkForPermissions == '0' ? true : false, disabled: !menuData.checkForPermissions }],
      status: [menuData.status == '1' ? true : false],
      permissionArray: this.fb.array([])
    });
    this.addPermissionArray(menuData.permissionCodeStatusBeanList, form);
    return form;
  }
  addPermissionArray(permissionArray, control) {
    const permission = <FormArray>control.get('permissionArray');
    permissionArray.forEach((permissionData) => {
      permission.push(
        this.fb.group({
          permissionName: [permissionData.permissionDisplayName],
          permissionCode: [permissionData.permissionCode],
          isRequired: [permissionData.isRequired == 'YES' ? true : false],
          status: [permissionData.status],
          permissionSelected:[{value: permissionData.status == 1 ? true : '', disabled: permissionData.isRequired == 'YES' ? true : false }]
        })
      );
    });
    return control;
  }
  changedModule(form, index) {
    let menus = form.get('menuArray').controls as FormArray;
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

  cbGroupColumnCheck() {
    const rowHeight = parseInt($('.privPanelWrap .cbGroupColumnWrap').css('grid-auto-rows'));
    const rowGap = parseInt($('.privPanelWrap .cbGroupColumnWrap').css('grid-row-gap'));
    $('.privPanelWrap .cbGroupColumn').each(function () {
      const rowSpan = Math.ceil(($(this).find('> .cbwrap').height() + rowGap) / (rowHeight + rowGap));
      $(this).css('grid-row-end', 'span ' + rowSpan);
    })
  }
  updateRole() {
    let requestData = [];
    let appArray = (<FormArray>this.menuForm.controls.appArray)
    for (let i = 0; i < appArray.controls.length; i++) {
      let moduleArray = (<FormArray>appArray.controls[i].get('moduleArray'))
      for (let j = 0; j < moduleArray.length; j++) {
        let menuArray = (<FormArray>moduleArray.controls[j].get('menuArray'))

        for (let k = 0; k < menuArray.length; k++) {
          if (menuArray.controls[k].get('menuIdSelected').value) {
            let menuId = menuArray.controls[k].get('menuId').value
            let permissionArray = (<FormArray>menuArray.controls[k].get('permissionArray'))
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

    if (requestData.length > 0) {
      let data = {
        "requestData": {
          "menuIdPermCodeList": requestData,
          "userId": this.userId,
        },
        "token": localStorage.getItem('authToken')
      }
      this.updateDetails(data, 'updateUserMenu');
    } else {
      this.errorMessage = this.commonHelper.getCustomMessages("selectAtleast")
      this.scrollAndShowMessage('containerWrap')
    }

  }
  updateDetails(reqObj, updateType) {
    this.commonHelper.makeRequest(reqObj, updateType, true).subscribe(res => {
      if (res.statusCode == 0) {
        this.responseMessage = res.message;
      } else {
        this.errorMessage = res.message;
      }
      this.scrollAndShowMessage('containerWrap')
    })
  }
  scrollAndShowMessage(className) {
    let el = $('.' + className);
    $('html,body').animate({ scrollTop: (el.offset().top - 150) }, 'slow', () => {
      el.focus();
    });
    setTimeout(() => {
      this.responseMessage = ""
      this.errorMessage = ""
    }, 5000)
  }
}
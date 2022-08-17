declare var $: any;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserAccessModalComponent } from '../user-access-modal/user-access-modal.component';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { UserDetailsModalComponent } from '../user-details-modal/user-details-modal.component';
import { CommonHelperService } from '../../../../services/common-helper.service';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.scss'],
})
export class ViewUserDetailsComponent implements OnInit {

  @Input() channelList;
  @Input() res;
  @Output() valueChange = new EventEmitter();
  userId;
  roleId;
  requestData = {};
  menuForm: UntypedFormGroup
  userData: any;
  userAccessData: any;
  userAccessDetailsForm: UntypedFormGroup;
  arrayControl: any;
  responseMessage: any;
  userSearchData: any;
  roleMenus;
  userDetailsForm: UntypedFormGroup;
  searchPermissions;
  errorMessage;
  wareHouseRegionForm: UntypedFormGroup;
  servingRegionList = [];
  config = {
    displayKey: this.commonHelper.getCustomMessages('regionName'),
    search: false,
    height: this.commonHelper.getCustomMessages('auto'),
    placeholder: this.commonHelper.getCustomMessages('selectRegion'),
    customComparator: () => { },
    limitTo: 20,
    noResultsFound: this.commonHelper.getCustomMessages('noMoreRegions')
  };
  initialRegions = [];
  constructor(private commonHelper: CommonHelperService,
    //  private modalService: NgbModal,
    private fb: UntypedFormBuilder) {
    this.searchPermissions = this.commonHelper.returnPagePermission('USER_SEARCH');
  }

  ngOnInit() {
    this.menuForm = this.fb.group({
      appArray: this.fb.array([]),
    })
    this.userDetailsForm = this.fb.group({
      addressOne: [''],
      addressTwo: [''],
      altMobileNumber: [''],
      city: [''],
      contactPerson: [''],
      countryCode: [''],
      emailId: [''],
      firstName: [''],
      lastName: [''],
      middleName: [''],
      mobileNumber: [''],
      password: [''],
      state: [''],
      updatedAt: [''],
      userId: 0,
      username: [''],
      zipCode: ['']
    })

    this.userAccessDetailsForm = this.fb.group({
      userAccessDetailArray: this.fb.array([])
    })

    this.userDetailsForm.valueChanges.subscribe(res => {
      this.errorMessage = '';
      this.responseMessage = '';
    })

    this.wareHouseRegionForm = this.fb.group({
      region: [''],
      warehouse: ['']
    })

    let data = {
      token: localStorage.getItem('authToken'),
      userId: this.res
    }

    this.commonHelper.makeRequest(data, 'getUserDetails', true).subscribe(res => {
      if (res.statusCode == 0) {
        this.userData = res.data;
      }
    })

    this.commonHelper.makeRequest(data, 'getUserAccessDetails', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.userAccessData = res.data.accessDetails;
        this.addAccessDetailArray(this.userAccessData)
      }

      if (res.statusCode == 216) {
        let tempData = {
          [this.commonHelper.getCustomMessages('sunday')]: this.commonHelper.getCustomMessages('na'),
          [this.commonHelper.getCustomMessages('monday')]: this.commonHelper.getCustomMessages('na'),
          [this.commonHelper.getCustomMessages('tuesday')]: this.commonHelper.getCustomMessages('na'),
          [this.commonHelper.getCustomMessages('wednesday')]: this.commonHelper.getCustomMessages('na'),
          [this.commonHelper.getCustomMessages('thursday')]: this.commonHelper.getCustomMessages('na'),
          [this.commonHelper.getCustomMessages('friday')]: this.commonHelper.getCustomMessages('na'),
          [this.commonHelper.getCustomMessages('saturday')]: this.commonHelper.getCustomMessages('na')
        }
        this.userAccessData = tempData;
        this.addAccessDetailArray(this.userAccessData);
      }
    })

  }

  initAccessDetailArray(time, day) {
    return this.fb.group({
      day: [day],
      daytoShow: [day.charAt(0).toUpperCase() + day.slice(1)],
      allowedType: [time == this.commonHelper.getCustomMessages('na') ? this.commonHelper.getCustomMessages('notAllowed') : time == this.commonHelper.getCustomMessages('time') ? this.commonHelper.getCustomMessages('fullDay') : this.commonHelper.getCustomMessages('custom')],
      timeSlot: [time],
      showError: false
    })
  }

  addAccessDetailArray(data) {
    let dayArray = this.createDayArray();
    const control = this.userAccessDetailsForm.controls['userAccessDetailArray'] as UntypedFormArray;
    dayArray.forEach(day => {
      let time = data[day]
      control.push(this.initAccessDetailArray(time, day));
    })
  }

  createDayArray() {
    let dayArray = [
      this.commonHelper.getCustomMessages('monday'),
      this.commonHelper.getCustomMessages('tuesday'),
      this.commonHelper.getCustomMessages('wednesday'),
      this.commonHelper.getCustomMessages('thursday'),
      this.commonHelper.getCustomMessages('friday'),
      this.commonHelper.getCustomMessages('saturday'),
      this.commonHelper.getCustomMessages('sunday')]
    return dayArray;
  }

  openUserAccessModel(details) {
    // const activeModal = this.modalService.open(UserAccessModalComponent);
    // activeModal.componentInstance.data = details.controls.timeSlot.value;
    // activeModal.result.then(result => {
    //   details.patchValue({ timeSlot: result })
    //   details.patchValue({ showError: false })
    // })
  }
  ngOnDestroy() {
    // this.modalService.dismissAll();
  }

  get f() { return this.wareHouseRegionForm.controls; }

  openUserDetailsModel(details) {
    // const activeModal = this.modalService.open(UserDetailsModalComponent, { backdrop: this.commonHelper.getCustomMessages('static'), size: this.commonHelper.getCustomMessages('lg'), keyboard: false });
    // activeModal.componentInstance.modalHeader = this.commonHelper.getCustomMessages('updateDetails');
    // activeModal.componentInstance.selectTypeArray = [];
    // activeModal.componentInstance.selectAddressContent = [{
    //   keyValue: 'address',
    //   keyName: this.commonHelper.getCustomMessages('address')
    // }
    // ];

    // activeModal.componentInstance.selectPersonalContent = [{
    //   keyValue: 'emailId',
    //   keyName: this.commonHelper.getCustomMessages('emailId')
    // }, {
    //   keyValue: 'mobileNumber',
    //   keyName: this.commonHelper.getCustomMessages('mobileNumber')
    // },
    // {
    //   keyValue: 'password',
    //   keyName: this.commonHelper.getCustomMessages('password')
    // }
    // ];

    // activeModal.componentInstance.channelList = this.channelList;
    // activeModal.componentInstance.userId = this.res;
    // activeModal.componentInstance.userModalData = this.userData;
    // activeModal.result.then((data) => {
    //   if (data && !data.error) {
    //     this.userData = data.userModalData;
    //     this.responseMessage = data.responseMessage;
    //   }
    //   this.commonHelper.animateMessage.call(this, 'containerWrap');
    // });

  }

  setAllowedType(event, form) {
    if (event.target.value == this.commonHelper.getCustomMessages('notAllowed')) {
      form.patchValue({ timeSlot: this.commonHelper.getCustomMessages('na') })
    }
    if (event.target.value == this.commonHelper.getCustomMessages('fullDay')) {
      form.patchValue({ timeSlot: this.commonHelper.getCustomMessages('time') })
    }
    if (event.target.value == this.commonHelper.getCustomMessages('custom')) {
      form.patchValue({ timeSlot: '' })
      form.patchValue({ showError: false })
    }
  }

  saveUser() {
    let request = { userRequest: {}, token: localStorage.getItem('authToken') }
    let count = 0;
    let control = this.userAccessDetailsForm.controls.userAccessDetailArray as UntypedFormArray;
    for (let i = 0; i < control.length; i++) {
      if (control.controls[i].get('allowedType').value == this.commonHelper.getCustomMessages('notAllowed')) {
        request.userRequest[control.controls[i].get('day').value] = this.commonHelper.getCustomMessages('na')
      } else if (control.controls[i].get('allowedType').value == this.commonHelper.getCustomMessages('fullDay')) {
        request.userRequest[control.controls[i].get('day').value] = this.commonHelper.getCustomMessages('time')
      } else {
        if (control.controls[i].get('timeSlot').value)
          request.userRequest[control.controls[i].get('day').value] = control.controls[i].get('timeSlot').value
        else {
          control.controls[i].patchValue({ showError: true })
          count = 1;
        }
      }
    }
    if (count > 0) {
      return;
    }
    request.userRequest['userId'] = this.res;
    this.updateDetails(request, 'doUpdateUserAccessDetails');
  }

  updateDetails(reqObj, updateType) {
    this.commonHelper.makeRequest(reqObj, updateType, true).subscribe(res => {
      if (res.statusCode == 0) {
        this.responseMessage = res.message;
      } else {
        this.errorMessage = res.message;
      }
      this.commonHelper.animateMessage.call(this, 'containerWrap');
    })
  }

  onBack() {
    this.valueChange.emit(true);
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

  checkHeight() {
    setTimeout(() => {
      let allItems = document.getElementsByClassName('cbGroupColumn');
      for (let x = 0; x < allItems.length; x++) {
        resizeGridItem(allItems[x]);
      }
      window.addEventListener('resize', resizeAllGridItems);
    }, 0)
  }

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

    if (requestData.length > 0) {
      let data = {
        'requestData': {
          'menuIdPermCodeList': requestData,
          'userId': this.res,
        },
        'token': localStorage.getItem('authToken')
      }
      this.updateDetails(data, 'updateUserMenu');
    } else {
      this.errorMessage = this.commonHelper.getCustomMessages('selectAtleast')
      this.commonHelper.animateMessage.call(this, 'containerWrap');
    }
  }

  checkPermission(permissionString: string): boolean {
    return this.searchPermissions.indexOf(permissionString) > -1 ? true : false;
  }

  getmenudata() {
    const requestData = {
      token: localStorage.getItem('authToken'),
      userId: this.res,
      roleId: this.userData.roleId,
    }
    this.roleMenus = [];
    this.commonHelper.makeRequest(requestData, 'getUserMenusData', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.roleMenus = res.appTypeModuleIdBeanList;
        if (this.roleMenus) {
          this.menuForm = this.fb.group({
            appArray: this.fb.array([]),
          })
          this.addAppArray(this.roleMenus);
          this.checkHeight();
        }
      } else {
        this.errorMessage = res.message;
        this.commonHelper.animateMessage.call(this, 'containerWrap');
      }
    })
  }

  setData(event) {
    if (event.nextId == 'ngb-tab-1') {
      this.getmenudata();
    }
    if (event.nextId == 'ngb-tab-2') {
      this.commonHelper.makeRequest({ token: localStorage.getItem('authToken') }, 'getRegionList', false).subscribe(res => {
        this.servingRegionList = [];
        if (res.statusCode == 0)
          this.servingRegionList = res.data;
      })
    }
  }

  blockUnblockUser(status) {
    let data = {
      token: localStorage.getItem('authToken'),
      userId: this.res,
    }
    if (status == 'UNBLOCK')
      data['blockStatus'] = status
    else
      data['status'] = status

    this.commonHelper.makeRequest(data, 'updateUserDetails', true).subscribe(res => {
      if (res.statusCode == 0) {
        if (status == 'UNBLOCK')
          this.userData.blockDate = null;
        else
          this.userData.status = status
        this.responseMessage = res.message;
      } else {
        this.errorMessage = res.message;
      }
      this.commonHelper.animateMessage.call(this, 'containerWrap');
    })
  }
}



function resizeGridItem(item) {
  let grid = document.getElementsByClassName('cbGroupColumnWrap')[0];
  let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  let rowSpan = Math.ceil((item.querySelector('.cbwrap').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
  item.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeAllGridItems() {
  let allItems = document.getElementsByClassName('cbGroupColumn');
  for (let x = 0; x < allItems.length; x++) {
    resizeGridItem(allItems[x]);
  }
}


import { Component, OnInit } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPermissionsModalComponent } from '../add-permissions-modal/add-permissions-modal.component';
import { CommonHelperService } from '../../../services/common-helper.service';
import { Router, NavigationEnd } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-manage-permission',
  templateUrl: './manage-permission.component.html',
  styleUrls: ['./manage-permission.component.scss']
})
export class ManagePermissionComponent implements OnInit {
  showPermissionData = [];
  navigationSubscription;
  activePage = 1;
  rPerPage = 200;
  activeModal;
  searchForm: UntypedFormGroup;
  searchQuery = "";
  errorMessage = '';
  responseMessage = '';
  constructor(
    // private modalService: NgbModal,
     private commonHelper: CommonHelperService, private router: Router
    , private fb: UntypedFormBuilder) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });

  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchField: ['']
    });

    this.commonHelper.makeRequest({ token: localStorage.getItem('authToken') }, 'getPermission', true).subscribe(res => {
      if (res.statusCode == 0) {
        this.showPermissionData = res.data;
      }else{
        this.errorMessage=res.message;
      }
    })
    this.searchQuery = '';
    this.searchForm.get('searchField').valueChanges.subscribe(res => {
      this.searchQuery = res;
    })
  }

  openAddPermissions() {
    // this.activeModal = this.modalService.open(AddPermissionsModalComponent, { backdrop: "static", size: "lg" });
    // this.activeModal.componentInstance.modalHeader = "Add Permission";
    // this.activeModal.componentInstance.data = true;
    // this.activeModal.result.then((result) => {

    //   if (result) {
    //     this.showPermissionData.push(result)
    //   }
    // })

  }

  editPermissions(d, index) {
    // this.activeModal = this.modalService.open(AddPermissionsModalComponent, { backdrop: "static", size: "lg" });
    // this.activeModal.componentInstance.modalHeader = "Edit Permission";
    // this.activeModal.componentInstance.data = false;
    // this.activeModal.componentInstance.patchData = {
    //   displayName: d.displayName,
    //   description: d.description,
    //   accessUrl: d.accessUrl,
    //   status: d.status,
    //   id: d.id,
    //   publicAccess: d.publicAccess,
    //   timeout: d.timeOut
    // }

    // this.activeModal.result.then((result) => {
    //   if (result && (index = (this.activePage - 1) * this.rPerPage + index) && index) {
    //     this.showPermissionData[index - 1].displayName = result.displayName
    //     this.showPermissionData[index - 1].description = result.description
    //     this.showPermissionData[index - 1].accessUrl = result.accessUrl
    //     this.showPermissionData[index - 1].status = result.status
    //     this.showPermissionData[index - 1].publicAccess = result.publicAccess
    //     this.showPermissionData[index - 1].timeOut = result.timeout


    //   }
    // })
  }
  onPageChange(event) {
    this.activePage = event;
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
      if (this.activeModal) {
        this.activeModal.close();
      }
    }
  }

}

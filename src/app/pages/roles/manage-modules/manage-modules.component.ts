import { Component, OnInit } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModulesModalComponent } from '../modules-modal/modules-modal.component';
import { CommonHelperService } from '../../../services/common-helper.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-manage-modules',
  templateUrl: './manage-modules.component.html',
  styleUrls: ['./manage-modules.component.scss']
})
export class ManageModulesComponent implements OnInit {
  showModuleData = [];
  navigationSubscription;
  activeModal;
  activePage = 1;
  rPerPage = 200;
  constructor(
    // private modalService: NgbModal,
     private commonHelper: CommonHelperService, private router: Router) {

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {

    this.commonHelper.makeRequest({ token: localStorage.getItem('authToken') }, 'getModule', false).subscribe(res => {
      if (res.statusCode == 0) {
        this.showModuleData = res.data;
      }
    })
  }
  openAddModules() {
    // this.activeModal = this.modalService.open(ModulesModalComponent, { backdrop: "static", size: "lg" });
    // this.activeModal.componentInstance.modalHeader = "Add Module";
    // this.activeModal.componentInstance.data = true;
    // this.activeModal.result.then((result) => {

    //   if (result) {
    //     this.showModuleData.push(result)
    //   }
    // })
  }
  editModules(d, index) {
    // this.activeModal = this.modalService.open(ModulesModalComponent, { backdrop: "static", size: "lg" });
    // this.activeModal.componentInstance.modalHeader = "Edit Module";
    // this.activeModal.componentInstance.data = false;
    // this.activeModal.componentInstance.patchData = {
    //   moduleCode: d.moduleCode,
    //   caption: d.caption,
    //   sequence: d.sequence,
    //   status: d.status,
    //   moduleId: d.id || d.moduleId
    // }

    // this.activeModal.result.then((result) => {
    //   if (result && (index = (this.activePage - 1) * this.rPerPage + index) && index) {
    //     this.showModuleData[index].caption = result.caption
    //     this.showModuleData[index].sequence = result.sequence
    //     this.showModuleData[index].status = result.status
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

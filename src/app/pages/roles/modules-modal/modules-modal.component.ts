import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHelperService } from '../../../services/common-helper.service';
import { NavigationEnd, Router } from '@angular/router';
import { CustomValidators } from '../../shared/directives/custom-validator';
// import { CustomValidators } from 'src/app/shared/directives/custom-validator';
declare var $: any;
@Component({
  selector: 'app-modules-modal',
  templateUrl: './modules-modal.component.html',
  styleUrls: ['./modules-modal.component.scss']
})
export class ModulesModalComponent implements OnInit {
  addModuleForm: UntypedFormGroup;
  patchData;
  updatedData = []
  responseMessage;
  errorMessage;
  resultData;
  navigationSubscription;
  modalHeader;
  data;
  constructor(
    // private modal: NgbActiveModal,
     private formBuilder: UntypedFormBuilder, private commonHelper: CommonHelperService, private router: Router) {
  this.navigationSubscription = this.router.events.subscribe((e: any) => {
    if (e instanceof NavigationEnd) {
      this.ngOnInit();
    }
  });
  }

  ngOnInit() {
    this.addModuleForm = this.formBuilder.group({
      moduleCode: ['', Validators.required],
      caption: ['', CustomValidators.required],
      sequence: ['', [Validators.required, Validators.max(20), Validators.min(1)]],
      status: ['']
    })
    this.addModuleForm.patchValue({ moduleCode: this.patchData ? this.patchData.moduleCode : '' })
    this.addModuleForm.patchValue({ caption: this.patchData ? this.patchData.caption : '' })
    this.addModuleForm.patchValue({ sequence: this.patchData ? this.patchData.sequence : '' })
    this.addModuleForm.patchValue({ status: this.patchData ? this.patchData.status : '' })
    if (this.patchData) {
      this.addModuleForm.get('status').setValidators([Validators.required]);
      this.addModuleForm.get('status').updateValueAndValidity();
    } else {
      this.addModuleForm.get('status').clearValidators();
      this.addModuleForm.get('status').updateValueAndValidity();
    }
  }

  add() {
    if (this.addModuleForm.valid) {
      let request = {
        token: localStorage.getItem('authToken'),
        moduleCode: this.addModuleForm.get('moduleCode').value,
        caption: this.addModuleForm.get('caption').value,
        sequence: this.addModuleForm.get('sequence').value,
        status: "1",
      }
      this.commonHelper.makeRequest(request, 'addModule', false).subscribe(res => {
        if (res.statusCode == 0) {
          this.responseMessage = res.message;
          this.resultData = res.data;
        } else {
          this.errorMessage = res.message
        }
        this.commonHelper.animateMessage("containerNWrap")
      })
    }
    else {
      this.validateAllFormFields(this.addModuleForm);
    }
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });

    if (!formGroup.valid) {
      let el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 150) }, 'slow', () => {
        el.focus();
      });
    }
  }
  update() {
    // console.log(this.patchData)

    if (this.addModuleForm.valid) {
      let request = {
        token: localStorage.getItem('authToken'),
        moduleId: this.patchData.moduleId,
        caption: this.addModuleForm.get('caption').value,
        sequence: this.addModuleForm.get('sequence').value,
        status: this.addModuleForm.get('status').value,
      }
      //  console.log(request)
      this.commonHelper.makeRequest(request, 'updateModule', false).subscribe(res => {
        if (res.statusCode == 0) {
          this.responseMessage = res.data;
          this.resultData = {
            caption: this.addModuleForm.get('caption').value,
            sequence: this.addModuleForm.get('sequence').value,
            status: this.addModuleForm.get('status').value,
          }
        }
        else {
          this.errorMessage = res.message;
        }
        this.commonHelper.animateMessage("containerNWrap")
      })
    }
    else {
      this.validateAllFormFields(this.addModuleForm);
    }
  }

  closeModal() {
    // this.modal.close(this.resultData);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  get f() { return this.addModuleForm.controls; }
}

import { Component, OnInit } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonHelperService } from '../../../services/common-helper.service';
import { NavigationEnd, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-permissions-modal',
  templateUrl: './add-permissions-modal.component.html',
  styleUrls: ['./add-permissions-modal.component.scss']
})
export class AddPermissionsModalComponent implements OnInit {
  addPermissionForm:FormGroup;
  patchData:any;
  permissionData:any;
  responseMessage:"";
  modalType;
  errorMessage:"";
  addData;
  resultData;
  modalHeader;
  data;
  navigationSubscription;
  constructor(
    // public modal: NgbActiveModal,
    private commonHelper: CommonHelperService,
    private formBuilder: FormBuilder,private router:Router) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
          }
       
      });
     }

  ngOnInit() {
    this.addPermissionForm=this.formBuilder.group({
      permissionCode:[''],
      displayName:['',Validators.required],
      description: ['',Validators.required],
      accessUrl: ['',Validators.required],
      publicAccess: ['',Validators.required],
      timeout: ['',[Validators.required,Validators.max(120),Validators.min(60)]],
      status:[''],
    });

    this.addPermissionForm.patchValue({displayName: this.patchData ? this.patchData.displayName : ''})
    this.addPermissionForm.patchValue({description: this.patchData ? this.patchData.description : ''})
    this.addPermissionForm.patchValue({accessUrl: this.patchData ? this.patchData.accessUrl:'' })
    this.addPermissionForm.patchValue({status: this.patchData ? this.patchData.status:''  })
    this.addPermissionForm.patchValue({publicAccess: this.patchData ? this.patchData.publicAccess:''  })
    this.addPermissionForm.patchValue({timeout: this.patchData ? this.patchData.timeout:''  })



    if(this.patchData){
      this.addPermissionForm.get('permissionCode').clearValidators();
      this.addPermissionForm.get('permissionCode').updateValueAndValidity();
      this.addPermissionForm.get('status').setValidators([Validators.required]);
      this.addPermissionForm.get('status').updateValueAndValidity();
  
    }else{
      this.addPermissionForm.get('permissionCode').setValidators([Validators.required]);
      this.addPermissionForm.get('permissionCode').updateValueAndValidity();
      this.addPermissionForm.get('status').clearValidators();
      this.addPermissionForm.get('status').updateValueAndValidity();
    }
  }
add(){
    if(this.addPermissionForm.valid){  
    let request = {
      token:localStorage.getItem('authToken'),
      displayName:this.addPermissionForm.get('displayName').value,
      description:this.addPermissionForm.get('description').value,
      accessUrl:this.addPermissionForm.get('accessUrl').value,
      status:'1',
      permissionCode:this.addPermissionForm.get('permissionCode').value,
      timeOut:this.addPermissionForm.get('timeout').value,
      publicAccess:this.addPermissionForm.get('publicAccess').value
  }

    this.commonHelper.makeRequest(request, 'addPermission', false).subscribe(res=>{
      if(res.statusCode == 0){
        this.responseMessage=res.message;
        this.resultData = res.data;
      }else{
          this.errorMessage=res.message
      }
      this.commonHelper.animateMessage("containerNWrap")
    })
  }else{
    this.validateAllFormFields(this.addPermissionForm);
  }
}

validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {  
    const control = formGroup.get(field);
    if (control instanceof FormControl) {             
      control.markAsDirty({ onlySelf: true });
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {      
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
update(){
  if(this.addPermissionForm.valid){
    let request = {
      token:localStorage.getItem('authToken'),
      id:this.patchData.id,
      displayName:this.addPermissionForm.get('displayName').value,
      description:this.addPermissionForm.get('description').value,
      accessUrl:this.addPermissionForm.get('accessUrl').value,
      status:this.addPermissionForm.get('status').value,
      publicAccess:this.addPermissionForm.get('publicAccess').value,
      timeout:this.addPermissionForm.get('timeout').value,
    }
    this.commonHelper.makeRequest(request,'updatePermission',false).subscribe(res=>{
      if(res.statusCode==0){
        this.responseMessage=res.data;
        this.resultData={
          displayName:this.addPermissionForm.get('displayName').value,
          description:this.addPermissionForm.get('description').value,
          accessUrl:this.addPermissionForm.get('accessUrl').value,
          status:this.addPermissionForm.get('status').value,
          publicAccess:this.addPermissionForm.get('publicAccess').value,
          timeout:this.addPermissionForm.get('timeout').value,
        }
      }else{
        this.errorMessage=res.message; 
      }
      this.commonHelper.animateMessage("containerNWrap")
  })
  }else{
    this.validateAllFormFields(this.addPermissionForm);
  }
}
closeModal(){
    //  this.modal.close(this.resultData);
}

ngOnDestroy() {
  if (this.navigationSubscription) {
    this.navigationSubscription.unsubscribe();
  }
}

get f(){return this.addPermissionForm.controls;}
}

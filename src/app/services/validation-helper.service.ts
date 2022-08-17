import { Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class ValidationHelperService {

  constructor() { }

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
      if (el.length)
        $('html,body').animate({ scrollTop: (el.offset().top - 150) }, 'slow', () => {
          el.focus();
        });
    }
  }

}

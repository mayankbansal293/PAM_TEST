import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNoSpace]'
})
export class NoSpaceDirective {

  constructor(private el: ElementRef) {   }
  @HostListener('keypress', ['$event']) onKeyPress(event) {     
    let e = <KeyboardEvent> event;    
    const charCode = (e.which) ? e.which : e.keyCode;
    if (charCode == 32) {
      return false;
    }
    return true;
  }

}

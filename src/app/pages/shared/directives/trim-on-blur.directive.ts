import { Directive, Self, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimOnBlur]'
})
export class TrimOnBlurDirective {
  constructor(private el: ElementRef, public control: NgControl) { }
  @HostListener('blur', ['$event']) onblur(event) {
    const textData = event.srcElement.value.replace(/ +(?= )/g, '').trim();
    this.control.control.setValue(textData);
  }
}

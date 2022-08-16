import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';
// import { environment } from 'src/environments/environment';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCharacterOnly]'
})
export class CharacterOnlyDirective {
private navigationKeys = [
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'Home',
  'End',
  'ArrowLeft',
  'ArrowRight',
  'Clear',
  'Copy',
  'Paste'
];
inputElement: HTMLElement;
constructor(public el: ElementRef,public control:NgControl) {
  this.inputElement = el.nativeElement;
}

@HostListener('keydown', ['$event'])
onKeyDown(e: KeyboardEvent) {
  if (
    this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
    (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
    (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
    (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
    (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
    (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
    (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
    (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
    (e.key === 'x' && e.metaKey === true) // Allow: Cmd+X (Mac)
  ) {
    // let it happen, don't do anything
    return;
  }
 
  // Ensure that it is a number and stop the keypress   
  const charCode = (e.which) ? e.which : e.keyCode;
  // console.log(charCode)
  if ((charCode < 65 || charCode > 90)  && charCode != 32) {
  e.preventDefault();
  }
}

@HostListener('paste', ['$event'])
onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const pastedInput: string = event.clipboardData
    .getData('text/plain')
    .replace(/[^a-zA-Z ]/g, ''); // get a digit-only string
  document.execCommand('insertText', false, pastedInput);
}

@HostListener('drop', ['$event'])
onDrop(event: DragEvent) {
  event.preventDefault();
  const textData = event.dataTransfer.getData('text').replace(/[^a-zA-Z ]/g, '');
  this.inputElement.focus();
  document.execCommand('insertText', false, textData);
}

@HostListener('blur', ['$event'])
onBlur(event) {
  const textData = event.srcElement.value.trim();
  this.control.control.setValue(textData);
}
}

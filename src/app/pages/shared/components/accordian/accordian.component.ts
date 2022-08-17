import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'accordian',
  templateUrl: './accordian.component.html',
  styleUrls: ['./accordian.component.scss']
})
export class AccordianComponent {
  @Input() title;
  @HostListener('click', ['$event']) onclick(event) {
    var panel = event.srcElement.nextElementSibling;
    if (panel) {
      event.srcElement.classList.toggle("active");
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 20 + "px";
      }
    }
  }
  constructor() { }
}

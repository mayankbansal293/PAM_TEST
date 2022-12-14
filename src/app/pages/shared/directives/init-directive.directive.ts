
import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';
@Directive({
  selector: '[ngInit]'
})
export class InitDirectiveDirective implements OnInit {
  @Input() isLast: boolean;

  @Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if (this.isLast) {
      setTimeout(() => this.initEvent.emit(), 0);
    }
  }
}
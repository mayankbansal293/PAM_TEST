import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ba-card',
  templateUrl: './ba-card.component.html',
  styleUrls: ['./ba-card.component.scss']
})
export class BaCardComponent implements OnInit {

  constructor() { }
  @Input() cardTitle: String;
  @Input() goBack: String;
  @Input() baCardClass: String;
  @Input() cardType: String;
  @Input() url: String;
  ngOnInit() {
  }

}

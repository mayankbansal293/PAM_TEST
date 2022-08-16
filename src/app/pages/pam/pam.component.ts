import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IframeUrlService } from '../services/iframeUrlService';

@Component({
  selector: 'app-pam',
  templateUrl: './pam.component.html',
  styleUrls: ['./pam.component.scss']
})
export class PamComponent implements OnInit {
  pageTitle;
  menuData;
  showMenu = true;
  serviceData
  constructor(private iframeService: IframeUrlService, private router: Router) {

    this.iframeService.showMenu.subscribe(res => {
      this.showMenu = res;
    })

  }

  ngOnInit() {

  }
  title(title) {
    this.pageTitle = title
  }
  menu(menu) {
    this.menuData = menu;
  }
  setIframe(event) {
    if (event) {
      this.showMenu = true;
    }
    else {
      this.showMenu = false;
    }
  }



}

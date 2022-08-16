import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonHelperService } from '../../../../services/common-helper.service';
import { mergeNsAndName } from '@angular/compiler';
import { filter } from 'rxjs/operators';
import { IframeUrlService } from '../../../../services/iframeUrlService';

@Component({
  selector: 'app-title-page',
  templateUrl: './title-page.component.html',
  styleUrls: ['./title-page.component.scss']
})
export class TitlePageComponent implements OnInit {
  pageTitle;
  @Input() menu
  menuData = [];
  selectedIndex;
  constructor(private router: Router,
    private commonHelperService: CommonHelperService,private iframeUrlService:IframeUrlService) {
    this.commonHelperService.pageCurrentTitle.subscribe(res => {
      this.pageTitle = res;
    })
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.commonHelperService.currentURl(event.url)
      }
    });
  }

  getMenuTitle(title) {
    this.pageTitle = title
  }

  setTitle(title) {
    this.commonHelperService.setPageTitle(title);
    return false;
  }

  getModules(moduleUrl) {
      this.iframeUrlService.changeUrl(moduleUrl);
  }

  getModuleCode(moduleCode) {
    localStorage.setItem('moduleCode',moduleCode);
  }
  
  setIndex(index) {
    this.selectedIndex = index;
  }
}

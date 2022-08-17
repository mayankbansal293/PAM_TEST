import { Component } from '@angular/core';
import { NbMenuService } from "@nebular/theme";
import { CommonHelperService } from "../../../../common-helper.service";

@Component({
  selector: "ngx-one-column-layout",
  styleUrls: ["./one-column.layout.scss"],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
        <span
          ><img
            style="padding-top: 155px;padding-left: 20px;/* margin-top: 20px; */"
            src="../../../../assets/images/payprFooter.png"
        /></span>
      </nb-sidebar>

      <nb-layout-column>
        <div class="breadCrumbWrap">
          <div class="containerWrap">
            <div class="breadCrumb">
              <h1>{{ bread }}</h1>

              <ng-container *ngFor="let title of pageTitle; index as i">
                <span class="link">{{ title }}hey</span>
                <span class="link" *ngIf="title == 'Dashboard'">Home</span>
                <span class="divider">HI</span>
              </ng-container>
              <span class="link active">{{
                pageTitle[pageTitle.length - 1]
              }}</span>
            </div>
          </div>
        </div>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
      <div class="breadCrumbWrap">
        <div class="containerWrap">
          <div class="breadCrumb">
            <h1
              style="
            padding-top: 23px;
            font-size: 15px;"
            >
              {{ bread }}
            </h1>

            <ng-container *ngFor="let title of pageTitle; index as i">
              <span class="link">{{ title }}hey</span>
              <span class="link" *ngIf="title == 'Dashboard'">Home</span>
              <span class="divider">HI</span>
            </ng-container>
            <span class="link active">{{
              pageTitle[pageTitle.length - 1]
            }}</span>
          </div>
        </div>
      </div>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  pageTitle;
  tada = [];
  bread;
  constructor(
    private commonHelper: CommonHelperService,
    private sidebarService: NbMenuService
  ) {
    this.sidebarService.onItemClick().subscribe((res) => {
      console.log(res);
      this.bread = res.item.data.breadCrumb;
    });
    this.sidebarService.getSelectedItem().subscribe((res) => {
      console.log(res);
    });
    this.commonHelper.pageCurrentTitle.subscribe((res) => {
      this.pageTitle = res;
      console.log(res);
    });
  }
  ngOnInit() {}
  getMenuTitle(title) {
    this.pageTitle = title;
    console.log(this.pageTitle);
  }

  setTitle(title) {
    this.commonHelper.setPageTitle(title);
    return false;
  }
}

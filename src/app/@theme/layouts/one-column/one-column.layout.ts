import { Component } from '@angular/core';
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
        <div class="breadCrumbWrap">
          <div class="containerWrap">
            <div class="breadCrumb">
              <ng-container *ngFor="let title of pageTitle; index as i">
                <span
                  class="link"
                  *ngIf="title != 'Dashboard' && i != pageTitle.length - 1"
                  >{{ title }}</span
                >
                <span class="link" *ngIf="title == 'Dashboard'">Home</span>
                <span
                  class="divider"
                  *ngIf="title != 'Dashboard' && i != pageTitle.length - 1"
                ></span>
              </ng-container>
              <span
                class="link active"
                *ngIf="pageTitle[pageTitle.length - 1] != 'Dashboard'"
                >{{ pageTitle[pageTitle.length - 1] }}</span
              >
            </div>
          </div>
        </div>
      </nb-sidebar>

      <nb-layout-column>
        <div class="breadCrumbWrap">
          <div class="containerWrap">
            <div class="breadCrumb">
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

  constructor(private commonHelper: CommonHelperService) {
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

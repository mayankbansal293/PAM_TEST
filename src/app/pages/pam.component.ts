import { Component, OnInit } from "@angular/core";
import { CommonHelperService } from "../../common-helper.service";
import { NbMenuItem } from "@nebular/theme";
import { MENU_ITEMS } from "./pages-menu";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
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
    <ngx-one-column-layout>
      <div class="breadCrumbWrap">
        <div class="containerWrap">
          <div class="breadCrumb">
            <ng-container *ngFor="let title of pageTitle; index as i">
              <span class="link">{{ title }}</span>
              <span class="link" *ngIf="title == 'Dashboard'">Home</span>
              <span class="divider"></span>
            </ng-container>
            <span class="link active">{{
              pageTitle[pageTitle.length - 1]
            }}</span>
          </div>
        </div>
      </div>
      <nb-menu [items]="menua"></nb-menu>
      <ngx-header
        ><div class="breadCrumbWrap">
          <div class="containerWrap">
            <div class="breadCrumb">
              <ng-container *ngFor="let title of pageTitle; index as i">
                <span class="link">{{ title }}</span>
                <span class="link" *ngIf="title == 'Dashboard'">Home</span>
                <span class="divider"></span>
              </ng-container>
              <span class="link active">{{
                pageTitle[pageTitle.length - 1]
              }}</span>
            </div>
          </div>
        </div></ngx-header
      >
      <router-outlet></router-outlet>
      <div class="breadCrumbWrap">
        <div class="containerWrap">
          <div class="breadCrumb">
            <ng-container *ngFor="let title of pageTitle; index as i">
              <span class="link">{{ title }}</span>
              <span class="link" *ngIf="title == 'Dashboard'">Home</span>
              <span class="divider"></span>
            </ng-container>
            <span class="link active">{{
              pageTitle[pageTitle.length - 1]
            }}</span>
          </div>
        </div>
      </div>
    </ngx-one-column-layout>
  `,
})
export class PamComponent {
  pageTitle;
  tada = [];
  menua: NbMenuItem[] = [];
  menu = MENU_ITEMS;
  constructor(private commonHelper: CommonHelperService) {
    this.commonHelper.pageCurrentTitle.subscribe((res) => {
      this.pageTitle = res;
      console.log(res);
    });
  }
  ngOnInit() {
    const data = {
      token: localStorage.getItem("authToken"),
      userId: localStorage.getItem("userId"),
      appType: "Web_Panel",
      engineCode: "PAM",
      languageCode: localStorage.getItem("lang"),
    };
    this.commonHelper.getMenuList(data).subscribe((res) => {
      console.log(res);
      this.tada = res.moduleBeanLst;
      console.log(this.tada);
      this.tada.forEach((moduleData, index) => {
        this.menua.push({
          title: moduleData.displayName,
          icon: "shopping-cart-outline",
        });
        this.menua[index].children = [];
        for (let menuList of moduleData.menuBeanList) {
          this.menua[index].children.push({
            title: menuList.caption,
            link: menuList.relativePath,
          });
        }
      });
    });
  }
  getMenuTitle(title) {
    this.pageTitle = title;
  }

  setTitle(title) {
    this.commonHelper.setPageTitle(title);
    return false;
  }
}

import { Component, OnInit } from "@angular/core";
import { CommonHelperService } from "../../common-helper.service";
import { NbMenuItem } from "@nebular/theme";
import { MENU_ITEMS } from "./pages-menu";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  tada=[];
  menua: NbMenuItem[]=[];
  menu=MENU_ITEMS
  constructor(private commonHelper: CommonHelperService) {}
  ngOnInit() {
    const data = {
      token: "ELGNM8BXgivUSyn9NfkzYk+S59QKzwlZirfOTXrwM1clvuff7+iG4uWbU9ucpL6C",
      userId: "1",
      appType: "Web_Panel",
      engineCode: "PAM",
      languageCode: "en",
    };
    this.commonHelper.getMenuList(data).subscribe((res) => {
      console.log(res);
      this.tada = res.moduleBeanLst;
      console.log(this.tada)
      this.tada.forEach( (moduleData, index)=>{
        this.menua.push({ title: moduleData.displayName, })
        this.menua[index].children=[]
        for (let menuList of moduleData.menuBeanList) {
          this.menua[index].children.push({title:menuList.caption})
          
        }
      })
      
    });
  }
}

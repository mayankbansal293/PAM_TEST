import { Component, OnInit } from "@angular/core";
import { NbMenuItem, NbMenuService, NbSidebarService } from "@nebular/theme";
import { MENU_ITEMS } from "./pages-menu";
import { UserMenuPrivilegesComponent } from "./shared/user-menu-privileges/user-menu-privileges.component";
import { IframeUrlService } from "../services/iframeUrlService";
import { CommonHelperService } from "../services/common-helper.service";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
  <ngx-one-column-layout>
  <nb-menu [items]="menua"></nb-menu>
  <ngx-header></ngx-header>
  <router-outlet></router-outlet>
</ngx-one-column-layout>
  `,
})
export class PamComponent {
  bread;
  pageTitle;
  tada = [];
  menua: NbMenuItem[] = [];
  menu = MENU_ITEMS;
  constructor(
    private commonHelper: CommonHelperService,
    private menuService: NbMenuService,
    private sidebarService: NbSidebarService,
    private iframeUrlService : IframeUrlService
  ) {
    this.menuService.onItemClick().subscribe((res) => {
      console.log(res);
      this.bread = res?.item?.data?.breadCrumb;

      if(res?.item?.data?.moduleSsoUrl) {
        console.log(res?.item?.data?.moduleSsoUrl)
        this.getModuleCode(res?.item?.data?.moduleCode);
        this.getModules(res?.item?.data?.moduleSsoUrl);
      }
    });

    this.menuService.getSelectedItem().subscribe(res=>{
      console.log(res)
    })
    this.sidebarService.getSidebarState().subscribe(res=>{
      console.log(res)
    })
    
    this.commonHelper.pageCurrentTitle.subscribe((res) => {
      this.pageTitle = res;
      console.log(res);
    });
  }

  getModules(moduleUrl) {
    this.iframeUrlService.changeUrl(moduleUrl);
}

getModuleCode(moduleCode) {
  localStorage.setItem('moduleCode',moduleCode);
  // localStorage.setItem('serviceCode', moduleCode)
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
      this.menu = res.moduleBeanLst;

      console.log(res);
      this.tada = res.moduleBeanLst;
      console.log(this.tada);
      this.tada.forEach((moduleData, index) => {
        this.menua.push({
          title: moduleData.displayName,
          icon: "shopping-cart-outline",
          data:{moduleSsoUrl:moduleData.moduleSsoUrl,
            moduleCode: moduleData.moduleCode,
            moduleData},
            link: moduleData.moduleSsoUrl ? 'iframe' : undefined
        });
        if(moduleData.menuBeanList.length) {
        this.menua[index].children = [];
        for (let menuList of moduleData.menuBeanList) {
          this.menua[index].children.push({
            title: menuList.caption,
            link: menuList.relativePath,
            data: {
              breadCrumb: `${moduleData.displayName}/${menuList.caption}`,
              moduleSsoUrl:menuList.moduleSsoUrl,
              moduleCode: menuList.moduleCode
            },
          });
        }
      }
      });

      localStorage.setItem('permissions', JSON.stringify(this.returnPermissions(this.menu, {})));


    });
  }
  getMenuTitle(title) {
    this.pageTitle = title;
  }

  setTitle(title) {
    this.commonHelper.setPageTitle(title);
    return false;
  }

  returnPermissions(menu, permissionObj) {
    for (var i = 0; i < menu.length; i++) {
      if (menu[i].menuBeanList) {
        for (var j = 0; j < menu[i].menuBeanList.length; j++) {
          if (menu[i].menuBeanList[j].permissionCodeList) {
            permissionObj['' + menu[i].menuBeanList[j].menuCode] = menu[i].menuBeanList[j].permissionCodeList;
          } else if (menu[i].menuBeanList[j].childMenuBean) {

            this.returnPermissions(menu[i].menuBeanList[j].childMenuBean, permissionObj);
          }
        }
      } else {
        for (var k = 0; k < menu.length; k++) {
          if (menu[k].permissionCodeList) {
            permissionObj['' + menu[k].menuCode] = menu[k].permissionCodeList;
          } else if (menu[k].childMenuBean) {
            this.returnPermissions(menu[k].childMenuBean, permissionObj);
          }
        }
      }
    }

    return permissionObj;
  }
}

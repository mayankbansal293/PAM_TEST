import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonHelperService } from '../../../services/common-helper.service';
import { Router } from '@angular/router';
import { IframeUrlService } from '../../../../services/iframeUrlService';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() setIframe = new EventEmitter();
  showIFrame = false;
  showMenu = false;
  menu = [];
  username
  url = '';
  serviceData;
  selectedIndex = -1;
  @Output() menuData = new EventEmitter()
  licenceData: any;
  licenseStatus = false;
  balance: any;
  creditLimit: any;
  balanceStatus = false;
  siteLogo;
  infinityLogo = ''
  marqueeDate;
  poweredByLogo;
  marqueeMsg = '';
  bgColor = '#910000';
  color = '#ffffff';
  licenseDate;
  orgTypeCode = localStorage.getItem('orgTypeCode');
  constructor(private commonHelper: CommonHelperService, private router: Router,
    private iframeService: IframeUrlService) {
    this.commonHelper.siteLogo.subscribe(res => {
      this.siteLogo = res;
    })
    this.commonHelper.infinityLogo.subscribe(res => {
      this.infinityLogo = res;
    });
    this.commonHelper.poweredByLogo.subscribe(res => {
      this.poweredByLogo = res;
    })
    this.commonHelper.currentUserName.subscribe(res => {
      this.username = res;
    })
    this.iframeService.indexValue.subscribe(res => {
      this.selectedIndex = res;
    })
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
  ngDoCheck() {
    this.commonHelper.setUserName(this.username)
  }
  ngOnInit() {
    let requestData = {
      token: localStorage.getItem('authToken')
    }
    const data = {
      token: localStorage.getItem('authToken'),
      userId: localStorage.getItem('userId'),
      appType: 'Web_Panel',
      engineCode: 'PAM',
      languageCode: localStorage.getItem('lang')
    };

    // this.commonHelper.getLoginData(requestData).subscribe(res => {
    //   if (res.statusCode == 0) {
    //     localStorage.setItem('domainId', res.data.domainId)
    //     localStorage.setItem('accessSelfDomainOnly', res.data.accessSelfDomainOnly)
    //     localStorage.setItem('username', res.data.username)
    //     localStorage.setItem('orgTypeCode', res.data.orgTypeCode)
    //     localStorage.setItem('orgId', res.data.orgId)
    //     localStorage.setItem('commMerchantId', res.data.commMerchantId)
    //     localStorage.setItem('cashierMerchantId', res.data.cashierMerchantId)
    //     localStorage.setItem('bonusMerchantId', res.data.bonusMerchantId)
    //     localStorage.setItem('rgMerchantId', res.data.rgMerchantId)
    //     localStorage.setItem('reportingMerchantId', res.data.reportingMerchantId)
    //     localStorage.setItem('ramMerchantId', res.data.ramMerchantId);
    //     localStorage.setItem("domainName", res.data.domainName)


    //     this.username = localStorage.getItem('username');
    //     this.marqueeMsg = res.data.subsriptionMsg ? res.data.subsriptionMsg : 'Welcome ' + localStorage.getItem('username');
    //     this.bgColor = res.data.subscriptionBgColor ? res.data.subscriptionBgColor : '#910000';
    //     this.color = res.data.subsriptionMsgColor ? res.data.subsriptionMsgColor : '#ffffff';
    //     this.commonHelper.setUserName(this.username)
    //     this.orgTypeCode = localStorage.getItem('orgTypeCode')
    //   }
    // })


    this.commonHelper.getEngineServices({ token: localStorage.getItem('authToken') }).subscribe(res => {
      if (res.statusCode == 727 || res.statusCode == 725) {
        this.router.navigate(['/backoffice/unauthorized'])
        this.commonHelper.changeMessage(res.message);
        return
      } else {
        if (res.statusCode == 0) {
          this.serviceData = res.data;
        }
        this.commonHelper.getMenuList(data).subscribe(res => {
          if (res.statusCode == 0) {
            this.menu = res.moduleBeanLst;
            let menuData = [];
            menuData.push({ relativePath: '/backoffice/change_password', caption: [this.commonHelper.getCustomMessages('changePwd')] });
            for (let moduleData of this.menu) {
              for (let menuList of moduleData.menuBeanList) {
                if (menuList.relativePath) {
                  menuData.push({ relativePath: '/backoffice/' + menuList.relativePath, caption: [moduleData.displayName, menuList.caption] });
                }
                if (menuList.childMenuBean) {
                  for (let childMenu of menuList.childMenuBean) {
                    menuData.push({ relativePath: '/backoffice/' + childMenu.relativePath, caption: [moduleData.displayName, menuList.caption, childMenu.caption] });
                  }
                }
              }
            }
            
            this.commonHelper.setMenuArray(menuData);
            this.commonHelper.currentURl(this.router.url)
            this.menuData.emit(this.menu)
            localStorage.setItem('permissions', JSON.stringify(this.returnPermissions(this.menu, {})));
          } else if (res.statusCode == 9999) {
            this.commonHelper.changeMessage(res.message);
            this.router.navigate(['/backoffice/unauthorized'])
          }
          else {
            this.commonHelper.changeMessage(this.commonHelper.getCustomMessages('noPrivilegeAssign'));
            this.router.navigate(['/backoffice/unauthorized'])
          }
        });
      }
    })
    $('.hamburger-nav-wrap').on('click', function(){$('body').toggleClass('nav-collapse')})    

  }

  ngOnDestroy() {

  }

  getEngines(engine, engineUrl) {
    localStorage.setItem('serviceCode', engine)
    if (!(engine === 'HOME')) {
      this.iframeService.changeUrl(engineUrl)
      this.setIframe.emit(false)
    } else {
      this.setIframe.emit(true)
      this.commonHelper.setPageTitle('');
    }
  }

  setMarginLeft(img) {
    return img.style.marginLeft = this.siteLogo.imgWidth
  }

  logout() {
    this.commonHelper.logOut({ token: localStorage.getItem('authToken') }).subscribe(res => {
      let lang = localStorage.getItem('lang')
      localStorage.clear();
      localStorage.setItem('lang', lang)
      this.router.navigate(['signin']);
    })
  }

  setIndex(index) {
    this.selectedIndex = index;
  }

  setTitle(title) {
    this.commonHelper.setPageTitle(title);
  }
  toggleNav(){
    console.log("Hamburger Clicked")
  }

}



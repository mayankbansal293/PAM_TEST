import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonHelperService } from '../../../services/common-helper.service';

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  marqueeMsg = "";

  themes = [
    {
      value: "default",
      name: "Light",
    },
    {
      value: "dark",
      name: "Dark",
    },
    {
      value: "cosmic",
      name: "Cosmic",
    },
    {
      value: "corporate",
      name: "Corporate",
    },
  ];

  currentTheme = "default";

  userMenu = [{ title: "Profile" }, { title: "Log out" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private commonHelper: CommonHelperService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    let requestData = {
      token: localStorage.getItem("authToken"),
    };
 
    this.commonHelper.getLoginData(requestData).subscribe(res => {
      if (res.statusCode == 0) {
        localStorage.setItem('domainId', res.data.domainId)
        localStorage.setItem('accessSelfChannelOnly', res.data.accessSelfChannelOnly)
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('orgTypeCode', res.data.orgTypeCode)
        localStorage.setItem('orgId', res.data.orgId)
        localStorage.setItem('commMerchantId', res.data.commMerchantId)
        localStorage.setItem('cashierSystemId', res.data.cashierMerchantId)
        localStorage.setItem('bonusSystemId', res.data.bonusMerccashierMerchantId)
        localStorage.setItem('rgSystemId', res.data.rgMerccashierMerchantId)
        localStorage.setItem('reportingSystemId', res.data.reportingMerccashierMerchantId)
        localStorage.setItem('ramSystemId', res.data.ramMerccashierMerchantId);
        localStorage.setItem("channelName", res.data.channelName)
        localStorage.setItem("username", res.data.username);

        this.marqueeMsg = res.data.subsriptionMsg
          ? res.data.subsriptionMsg
          : "Welcome " + localStorage.getItem("username");
      }
    })
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users.nick));

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}

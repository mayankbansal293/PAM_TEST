import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ISubscription } from "rxjs/Subscription";
import { CommonHelperService } from '../../services/common-helper.service';
import { IframeUrlService } from '../../services/iframeUrlService';
declare var $: any;
@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit {
  url = "";
  navigationSubscription;
  engineUrl
  windowHeight;
  moduleCode = localStorage.getItem('moduleCode');
  serviceCode = localStorage.getItem('serviceCode');
  urlSubscription: ISubscription;
  moduleSubscription: ISubscription;
  engineSubscription: ISubscription;
  constructor(private commonHelper: CommonHelperService, private router: Router,
    private urlService: IframeUrlService, public sanitizer: DomSanitizer) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.id == 1) {
        this.router.navigate(['pages/home'])
      }
    });
    document.body.style.overflow = 'hidden';
  }

  ngOnInit() {
    // this.reportWindowSize();

    // window.onload = this.reportWindowSize
    // window.onresize = this.reportWindowSize
    const data = {
      token: localStorage.getItem('authToken'),
      domain: '',
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('username'),
      userType: localStorage.getItem('orgTypeCode'),
      lang: localStorage.getItem('lang') || 'en',
      orgId: localStorage.getItem('orgId'),
      merchantId: '',
      domainId: localStorage.getItem('domainId'),
      domainName: ''
    }
    if(data['userType'] === 'SUPER_BO') data['domainName'] = "ALL";
    else data['domainName'] = localStorage.getItem('domainName');

    if(this.moduleCode == 'BONUS') {
      data.merchantId = localStorage.getItem('bonusMerchantId');
    } else if(this.moduleCode == 'CASHIER') {
      data.merchantId = localStorage.getItem('cashierMerchantId');
    } else if(this.moduleCode == 'COMM') {
      data.merchantId = localStorage.getItem('commMerchantId');
    } else if(this.moduleCode == 'RG') {
      data.merchantId = localStorage.getItem('rgMerchantId');
    } else if(this.moduleCode == 'REPORTING') {
      data.merchantId = localStorage.getItem('reportingMerchantId');
    } else if(this.moduleCode == 'RAM') {
      data.merchantId = localStorage.getItem('ramMerchantId');
    } else {
      data.merchantId = undefined;
    }
    
    this.urlSubscription = this.urlService.currentUrl.subscribe(url => {
        this.engineUrl = url
        data.domain = this.engineUrl;
        if(!this.serviceCode || this.serviceCode == 'HOME') {
          this.moduleSubscription = this.commonHelper.getEngineUrlForModules(data).subscribe(res => {
            this.url = res.data.url;
          });
        } else { 
          if(localStorage.getItem('serviceCode')=='SLE'){
            this.commonHelper.makeRequest({token:localStorage.getItem('authToken')},'getSessionId',false).subscribe(res=>{
              this.sanitizer.bypassSecurityTrustResourceUrl(this.url=`${this.engineUrl}?userType=BO&userName=${localStorage.getItem('username')}&merCode=NEWRMS&sessId= ${res.data}&domainName= ${data.domainName}`)
            })
          } else if(localStorage.getItem('serviceCode')=='DGE' || localStorage.getItem('serviceCode')=='IGE' || localStorage.getItem('serviceCode')=='PPL' || localStorage.getItem('serviceCode')=='JPT') {
            this.commonHelper.getEngineUrlForDGE(data).subscribe(res=>{
              this.url=res.data.url;
            })
          } else if(localStorage.getItem('serviceCode')=='SBS' || localStorage.getItem('serviceCode')=='VSE' || localStorage.getItem('serviceCode')=='SPE'){
            this.commonHelper.makeRequest({token:localStorage.getItem('authToken')},'getSessionId',false).subscribe(res=>{
              this.sanitizer.bypassSecurityTrustResourceUrl(this.url=`${this.engineUrl}/sport/dashboard/${localStorage.getItem('username')}/BO/en/${res.data}/${localStorage.getItem('userId')}/${data.domainName}`)
          })
        // }else if(localStorage.getItem('serviceCode')=='VSE'){
        //   this.commonHelper.makeRequest({token:localStorage.getItem('authToken')},'getSessionId',false).subscribe(res=>{
        //     this.sanitizer.bypassSecurityTrustResourceUrl(this.url=`${this.engineUrl}/sport/dashboard/${localStorage.getItem('username')}/BO/en/${res.data}/${localStorage.getItem('userId')}`)
        //   })
        // }
        // else if(localStorage.getItem('serviceCode')=='SPE'){
        //   this.commonHelper.makeRequest({token:localStorage.getItem('authToken')},'getSessionId',false).subscribe(res=>{
        //     this.sanitizer.bypassSecurityTrustResourceUrl(this.url=`${this.engineUrl}/sport/dashboard/${localStorage.getItem('username')}/BO/en/${res.data}/${localStorage.getItem('userId')}`)
        //   })
        }
        }
    })

  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.urlSubscription) {
      this.urlSubscription.unsubscribe();
    }
    if(this.moduleSubscription) {
      this.moduleSubscription.unsubscribe();
    }
    if(this.engineSubscription) {
      this.engineSubscription.unsubscribe();
    }
    document.body.style.overflow = "";
  }

  reportWindowSize() {
    let offset;
    if(!this.serviceCode || this.serviceCode == 'HOME') {
      offset = 30;
    } else {
      offset = 4;
    }
    if(document.getElementsByClassName('headerWrapper').length)
      this.windowHeight = (window.innerHeight - document.getElementsByClassName('headerWrapper')[0].scrollHeight - offset);
    $('#wlframe').css('height', this.windowHeight + 'px');
  }

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    if(event.data == 'logout') {
      let lang = localStorage.getItem('lang')
      localStorage.clear();
      localStorage.setItem('lang', lang)
      this.router.navigate(['signin']);
    }
  }
}

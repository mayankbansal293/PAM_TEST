import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CommonHelperService } from './common-helper.service';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  @BlockUI() blockUI: NgBlockUI;

  constructor(private router: Router, private commonHelper: CommonHelperService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.blockUI.start("Loading...");
    return next.handle(req)
      .pipe(
        tap(event => {
          this.blockUI.stop();
          if (event instanceof HttpResponse && event.body.statusCode== 9999) {
            const lang = localStorage.getItem('lang')|| 'en';
            localStorage.clear();
            localStorage.setItem('lang', lang)
            this.commonHelper.changeMessage(event.body.message);
            this.router.navigate(['/backoffice/unauthorized']);
            return;
          }
          if (event instanceof HttpResponse && event.body) {
            if (event.body.statusCode == 105 || event.body.statusCode == 102) {
              const lang = localStorage.getItem('lang')|| 'en';
              localStorage.clear();
              this.commonHelper.setPageTitle('')
              localStorage.setItem('lang', lang)
              this.router.navigate(['signin']);
            }
          }
        }, error => {
          const lang = localStorage.getItem('lang') || 'en';
          localStorage.clear();
          localStorage.setItem('lang', lang)
          this.commonHelper.changeMessage('No Internet Connection');
          this.router.navigate(['signin']);
          this.blockUI.stop();
        })
      );
  }
}

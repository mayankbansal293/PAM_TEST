import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
// import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { CommonHelperService } from './common-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // @BlockUI() blockUI: NgBlockUI;
  constructor(private route: Router,private commonHelper:CommonHelperService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // this.blockUI.stop();
    if (this.isLoggedIn() && this.isExpired()) {
      return true;
    } else {
      this.route.navigate(['/signin']);
      return false;
    }
  }
  isLoggedIn() {
    return localStorage.getItem('authToken') ? true : false;
  }
  isExpired() {
    if (localStorage.getItem('passwordExpired')=='false'){
      return true;
    } else {
      return false;
    }
  }
}

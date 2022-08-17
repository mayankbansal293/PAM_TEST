import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IframeUrlService {

    private getEngineUrl = new BehaviorSubject('');
    currentUrl = this.getEngineUrl.asObservable();
    private menu = new BehaviorSubject(true);
    showMenu = this.menu.asObservable();
    private index = new BehaviorSubject(-1);
    indexValue = this.index.asObservable();
    changeUrl(url: string) {
      this.getEngineUrl.next(url)
    }

     showMenuFromPasswordPage(){
       this.menu.next(true)
    } 

     setIndex(){
       this.index.next(-1);
     }
}

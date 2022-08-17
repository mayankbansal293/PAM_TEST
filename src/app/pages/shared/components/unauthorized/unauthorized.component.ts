import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonHelperService } from '../../../../services/common-helper.service';
// import { CommonHelperService } from '../../../../services/common-helper.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {
  message = "";
  constructor(private router: Router, private commonHelper: CommonHelperService) {
    this.commonHelper.currentMessage.subscribe(res => {
      this.message = res;
    })
  }

  ngOnInit() {
    if (localStorage.getItem('orgTypeCode') && localStorage.getItem('orgTypeCode') != 'RET') {
      this.router.navigate(['/backoffice'])
    }
  }

}

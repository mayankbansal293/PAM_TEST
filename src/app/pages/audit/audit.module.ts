import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileNumberComponent } from './mobile-number/mobile-number.component';
import { AuditRoutingModule } from './audit-routing.miodule';
// import {SharedModule} from 'src/app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import {SelectDropDownModule} from 'ngx-select-dropdown';
// import {AppTranslationModule} from 'src/app/app-translation.module';
// import {DataTableModule} from 'angular-6-datatable';
import { EmailChangeReportComponent } from './email-change-report/email-change-report.component';
import { RsaIdChangeReportComponent } from './rsa-id-change-report/rsa-id-change-report.component';
import { UserUpdateReportComponent } from './user-update-report/user-update-report.component';
import { SharedModule } from '../shared/shared.module';
import { AppTranslationModule } from '../../app-translation.module';

@NgModule({
  declarations: [MobileNumberComponent, EmailChangeReportComponent, RsaIdChangeReportComponent, UserUpdateReportComponent],
  imports: [
    CommonModule,
    AuditRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    // NgbModule,
    // SelectDropDownModule,
    AppTranslationModule,
    // DataTableModule
  ]
})
export class AuditModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EmailChangeReportComponent} from './email-change-report/email-change-report.component';
import { MobileNumberComponent } from './mobile-number/mobile-number.component';
import {RsaIdChangeReportComponent} from './rsa-id-change-report/rsa-id-change-report.component';
import { UserUpdateReportComponent } from './user-update-report/user-update-report.component';

const routes: Routes = [
    { path: 'mobile_change_report', component: MobileNumberComponent },
    {path: 'email_change_report', component: EmailChangeReportComponent},
    {path: 'rsa_id_change_report', component: RsaIdChangeReportComponent},
    {path: 'user_update_report', component: UserUpdateReportComponent},
];

@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class AuditRoutingModule { }

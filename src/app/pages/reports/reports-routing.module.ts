import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivilegeReportComponent } from './privilege-report/privilege-report.component';

const routes: Routes = [
  { path : 'privilege_report', component : PrivilegeReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }

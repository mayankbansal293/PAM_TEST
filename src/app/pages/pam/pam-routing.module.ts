import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PamComponent } from './pam.component';
import { IframeComponent } from '../iframe/iframe.component';
import { PasswordComponent } from '../shared/components/password/password.component';
import { UnauthorizedComponent } from '../shared/components/unauthorized/unauthorized.component';
import { HomeComponent } from '../home/home.component';
import { AuthGuard } from '../../services/auth.guard';

const routes: Routes = [
  {
    path: '', component: PamComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomeComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: 'PPL', component: IframeComponent },
      { path: 'DGE', component: IframeComponent },
      { path: 'IGE', component: IframeComponent },
      { path: 'SBS', component: IframeComponent },
      { path: 'SLE', component: IframeComponent },
      { path: 'VSE', component: IframeComponent },
      { path: 'SPE', component: IframeComponent },
      { path: 'iframe', component: IframeComponent },
      { path: 'change_password', component: PasswordComponent, canActivate: [AuthGuard] },
      { path: 'domain', loadChildren: './org-mgmt/domain-mgmt.module#DomainMgmtModule', canActivate: [AuthGuard] },
      { path: 'roles', loadChildren: './roles/roles.module#RolesModule', canActivate: [AuthGuard] },
      { path: 'reports', loadChildren: './reports/reports.module#ReportsModule', canActivate: [AuthGuard] },
      { path: 'audit', loadChildren: './audit/audit.module#AuditModule',canActivate: [AuthGuard] }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RMSRoutingModule { }
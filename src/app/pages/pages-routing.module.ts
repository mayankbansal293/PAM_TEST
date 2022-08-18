import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PamComponent } from './pam.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { IframeComponent } from './iframe/iframe.component';
import { PasswordComponent } from './shared/components/password/password.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {
    path: '', component: PamComponent,
    children: [
      // { path: '', pathMatch: 'full', redirectTo: 'home' },
      // { path: 'home', component: HomeComponent },
      // { path: 'unauthorized', component: UnauthorizedComponent },
      // { path: 'PPL', component: IframeComponent },
      // { path: 'DGE', component: IframeComponent },
      // { path: 'IGE', component: IframeComponent },
      // { path: 'SBS', component: IframeComponent },
      // { path: 'SLE', component: IframeComponent },
      // { path: 'VSE', component: IframeComponent },
      // { path: 'SPE', component: IframeComponent },
      { path: 'iframe', component: IframeComponent },
      // { path: 'change_password', component: PasswordComponent, canActivate: [AuthGuard] },
      { path: 'domain', loadChildren: () =>
      import("./org-mgmt/domain-mgmt.module").then(
        (m) => m.DomainMgmtModule
      ) },
      // { path: 'roles', loadChildren: () =>
      // import("./roles/roles.module").then(
      //   (m) => m.RolesModule
      // ), canActivate: [AuthGuard] },
      // { path: 'reports', loadChildren: () =>
      // import("./reports/reports.module").then(
      //   (m) => m.ReportsModule
      // ), canActivate: [AuthGuard] },
      // { path: 'audit',loadChildren: () =>
      // import("./audit/audit.module").then(
      //   (m) => m.AuditModule
      // ),canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

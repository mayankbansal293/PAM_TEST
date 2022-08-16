import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagePermissionComponent } from './manage-permission/manage-permission.component';
import { ManageModulesComponent } from './manage-modules/manage-modules.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { ManageConfigComponent } from './manage-config/manage-config.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { ManageHeadRolesComponent } from './manage-head-roles/manage-head-roles.component';
import { CurrencyConversionComponent } from './currency-conversion/currency-conversion.component';


const routes: Routes = [
  { path: 'manage_permission', component: ManagePermissionComponent },
  { path: 'manage_module', component: ManageModulesComponent },
  { path: 'manage_menu', component: ManageMenuComponent },
  { path: 'manage_config', component: ManageConfigComponent },
  { path: 'create_role', component: CreateRoleComponent },
  { path: 'edit_role', component: EditRoleComponent },
  { path: 'manage_head_role', component: ManageHeadRolesComponent },
  { path: 'currency_conversion', component: CurrencyConversionComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
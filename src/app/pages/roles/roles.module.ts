// import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles-routing.module';
// import { DataTableModule } from 'angular-6-datatable';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { SharedModule } from 'src/app/shared/shared.module';
// import { AppTranslationModule } from 'src/app/app-translation.module';

import { AddPermissionsModalComponent } from './add-permissions-modal/add-permissions-modal.component';
import { ManagePermissionComponent } from './manage-permission/manage-permission.component';
import { ManageModulesComponent } from './manage-modules/manage-modules.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModulesModalComponent } from './modules-modal/modules-modal.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { ManageHeadRolesComponent } from './manage-head-roles/manage-head-roles.component';
import { ManageConfigComponent } from './manage-config/manage-config.component';
import { CurrencyConversionComponent } from './currency-conversion/currency-conversion.component';
import { SharedModule } from '../shared/shared.module';
import { AppTranslationModule } from '../../app-translation.module';
import { NgModule } from '@angular/core';
import { NbAccordionModule } from "@nebular/theme";
@NgModule({
  declarations: [
    ManagePermissionComponent,
    ManageModulesComponent,
    ManageMenuComponent,
    AddPermissionsModalComponent,
    ModulesModalComponent,
    EditRoleComponent,
    CreateRoleComponent,
    ManageHeadRolesComponent,
    ManageConfigComponent,
    CurrencyConversionComponent,
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    // DataTableModule,
    // NgbModule,
    AppTranslationModule,
    NbAccordionModule,
    // NgMultiSelectDropDownModule
  ],
  entryComponents: [AddPermissionsModalComponent, ModulesModalComponent],
})
export class RolesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainMgmtRoutingModule } from './domain-routing.module';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { AppTranslationModule } from 'src/app/app-translation.module';
// import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchDomainComponent } from './search-domain/search-domain.component';
// import { DataTableModule } from 'angular-6-datatable';
import { EditDomainComponent } from './search-domain/edit-domain/edit-domain.component';
// import { CsvModule } from '@ctrl/ngx-csv';
// import { UserRegComponent } from './user-reg/user-reg.component';
// import { SearchUserComponent } from './search-user/search-user.component';
// import { ViewUserDetailsComponent } from './search-user/view-user-details/view-user-details.component';
// import { UserDetailsModalComponent } from './search-user/user-details-modal/user-details-modal.component';
// import { DomainRegComponent } from './domain-reg/domain-reg.component';
import { UpdateSearchDomainModalComponent } from './search-domain/update-search-domain-modal/update-search-domain-modal.component';
// import { UserAccessModalComponent } from './search-user/user-access-modal/user-access-modal.component';
// import { SearchAliasComponent } from './search-alias/search-alias.component';
// import { UpdateSearchAliasModalComponent } from './search-alias/update-search-alias-modal/update-search-alias-modal.component';
import { AppTranslationModule } from '../../app-translation.module';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from '../../@theme/theme.module';
import { NbButtonModule, NbCardModule, NbInputModule } from '@nebular/theme';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    // DomainRegComponent ,
    SearchDomainComponent,
    // EditDomainComponent,
    // UserRegComponent,
    // SearchUserComponent,
    // ViewUserDetailsComponent,
    // UserDetailsModalComponent,
    UpdateSearchDomainModalComponent,
    // UserAccessModalComponent,
    // SearchAliasComponent,
    // UpdateSearchAliasModalComponent
   ],
  imports: [
    CommonModule,
    DomainMgmtRoutingModule,
    // NgbModule,
    AppTranslationModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    // DataTableModule,
    // CsvModule,
    // NgMultiSelectDropDownModule
  ],
  entryComponents:[
    // UserAccessModalComponent,
    // UserDetailsModalComponent,
    // UpdateSearchAliasModalComponent,
    // UpdateSearchDomainModalComponent
  ]
})
export class DomainMgmtModule { }

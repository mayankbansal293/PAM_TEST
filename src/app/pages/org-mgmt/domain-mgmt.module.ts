import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelRoutingModule } from './domain-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from '../../@theme/theme.module';
import { NbButtonModule, NbCardModule, NbInputModule } from '@nebular/theme';
import { ChannelRegComponent } from './channel-reg/channel-reg.component';
import { SearchChannelComponent } from './search-channel/search-channel.component';
import { EditChannelComponent } from './search-channel/edit-channel/edit-channel.component';
import { UserRegComponent } from './user-reg/user-reg.component';
import { SearchUserComponent } from './search-user/search-user.component';
import { ViewUserDetailsComponent } from './search-user/view-user-details/view-user-details.component';
import { UserDetailsModalComponent } from './search-user/user-details-modal/user-details-modal.component';
import { UpdateSearchChannelModalComponent } from './search-channel/update-search-channel-modal/update-search-channel-modal.component';
import { UserAccessModalComponent } from './search-user/user-access-modal/user-access-modal.component';
import { SearchAliasComponent } from './search-alias/search-alias.component';
import { UpdateSearchAliasModalComponent } from './search-alias/update-search-alias-modal/update-search-alias-modal.component';
import { AppTranslationModule } from '../../app-translation.module';


@NgModule({
  declarations: [
    ChannelRegComponent,
    SearchChannelComponent,
    EditChannelComponent,
    UserRegComponent,
    SearchUserComponent,
    ViewUserDetailsComponent,
    UserDetailsModalComponent,
    UpdateSearchChannelModalComponent,
    UserAccessModalComponent,
    SearchAliasComponent,
    UpdateSearchAliasModalComponent
   ],
  imports: [
    CommonModule,
    ChannelRoutingModule,
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
    UserAccessModalComponent,
    UserDetailsModalComponent,
    UpdateSearchAliasModalComponent,
    UpdateSearchChannelModalComponent
  ]
})
export class DomainMgmtModule { }

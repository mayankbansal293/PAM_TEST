import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelRegComponent } from './channel-reg/channel-reg.component';
import { SearchAliasComponent } from './search-alias/search-alias.component';
import { SearchChannelComponent } from './search-channel/search-channel.component';
import { SearchUserComponent } from './search-user/search-user.component';
import { UserRegComponent } from './user-reg/user-reg.component';

const routes: Routes = [
  { path: 'create_domain', component: ChannelRegComponent },
  { path: 'search_channel', component: SearchChannelComponent },
  { path: 'alias_management', component: SearchAliasComponent },
  { path: 'create_user', component: UserRegComponent },
  { path: 'search_user', component: SearchUserComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelRoutingModule { }

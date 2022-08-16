import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchDomainComponent } from './search-domain/search-domain.component';
// import { UserRegComponent } from './user-reg/user-reg.component';
// import { SearchUserComponent } from './search-user/search-user.component';
// import { SearchAliasComponent } from './search-alias/search-alias.component';
// import { DomainRegComponent } from './domain-reg/domain-reg.component';

const routes: Routes = [
  // { path:'create_domain' , component : DomainRegComponent},
  { path:'search_domain' ,component : SearchDomainComponent},
  // { path: 'alias_management' , component : SearchAliasComponent },
  // { path: 'create_user' , component :  UserRegComponent},
  // { path: 'search_user' , component : SearchUserComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomainMgmtRoutingModule { }

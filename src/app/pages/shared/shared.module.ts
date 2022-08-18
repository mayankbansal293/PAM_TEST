import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaCardComponent } from './components/ba-card/ba-card.component';
// import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
// import { AppTranslationModule } from '../../app-translation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TitlePageComponent } from './components/title-page/title-page.component';
import { RouterModule } from '@angular/router';
import { PasswordComponent } from './components/password/password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
// import { DataTableModule } from 'angular-6-datatable';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
// import { SelectDropDownModule } from 'ngx-select-dropdown';
// import { BlockUIModule } from 'ng-block-ui';
import { SafePipe } from './pipes/safe.pipe';
import { AccordianComponent } from './components/accordian/accordian.component';
import { CountryStateCityFormComponent } from './components/country-state-city-form/country-state-city-form.component';
import { PermissionPipePipe } from './pipes/permission-pipe';
import { SearchUserPipe } from './pipes/search-user-pipe.pipe';
import { InitDirectiveDirective } from './directives/init-directive.directive';
import { TrimOnBlurDirective } from './directives/trim-on-blur.directive';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { SearchDomainPipe } from './pipes/search-domain-pipe.pipe';
import { NoSpaceDirective } from './directives/no-space.directive';
import { UserMenuPrivilegesComponent } from './user-menu-privileges/user-menu-privileges.component';
import { CharacterOnlyDirective } from './directives/character-only.directive';
import { AppTranslationModule } from '../../app-translation.module';
// import { NgxCaptchaModule } from 'ngx-captcha';
import { ThemeModule } from '../../@theme/theme.module';
import { NbButtonModule, NbCardModule, NbInputModule, NbLayoutModule } from '@nebular/theme';
import { TableModule } from '../table/table.module';
// import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [
    UnauthorizedComponent, 
    BaCardComponent, 
    TitlePageComponent, 
    PasswordComponent, 
    UnauthorizedComponent,
    ForgotPasswordComponent,
    SafePipe,AccordianComponent,
    CountryStateCityFormComponent,
    SearchDomainPipe,
    SearchUserPipe, 
    PermissionPipePipe,
    InitDirectiveDirective,
    TrimOnBlurDirective,
    NumberOnlyDirective,
    NoSpaceDirective,
    UserMenuPrivilegesComponent,
    CharacterOnlyDirective,
    UserMenuPrivilegesComponent,
  ],
  imports: [
    CommonModule,
    // NgbModule,
    AppTranslationModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    // DataTableModule,
    // SelectDropDownModule,
    // BlockUIModule.forRoot(),
    // NgxCaptchaModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbLayoutModule,
    TableModule
  ],
  exports: [
    UnauthorizedComponent, 
    BaCardComponent, 
    PasswordComponent, 
    TitlePageComponent,
    ForgotPasswordComponent,
    SafePipe,AccordianComponent,
    CountryStateCityFormComponent,
    SearchDomainPipe,
    SearchUserPipe,
    PermissionPipePipe,
    InitDirectiveDirective,
    TrimOnBlurDirective,
    NumberOnlyDirective,
    NoSpaceDirective,
    CharacterOnlyDirective,
    // SelectDropDownModule,
    UserMenuPrivilegesComponent,
    CharacterOnlyDirective,
    TableModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule { }

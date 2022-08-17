/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
 import { ReactiveFormsModule, FormsModule } from "@angular/forms";

 import { BrowserModule } from "@angular/platform-browser";
 import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
 import { NgModule } from "@angular/core";
 import { HttpClientModule } from "@angular/common/http";
 import { CoreModule } from "./@core/core.module";
 import { ThemeModule } from "./@theme/theme.module";
 import { AppComponent } from "./app.component";
 import { AppRoutingModule } from "./app-routing.module";
 import { AppTranslationModule } from "./app-translation.module";

 import {
   NbAlertModule,
   NbButtonModule,
   NbCardModule,
   NbChatModule,
   NbCheckboxModule,
   NbDatepickerModule,
   NbDialogModule,
   NbInputModule,
   NbLayoutModule,
   NbMenuModule,
   NbSidebarModule,
   NbToastrModule,
   NbWindowModule,
 } from "@nebular/theme";
import { SharedModule } from "./pages/shared/shared.module";
import { LoginComponent } from "./pages/shared/components/login/login.component";
// import { NgxCaptchaModule } from "ngx-captcha";

 @NgModule({
   declarations: [AppComponent, LoginComponent],
   imports: [
     ReactiveFormsModule,
     FormsModule,
     BrowserModule,
     BrowserAnimationsModule,
     HttpClientModule,
     AppRoutingModule,
     AppTranslationModule,
     NbSidebarModule.forRoot(),
     NbMenuModule.forRoot(),
     NbDatepickerModule.forRoot(),
     NbDialogModule.forRoot(),
     NbWindowModule.forRoot(),
     NbToastrModule.forRoot(),
     SharedModule,
    //  NbChatModule.forRoot({
    //    messageGoogleMapKey: "AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY",
    //  }),
     CoreModule.forRoot(),
     ThemeModule.forRoot(),
    // NgxCaptchaModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,

    NbLayoutModule,
    NbCardModule,
    NbCheckboxModule,
    NbAlertModule,

   ],
   bootstrap: [AppComponent],
 })
 export class AppModule {}

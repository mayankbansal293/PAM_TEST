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
   NbChatModule,
   NbDatepickerModule,
   NbDialogModule,
   NbMenuModule,
   NbSidebarModule,
   NbToastrModule,
   NbWindowModule,
 } from "@nebular/theme";
import { SharedModule } from "./pages/shared/shared.module";
import { LoginComponent } from "./pages/shared/components/login/login.component";

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
   ],
   bootstrap: [AppComponent],
 })
 export class AppModule {}

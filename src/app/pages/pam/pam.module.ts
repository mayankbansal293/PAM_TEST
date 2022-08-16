import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PamComponent } from './pam.component';
import { RMSRoutingModule } from './pam-routing.module';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { IframeComponent } from '../iframe/iframe.component';

import { DataTableModule } from "angular-6-datatable";
import { AppTranslationModule } from '../app-translation.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { FormsModule } from '@angular/forms';
import { DateParserFormatter } from '../shared/date-parser-formatter';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BlockUIModule } from 'ng-block-ui';
import { HomeComponent } from '../home/home.component';

@NgModule({
  declarations: [PamComponent, HeaderComponent, IframeComponent, HomeComponent],
  imports: [
    CommonModule, RMSRoutingModule, SharedModule,
    DataTableModule, AppTranslationModule, ReactiveFormsModule,
    NgbModule,
    CsvModule,
    FormsModule,
    AngularMultiSelectModule,
    BlockUIModule.forRoot()
  ],
  // providers: [{ provide: NgbDateParserFormatter, useClass: DateParserFormatter }]
})
export class PAMModule { }

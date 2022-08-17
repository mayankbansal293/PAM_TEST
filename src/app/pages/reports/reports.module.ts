import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
// import { DataTableModule } from 'angular-6-datatable';
// import { CsvModule } from '@ctrl/ngx-csv';
// import { AppTranslationModule } from 'src/app/app-translation.module';
import { ReportsRoutingModule } from './reports-routing.module';
// import { NgxBarcodeModule } from 'ngx-barcode';
import { PrivilegeReportComponent } from './privilege-report/privilege-report.component';
import { SharedModule } from '../shared/shared.module';
import { AppTranslationModule } from '../../app-translation.module';

@NgModule({
  declarations: [PrivilegeReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    // NgbModule,
    // DataTableModule,
    // CsvModule,
    AppTranslationModule,
    // NgxBarcodeModule,
  ]
})
export class ReportsModule { }

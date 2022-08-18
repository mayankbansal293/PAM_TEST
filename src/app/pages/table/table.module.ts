import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TablesComponent } from "./tables/tables.component";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NbCardModule } from "@nebular/theme";
import { AppTranslationModule } from "../../app-translation.module";

@NgModule({
  declarations: [TablesComponent],
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, NbCardModule, AppTranslationModule],
  exports: [TablesComponent],
})
export class TableModule {}

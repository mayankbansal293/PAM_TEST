import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { sortBy, orderBy, cloneDeep } from "lodash";
import { TableModel } from "./../decorators/table.model";
import { ColumnModel } from "./../decorators/column.model";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort, SortDirection } from "@angular/material/sort";

import { MatTableDataSource } from "@angular/material/table";
@Component({
  selector: "ngx-table",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.scss"],
})
export class TablesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() data = [];
  private _originalData: any[] = [];
  private _tableModel: TableModel;

  @Input() instance: any;

  // @Input() displayedColumns: string[];
  @Input()  displayedColumns = [];
  public columnNames: any[] = [];
  dataSource;
  constructor() {}

  ngOnInit() {
    console.log(this.data)
    for (const column of this.displayedColumns) {
      this.columnNames.push(column.key);
    }
  }

  ngDoCheck() {
  this.dataSource = new MatTableDataSource<any>(this.data);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
    this.dataSource.sort = this.sort;

  }
  sortData(params: Sort) {
    const direction: SortDirection = params.direction;
    this.data = direction
      ? orderBy(this.data, [params.active], [direction])
      : this._originalData;
  }

  // private buildColumns() {
  //   this.columns = this._tableModel.columns;
  //   this.sortColumns();
  //   this.displayedColumns = this.columns.map((col) => col.key);
  // }

  private sortColumns() {
    this.data = sortBy(this.data, ["order"]);
  }
}

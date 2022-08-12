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

  private _data = [];
  private _originalData: any[] = [];
  // displayedColumns = [];
  private _tableModel: TableModel;

  @Input() set data(values: any[]) {
    // if (values && values.length > 0) {
    //   this._data = cloneDeep(values);
    //   this._tableModel = this._data[0];
    //   this.buildColumns();
    //   if (!this._originalData.length) {
    //     // Keep original order of data
    //     this._originalData = cloneDeep(this._data);
    //   }
    // }
  }
  get data(): any[] {
    return this._data;
  }

  @Input() instance: any;

  columns = [
    { id: 1, maker: "Chevrolet", model: "Sportvan G20", year: 1993 },
    { id: 2, maker: "Jeep", model: "Patriot", year: 2007 },
    { id: 3, maker: "Ferrari", model: "612 Scaglietti", year: 2008 },
    { id: 4, maker: "Ford", model: "Thunderbird", year: 1995 },
    { id: 5, maker: "GMC", model: "Canyon", year: 2012 },
    { id: 6, maker: "Volvo", model: "V70", year: 2009 },
    { id: 7, maker: "Suzuki", model: "Grand Vitara", year: 2010 },
    { id: 8, maker: "Ford", model: "Escort", year: 1990 },
    { id: 9, maker: "Toyota", model: "Yaris", year: 2009 },
    { id: 10, maker: "Infiniti", model: "M", year: 2003 },
  ];
  // @Input() displayedColumns: string[];
  @Input() head: string[];
  displayedColumns = [
    { key: "id", value: "ID" },
    { key: "maker", value: "MAKER OF THE CAR" },
    { key: "model", value: "VALUE OF THE CAR" },
    { key: "year", value: "YEAR OF MANUFACTURE" },
  ];
  public columnNames: any[] = [];
  dataSource = new MatTableDataSource<any>(this.columns);

  constructor() {}

  ngOnInit() {
    for (const column of this.displayedColumns) {
      this.columnNames.push(column.key);
    }
  }

  ngAfterViewInit() {
    console.log("hi i am here");
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
    this.dataSource.sort = this.sort;

    console.log(this.paginator);
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
    this.columns = sortBy(this.columns, ["order"]);
  }
}

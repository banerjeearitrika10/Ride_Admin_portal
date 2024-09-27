import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Column, ColumnAction, PageRequest } from '../../model/data.table.model';
import { EMPTY_PAGE, Page } from 'src/app/components/core/models/page';

const DEFAULT_PAGE_SIZE : number = 5;

@Component({
  selector: 'examportal-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input()
  public columns: Column<any>[] = [];

  @Input()
  public columnActions: ColumnAction<any>[] = [];
  @Input()
  public dataSourceFn$: ((pageRequest: PageRequest) => Observable<Page<any>>) = () => of(EMPTY_PAGE);

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  @Input()
  public showSearch?: boolean = false;

  @Input()
  viewRefresh?: boolean = false;

  displayedColumns: string[] = [];
  pageData: Page<any> = EMPTY_PAGE;
  resultsLength = 0;
  selected: number = 0;
  pageSizeOptions = [5, 10, 20];
  globalSearchValue: string = "";



  constructor(public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataSourceFn$({ page: 0, size: DEFAULT_PAGE_SIZE }).subscribe(data => {
      this.pageData = data
    },
      (err) => {
        this.snackBar.open(err.error.message, "", {
          duration: 2000
        });
      });
    this.displayedColumns = this.columns.map(c => c.field);
    if (this.columnActions && this.columnActions.length > 0) {
      this.displayedColumns.push("action");
    }
  }

  onPageChange(event: any) {
    this.dataSourceFn$({ page: event.pageIndex, size: event.pageSize }).subscribe(data => this.pageData = data);
  }

  sortData(sort: Sort) {

  }

  globalSearch() {
    this.dataSourceFn$({ page: 0, size: DEFAULT_PAGE_SIZE, searchKey: this.globalSearchValue }).subscribe(data => this.pageData = data);
  }

  refresh() {
    this.dataSourceFn$({ page: 0, size: DEFAULT_PAGE_SIZE }).subscribe(data => {
      this.pageData = data
    },
      (err) => {
        this.snackBar.open(err.error.message, "", {
          duration: 2000
        });
      });
  }

}

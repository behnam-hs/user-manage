import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() dataSource!: MatTableDataSource<User>;
  @Input() currentPage!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  defaultPage: number = 1;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.defaultPage = this.currentPage;
    console.log(this.defaultPage);  
    this.dataSource.paginator = this.paginator;
  }

  handlePageChanged(e: any) {
    this.router.navigate([''], {queryParams: {page: e.pageIndex + 1}})
  }

}

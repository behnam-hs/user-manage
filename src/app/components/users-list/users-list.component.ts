import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  @Input() dataSource!: MatTableDataSource<User>;
  displayedColumns: string[] = ['select', 'avatar', 'name', 'email','created_date', 'role', 'actions'];
  selection = new SelectionModel<User>(true, []);

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  toggleUserStatus(id: number) {
    this.userService.toggleUserStatus(id);
  }

  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  edit(id: number) {
    this.router.navigate([`${id}/edit`]);
  }

  remove() {
    const count = this.selection.selected.length;
    if( count ) {
      const selectedUsers = this.selection.selected;
      this.userService.batchRemove(selectedUsers);
    }

  }

}

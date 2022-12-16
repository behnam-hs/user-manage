import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Role, ROLES } from 'src/app/models/role';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input() dataSource!: MatTableDataSource<User>;
  selectedRole?: Role;
  ROLES = ROLES;
  searchQuery: string = '';

  ngOnInit() {
    this.dataSource.filterPredicate = (user: User): boolean => {
      let matched = Object.values(user)
        .some(val => 
          typeof val === 'string' && 
          val.toLowerCase().includes(this.searchQuery.trim().toLowerCase())
        );

      if (this.selectedRole) {
        matched = matched && this.selectedRole === user.role;
      }

      return matched;
    };
  }

  filterByRole() {
    this.dataSource.filter = 'just to trigger filter';
  }

  search(query: string) {
    let newFilter = 'just to trigger filter';
    if (query) {
      this.searchQuery = query;
      newFilter = query.trim().toLowerCase();
    }

    this.dataSource.filter = newFilter;
  }
}

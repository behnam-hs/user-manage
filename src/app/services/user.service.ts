import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RawUserData, User, UserEditData } from '../models/user';
import { UserGeneratorService } from './user-generator.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users: User[] = [];
  users = new BehaviorSubject<User[]>([]);

  constructor(private userGenerator: UserGeneratorService) {
    const storedUsers = localStorage.getItem('users');

    if(storedUsers) {
      this._users = JSON.parse(storedUsers);
    } else {
      const usersCount = Math.floor(20 + Math.random() * 20);
      this._users = this.userGenerator.batchCreate(usersCount);
    }

    this.broadcastUsers();
  }

  broadcastUsers() {
    this.users.next(this._users);
    localStorage.setItem('users', JSON.stringify(this._users))
  }

  toggleUserStatus(id: number) {
    const foundUser = this.getUserById(id);
    if (!foundUser) return;

    foundUser.enabled = !foundUser.enabled;

    this.broadcastUsers();
  }

  findIndexById(id: number) {
    return this._users.findIndex( item => item.id === id );
  }

  getUserById(id: number) {
    return this._users.find((user: User) => user.id === id );
  }

  private _remove(id: number) {
    const itemIndex = this.findIndexById(id);
    this._users.splice(itemIndex, 1)
  }

  private _add(user: Omit<User, 'id'>) {
    this._users.unshift({ ...user, id: this.userGenerator.generateUniqueId() });
  } 

  batchAdd(users: Omit<User, 'id'>[]) {
    users.forEach(this._add.bind(this));
    this.broadcastUsers();
  }

  batchRemove(users: User[]) {
    users.forEach(user => {
      this._remove(user.id);
    });

    this.broadcastUsers();
  }


  edit(userData: UserEditData): boolean {
    const foundUser = this.getUserById(userData.id);
    const index = this.findIndexById(userData.id);
    if ( !foundUser ) return false;

    this._users = [
      ...this._users.slice(0, index),
      {
        ...foundUser,
        ...Object.fromEntries(Object.entries(userData).filter(([key, value]) => typeof value !== 'undefined'))
      },
      ...this._users.slice(index + 1)
    ];
    
    this.broadcastUsers();

    return true;
  } 
}

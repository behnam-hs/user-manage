import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Role, ROLES } from '../models/role';
import { faker } from '@faker-js/faker';
import { Gender } from '../models/gender';

@Injectable({
  providedIn: 'root'
})
export class UserGeneratorService {
  constructor() { }

  createRandomUser(): User {
    const gender = faker.name.sex() as Gender;

    return {
      id: this.generateUniqueId(),
      name: faker.name.fullName({ sex: gender }),
      email: faker.internet.email(),
      gender: gender,
      avatar: faker.image.avatar(),
      enabled: faker.datatype.boolean(),
      role: faker.helpers.arrayElement(ROLES) as Role,
      createdAt: new Date(faker.date.between('2020-01-01T00:00:00.000Z', new Date())),
    };
  }

  generateUniqueId() {
    return faker.helpers.unique(faker.datatype.number);
  }

  batchCreate(count: number) {
    // return new Array(count).fill(0).map(() => this.createRandomUser());

    const list: User[] = [];

    for ( let i = 0; i < count; i++ ) {
      list.push(this.createRandomUser());
    }

    return list;
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROLES } from 'src/app/models/role';
import { RawUserData, User, UserEditData } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  form = this.fb.group({
    users: this.fb.array([this.createEmptyRow()]),
  });
  ROLES = ROLES;
  editId?: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.editId = Number(params['id']) || undefined;
      this.fetchEditData();
    });
  }

  get users() {
    return this.form.controls['users'] as FormArray;
  }
  get controls() {
    return this.users.controls as FormGroup[];
  }

  fetchEditData() {
    if (typeof this.editId === 'undefined') return;

    const foundUser = this.userService.getUserById(this.editId);

    if (foundUser) {
      // TODO do we need to clear first?
      this.users.clear();
      this.users.push(
        this.fb.group<RawUserData>({
          name: new FormControl(foundUser.name, {
            validators: [Validators.required],
            nonNullable: true,
          }),
          email: new FormControl(foundUser.email, {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
          }),
          gender: new FormControl(foundUser.gender, {
            validators: [Validators.required],
            nonNullable: true,
          }),
          role: new FormControl(foundUser.role, {
            validators: [Validators.required],
            nonNullable: true,
          }),
        })
      );
    }
  }

  createEmptyRow() {
    return this.fb.group<RawUserData>({
      name: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      gender: new FormControl('male', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      role: new FormControl('viewer', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  addEmptyForm() {
    this.users.push(this.createEmptyRow());
  }

  closeForm(index: number) {
    this.users.removeAt(index);
  }

  submit() {
    // this function will edit or add user based on existence of editId
    this.form.markAllAsTouched();

    if (!this.form.valid) return;

    if (typeof this.editId !== 'undefined') {
      const rawUserData = this.form.getRawValue().users[0];
      const userToEdit: UserEditData = {
        id: this.editId!,
        ...rawUserData,
      };

      this.userService.edit(userToEdit);
      this.router.navigate([''])
            
    } else {
      const usersToAdd: Omit<User, 'id'>[] = this.form
        .getRawValue()
        .users!.map((userData) => {
          return {
            ...userData,
            avatar: '', //should have default avatar
            enabled: true,
            createdAt: new Date(),
          };
        });

      this.userService.batchAdd(usersToAdd);
    }

    this.form.reset();
  }
}

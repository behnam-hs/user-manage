import { FormControl } from "@angular/forms";
import { UserGeneratorService } from "../services/user-generator.service";
import { Gender } from "./gender";
import { Role } from "./role";

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    gender: Gender;
    enabled: boolean;
    role: Role;
    createdAt: Date;
}

export interface RawUserData {
    name: FormControl<string>;
    email: FormControl<string>;
    gender: FormControl<Gender>;
    role: FormControl<Role>;
}

export type UserEditData = Partial<User> & Pick<User, 'id'>;

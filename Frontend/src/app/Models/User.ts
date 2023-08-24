import { UserRole } from "./UserRole";

export class User{
    userId: number = 0;
    userName: string = "";
    name: string = "";
    userRole: UserRole = 0;
    passwordexpiryDate: Date = new Date;
}
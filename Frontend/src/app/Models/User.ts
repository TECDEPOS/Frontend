import { Department } from "./Department";
import { Location } from "./Location";
import { Person } from "./Person";
import { UserRole } from "./UserRole";

export class User{
    userId: number = 0;
    departmentId: number|null = null;
    locationId: number|null = null;
    educationBossId: number|null = null;
    userName: string = "";
    name: string = "";
    userRole: UserRole = 0;
    passwordexpiryDate: Date = new Date;

    department?: Department = new Department;
    location?: Location = new Location;
    educationBoss?: User| null = null;
    educationLeaders: User[] = [];
}
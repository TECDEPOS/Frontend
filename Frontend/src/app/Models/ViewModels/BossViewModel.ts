import { Department } from "../Department";
import { Location } from "../Location";
import { Person } from "../Person";
import { UserRole } from "../UserRole";

export class BossViewModel {
    userId: number = 0;
    name: string = "";
    userRole: UserRole = 0; 

    educationLeaders: LeaderViewModel[] = [];
}

export class LeaderViewModel {
    userId: number = 0;
    educationBossId: number|null = null;
    name: string = "";
    userRole: UserRole = 0;

    educators: Person[] = [];
}
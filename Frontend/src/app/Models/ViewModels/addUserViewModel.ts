import { UserRole } from "../UserRole";

export class userViewModel{
    username: string = "";
    name: string = "";
    educationBossId: number | null = null;
    departmentId: number | null = null;
    locationId: number | null = null;
    userRole: UserRole = 0;
}
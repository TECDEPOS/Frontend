import { Department } from "./Department";
import { File } from "./File";
import { PersonModule } from "./PersonModule";
import { User } from "./User";
import { Location } from "./Location";

export class Person{
    personId: number = 0;
    name: string = "";
    initials: string = "";
    departmentId: number|null = null;
    educationalConsultantId: number|null = null;
    locationId: number|null = null;
    operationCoordinatorId: number|null = null;
    hiringDate: Date = new Date;
    endDate: Date = new Date;
    svuEligible: boolean = false;
    svuApplied: boolean = false;

  
    educationalConsultant: User = new User;
    operationCoordinator: User = new User;
    department?: Department = new Department;
    location?: Location = new Location;
    files: File[] = [];
    personModules: PersonModule[] = [];

    completedModules: number = 1;
}
import { Department } from "./Department";
import { File } from "./File";
import { PersonModule } from "./PersonModule";
import { User } from "./User";
import { Location } from "./Location";

export class Person{
    personId: number = 0;
    name: string = "";
    initials: string = "";
    departmentId: number = 0;
    educationalConsultantId: number = 0;
    locationId: number = 0;
    operationCoordinatorId: number = 0;
    hiringDate: Date = new Date;
    endDate: Date = new Date;
    svuEligible: boolean = false;

    // completedModules: number = 0;
  
    educationalConsultant: User = new User;
    operationCoordinator: User = new User;
    department?: Department = new Department;
    location?: Location = new Location;
    files: File[] = [];
    personModules: PersonModule[] = [];
}
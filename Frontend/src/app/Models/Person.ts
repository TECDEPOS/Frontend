import { Department } from "./Department";
import { Files } from "./Files";
import { PersonModule } from "./PersonModule";
import { User } from "./User";
import { Location } from "./Location";

export class Person{
    personId: number = 0;
    name: string = "";
    hiringDate: Date = new Date;
    endDate: Date = new Date;
    svuEligible: boolean = false;
    educationalConsultant: User = new User;
    operationCoordinator: User = new User;
    department: Department = new Department;
    location: Location = new Location
    files: Files = new Files;
    personModules: PersonModule[] = [];
}
import { Department } from "./Department";
import { File } from "./File";
import { User } from "./User";
import { Location } from "./Location";
import { PersonCourse } from "./PersonCourse";

export class Person{
    personId: number = 0;
    name: string = "";
    initials: string = "";
    departmentId: number|null = null;
    locationId: number|null = null;
    educationalConsultantId: number|null = null;
    educationalLeaderId: number|null = null;
    operationCoordinatorId: number|null = null;
    hiringDate: Date = new Date;
    endDate: Date = new Date;
    svuEligible: boolean = false;
    svuApplied: boolean = false;

  
    educationalConsultant: User|null = null;
    educationalLeader: User|null = null;
    operationCoordinator: User|null = null;
    department?: Department|null = null;
    location?: Location|null = null;;
    files: File[] = [];
    personCourses: PersonCourse[] = [];

    completedModules: number = 1;
}
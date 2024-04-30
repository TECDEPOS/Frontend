
import { Course } from "./Course";
import { Person } from "./Person";
import { Status } from "./Status";

export class PersonCourse{
    personId: number = 0;
    courseId: number | null = null;
    
    status: Status = 0;

    course: Course | null = null;
    person?: Person;
}

import { Course } from "./Course";
import { Person } from "./Person";
import { Status } from "./Status";

export class PersonCourse{
    personId: number = 0;
    courseId: number = 0;
    
    status: Status = 0;

    course?: Course;
    person?: Person;
}
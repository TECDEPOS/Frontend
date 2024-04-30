import { Course } from "../Course";

export class ModuleWithCourseViewModel {
    moduleId: number = 0;
    name: string = "";
    description: string = "";

    courses: Course[] = []
}
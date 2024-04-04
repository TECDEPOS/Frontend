import { Module } from "./Module";
import { CourseType } from "./CourseType";
import { PersonCourse } from "./PersonCourse";

export class Course{
    courseId: number = 0;
    moduleId: number | null = null;
    startDate: Date = new Date;
    endDate: Date = new Date;

    courseType: CourseType = 0;

    module: Module = new Module;
    personCourses: PersonCourse[] = [];
}
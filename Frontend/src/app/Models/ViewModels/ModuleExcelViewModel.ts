import { Course } from "../Course";

export class ModuleExcelViewModel {
    moduleId: number = 0;
    name: string = "";
    description: string = "";

    courses: Course[] = []
}
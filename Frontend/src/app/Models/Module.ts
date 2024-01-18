import { Book } from "./Book";
import { CourseType } from "./CourseType";

export class Module{
    moduleId: number = 0;
    name: string = "";
    description: string = "";

    books: Book[] = []
}
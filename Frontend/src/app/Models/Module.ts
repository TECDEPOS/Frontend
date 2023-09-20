import { Book } from "./Book";
import { ModuleType } from "./ModuleType";

export class Module{
    moduleId: number = 0;
    name: string = "";
    description: string = "";
    moduleType: ModuleType = 0;

    books: Book[] = []
}
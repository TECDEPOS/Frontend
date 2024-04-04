import { Book } from "./Book";

export class Module{
    moduleId: number = 0;
    name: string = "";
    description: string = "";

    books: Book[] = []
}
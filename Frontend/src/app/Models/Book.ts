import { Module } from "./Module";

export class Book{
    bookId: number = 0;
    moduleId: number | null = null;
    name: string = "";
    amount: number = 0;    

    module: Module = new Module;
}
import { Module } from "./Module";
import { Person } from "./Person";
import { Status } from "./status";

export class PersonModule{
    personId: number = 0;
    moduleId: number = 0;
    startDate: Date = new Date;
    endDate: Date = new Date;
    status: Status = 0;
    
    module: Module = new Module
    person: Person = new Person
}
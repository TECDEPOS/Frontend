import { Module } from "./Module";
import { ModuleType } from "./ModuleType";
import { Person } from "./Person";
import { Status } from "./status";

export class PersonModule{
    personModuleId: number = 0;
    personId: number = 0;
    moduleId: number = 0;
    startDate: Date = new Date;
    endDate: Date = new Date;
    status: Status = 0;

    moduleType: ModuleType = 0;
    module: Module = new Module
    person: Person = new Person
}
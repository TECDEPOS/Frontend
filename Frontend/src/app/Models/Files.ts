import { FileTag } from "./FileTag";
import { Person } from "./Person";

export class Files{
    fileId: Number = 0;
    fileName: string = "";
    fileUrl: String = "";
    uploadDate: Date = new Date;
    fileTag: FileTag = new FileTag;
    person: Person[] = []

}
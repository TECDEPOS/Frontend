import { FileTag } from "./FileTag";
import { Person } from "./Person";

export class Files{
    fileId: number = 0;
    fileName: string = "";
    fileUrl: String = "";
    contentType: string = "";
    fileFormat: string = "";
    
    uploadDate: Date = new Date;
    fileTag: FileTag = new FileTag;
    person: Person[] = []
}
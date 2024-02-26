import { File } from "./File";

export class FileTag{
    fileTagId: number = 0;
    tagName: string = "";
    dkVisibility: boolean = true;
    hrVisibility: boolean = true;
    pkVisibility: boolean = true;
    educationLeaderVisibility: boolean = true;
    educationBossVisibility: boolean = true;
    controllerVisibility: boolean = true;


    [key: string]: number | string | boolean;
}
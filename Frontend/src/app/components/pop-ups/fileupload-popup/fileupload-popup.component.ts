import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { File } from 'src/app/Models/File';
import { FileTag } from 'src/app/Models/FileTag';
import { FileTagService } from 'src/app/Services/file-tag.service';
import { FileService } from 'src/app/Services/file.service';

@Component({
  selector: 'app-fileupload-popup',
  templateUrl: './fileupload-popup.component.html',
  styleUrls: ['./fileupload-popup.component.css']
})
export class FileuploadPopupComponent {

  rawFiles: any[] = []
  personId: number = 0;
  personFiles: File[] = [];
  file: any;
  displayFiles: any[] = [];
  fileTagId: number = 0;
  fileTag: FileTag = null!;
  formData: FormData = new FormData;
  selectorFileTags: FileTag[] = [];
  fileTags: FileTag[] = [];
  constructor(private dialogRef: MatDialogRef<FileuploadPopupComponent>, private tagService: FileTagService, private fileService: FileService, 
    @Inject(MAT_DIALOG_DATA)
    private data: {
      personId: number;
      personFiles: File[];
    }) {
      if (data?.personId) this.personId = data.personId;
      if (data.personFiles) this.personFiles = data.personFiles;
    }

  ngOnInit(){
    this.getFileTags();    
  }

  getFileTags(){
    this.tagService.getFileTag().subscribe(res => {
      this.selectorFileTags = res;
    })
  }

  closeDialog(){
    this.displayFiles = [];
    this.dialogRef.close();
  }

  load(){}

  onSubmit(): void {
    // Build formData before sending request to server
    // let filetags: string = JSON.stringify(this.fileTags);
    this.formData.append('personId', this.personId.toString());
    this.formData.append('fileTags', JSON.stringify(this.fileTags));
    
    for (const file of this.displayFiles) {
      this.formData.append('file', file);
    }    

    this.fileService.uploadMultipleFiles(this.formData).subscribe(res => {      
      this.personFiles.push(...res);
      this.closeDialog();
    });
  }

  fileChange(files: any) {    
    console.log(files);
    
    if (files && files.length > 0) {
      this.file = files[0];      
    }
  }

  onFileTagChange(newTag:FileTag){
    console.log(newTag);
    
    this.fileTag = newTag;
  }

  // confirmFile(){
  //   this.file.fileTag = this.fileTag;
  //   this.displayFiles.push(this.file);
  //   this.fileTags.push(this.fileTag);
  //   this.file = null;
  //   this.fileTag = null!;
  // }

  // removeCurrentFile(){
  //   this.file = null;
  // }

  // removeDisplayFile(i :number){
  //   this.displayFiles.splice(i, 1);
  //   this.fileTags.splice(i, 1);    
  // }



 /**
   * on file drop handler
   */
 onFileDropped($event: any) {
  this.prepareFilesList($event);
}

test(){
  console.log(this.rawFiles);
  
}

/**
 * handle file from browsing
 */
fileBrowseHandler(files:any) {
  this.prepareFilesList(files);
}

/**
 * Delete file from files list
 * @param index (File index)
 */
deleteFile(index: number) {
  this.rawFiles.splice(index, 1);
}

/**
 * Simulate the upload process
 */
uploadFilesSimulator(index: number) {
  setTimeout(() => {
    if (index === this.rawFiles.length) {
      return;
    } else {
      const progressInterval = setInterval(() => {
        if (this.rawFiles[index].progress === 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(index + 1);
        } else {
          this.rawFiles[index].progress += 5;
        }
      }, 1);
    }
  }, 1);
}

/**
 * Convert Files list to normal array list
 * @param files (Files List)
 */
prepareFilesList(files: Array<any>) {
  for (const item of files) {
    item.progress = 0;
    this.rawFiles.push(item);
    console.log(item.name);
    
  }
  this.uploadFilesSimulator(0);
  console.log(this.rawFiles);
  
}

/**
 * format bytes
 * @param bytes (File size in bytes)
 * @param decimals (Decimals point)
 */
formatBytes(bytes:any, decimals: any|null = null) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
}

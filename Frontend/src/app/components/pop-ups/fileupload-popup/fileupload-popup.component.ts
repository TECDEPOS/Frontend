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

  onSubmit(): void {
    // Build formData before sending request to server
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
    this.fileTag = newTag;
  }

  confirmFile(){
    this.file.fileTag = this.fileTag;
    this.displayFiles.push(this.file);
    this.fileTags.push(this.fileTag);
    this.file = null;
    this.fileTag = null!;
  }

  removeCurrentFile(){
    this.file = null;
  }

  removeDisplayFile(i :number){
    this.displayFiles.splice(i, 1);
    this.fileTags.splice(i, 1);    
  }
}

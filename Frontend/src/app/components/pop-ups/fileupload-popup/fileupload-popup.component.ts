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
  fileTag: FileTag = new FileTag;
  formData: FormData = new FormData;
  selectorFileTags: FileTag[] = [];
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
    console.log(this.file);
    
  }

  getFileTags(){
    this.tagService.getFileTag().subscribe(res => {
      this.selectorFileTags = res;
      console.log(this.selectorFileTags);
      
      
    })
  }

  test(){
    console.log('fileTagId',this.fileTagId);
    console.log('file',this.file);
    console.log('personId',this.personId);
    console.log('personFiles', this.personFiles);
    
  }

  closeDialog(){
    this.displayFiles = [];
    this.dialogRef.close();
  }

  // onSubmit below works for singular uploads

  // onSubmit(): void {    
  //   console.log(this.formData);
    
  //   this.fileService.uploadFile(this.formData, this.personId, this.fileTagId).subscribe(res => {
  //     //TODO: Below needs to add all new files to the array
  //     this.personFiles.push(res);
  //     this.closeDialog();
  //   });
  // }

  onSubmit(): void {    
    console.log(this.formData);
    
    this.fileService.uploadMultipleFiles(this.formData, this.personId).subscribe(res => {
      //TODO: Below needs to add all new files to the array
      this.personFiles.push(res);
      this.closeDialog();
    });
  }


  fileChange(files: any) {
    console.log('files', files);
    
    if (files && files.length > 0) {
      this.file = files[0];      
    }
  }

  onFileTagChange(test:any){
    console.log(test);    
  }

  confirmFile(){
    if (this.fileTag !== null || this.fileTag !== undefined) {
      this.file["fileTag"] = this.fileTag;
      this.fileTag = null!;
    }
    else{
      this.file["fileTag"] = null;
    }
    console.log('CURRENT FILE',this.file);
    
    this.displayFiles.push(this.file);
    this.formData.append('file', this.file);
    this.file = null;
  }
}

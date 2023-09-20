import { Component, Input } from '@angular/core';
import { FileTag } from 'src/app/Models/FileTag';
import { FileTagService } from 'src/app/Services/file-tag.service';
import { FileService } from 'src/app/Services/file.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  fileTags: FileTag[] = [];
  formData = new FormData();
  file: any;
  tagId: number = 0;
  @Input() userId: number = 0;

  constructor(private fileTagService: FileTagService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fileTagService.getFileTag().subscribe(data => {
      console.log(data);
      this.fileTags = data;
      
    })
  }

  onSubmit(): void {
    this.fileService.uploadFile(this.formData, this.userId, this.tagId).subscribe(() => alert("File uploaded"));    
  }  

  fileChange(files: any) {
    if (files && files.length > 0) {
      this.file = files[0];
      this.formData.append('file', this.file);
    }
  }

  cleanFormData() {
    this.file = undefined;
  }
}

import { Component } from '@angular/core';
import { findIndex } from 'rxjs';
import { Files } from 'src/app/Models/Files';
import { FileService } from 'src/app/Services/file.service';

@Component({
  selector: 'app-file-page',
  templateUrl: './file-page.component.html',
  styleUrls: ['./file-page.component.css']
})
export class FilePageComponent {
  public pageTitle = 'Welcome to View Files component';
  files: Files[] = [];

  constructor(private fileService: FileService) {
    this.getAllFiles();
  }

  getAllFiles() {
    this.fileService.getFiles().subscribe(data => {
      this.files = data;
    });
  }

  orderByFileName() {
    if (this.files[0] === this.files.sort((a, b) => b.fileName.localeCompare(a.fileName))[0]) {
      this.files.sort((a, b) => a.fileName.localeCompare(b.fileName))
    }
    else {
      this.files = this.files.sort((a, b) => b.fileName.localeCompare(a.fileName))
    }
  }

  orderByPersonName() {
    if (this.files[0] === this.files.sort((a, b) => b.person.name.localeCompare(a.person.name))[0]) {
      this.files.sort((a, b) => a.person.name.localeCompare(b.person.name))
    }
    else {
      this.files = this.files.sort((a, b) => b.person.name.localeCompare(a.person.name))
    }
  }

  orderByDate() {
    if (this.files[0] === this.files.sort((a, b) => String(b.uploadDate).localeCompare(String(a.uploadDate)))[0]) {
      this.files.sort((a, b) => String(a.uploadDate).localeCompare(String(b.uploadDate)))
    }
    else {
      this.files.sort((a, b) => String(b.uploadDate).localeCompare(String(a.uploadDate)))
    }
  }

  orderByTagName() {
    if (this.files[0] === this.files.sort((a, b) => b.fileTag.tagName.localeCompare(a.fileTag.tagName))[0]) {
      this.files.sort((a, b) => a.fileTag.tagName.localeCompare(b.fileTag.tagName))
    }
    else {
      this.files = this.files.sort((a, b) => b.fileTag.tagName.localeCompare(a.fileTag.tagName))
    }
  }

  deleteFile(fileId: number, i: number) {
    this.fileService.deleteFile(fileId).subscribe(data => { 
      console.log(this.files);
      this.files.splice(i, 1)
      console.log(this.files);
      
    })
  }

  downloadFile(id: number, contentType: string, fileName: string) {
    this.fileService.downloadFile(id)
      .subscribe((result: Blob) => {
        console.log(result);
        const blob = new Blob([result], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Set the desired file name
        a.style.display = 'none';
        document.body.appendChild(a);

        // Click the anchor element to trigger the download
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log("Success");
      });
  }
}

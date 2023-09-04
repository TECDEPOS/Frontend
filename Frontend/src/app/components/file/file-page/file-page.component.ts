import { Component } from '@angular/core';
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

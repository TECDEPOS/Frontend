import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { findIndex } from 'rxjs';
import { File } from 'src/app/Models/File';
import { FileTag } from 'src/app/Models/FileTag';
import { FileTagService } from 'src/app/Services/file-tag.service';
import { FileService } from 'src/app/Services/file.service';

@Component({
  selector: 'app-file-page',
  templateUrl: './file-page.component.html',
  styleUrls: ['./file-page.component.css']
})
export class FilePageComponent {
  public pageTitle = 'Welcome to View Files component';
  showedList: File[] = [];
  files: File[] = [];
  fileTags: FileTag[] = [];
  alle: string = "";
  searchFileTag: string = "";

  constructor(private fileService: FileService, private fileTagService: FileTagService) {
    this.getAllFiles();
  }

  getAllFiles() {
    this.fileService.getFiles().subscribe(data => {
      this.files = data;
      this.showedList = this.files;
      this.files.sort((a, b) => this.compare(a.uploadDate, b.uploadDate) * ('asc' == 'asc' ? 1 : -1))
      this.fileTagService.getFileTag().subscribe(data => {
        this.fileTags = data
      })
    });
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

  onSearchQueryInput(event: Event){
    const searchQuery = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    let fileList: File[] = []
    this.files.forEach(element => {
      if (element.fileName.toLocaleLowerCase().includes(searchQuery) && element.fileTag?.tagName.toLocaleLowerCase().includes(this.searchFileTag.toLocaleLowerCase())){ 
          fileList.push(element);   
      }
      this.showedList = fileList    
    });    
  }

  onFileTagQueryInput(event: any){
    let fileList: File[] = []
    this.files.forEach(element => {
      if(element.fileTag.tagName.toLocaleLowerCase().includes(event.value.toLocaleLowerCase())){
        fileList.push(element)
      }
      this.showedList = fileList;
      this.searchFileTag = event.value;
    })
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.files = this.files.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fileName':
          return this.compare(a.fileName, b.fileName) * (sort.direction == 'asc' ? 1 : -1);
        case 'personName':
          return this.compare(a.person.name, b.person.name) * (sort.direction == 'asc' ? 1 : -1);
        case 'uploadDate':
          return this.compare(a.uploadDate, b.uploadDate) * (sort.direction == 'asc' ? 1 : -1);
        case 'tag':
          return this.compare(a.fileTag?.tagName, b.fileTag?.tagName) * (sort.direction == 'asc' ? 1 : -1);
        default:
          return 0;
      }
    });
  }

  compare(itemA: any, itemB: any): number {
    let retVal: number = 0;
      if (itemA && itemB) {
        if (itemA.toLocaleLowerCase() > itemB.toLocaleLowerCase()) retVal = 1;
        else if (itemA.toLocaleLowerCase() < itemB.toLocaleLowerCase()) retVal = -1;
      }
      else if (itemA) retVal = 1;
      else if (itemB) retVal = -1;
      return retVal;
  }
}

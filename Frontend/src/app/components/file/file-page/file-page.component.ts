import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { findIndex } from 'rxjs';
import { File } from 'src/app/Models/File';
import { FileTag } from 'src/app/Models/FileTag';
import { AuthService } from 'src/app/Services/auth.service';
import { FileTagService } from 'src/app/Services/file-tag.service';
import { FileService } from 'src/app/Services/file.service';
import { VisibilityOption } from '../../Misc/filetag-multi-dropdown/filetag-multi-dropdown.component';

@Component({
  selector: 'app-file-page',
  templateUrl: './file-page.component.html',
  styleUrls: ['./file-page.component.css']
})
export class FilePageComponent {
  public pageTitle = 'Welcome to View Files component';
  showedList: File[] = [];
  filteredList: File[] = [];
  files: File[] = [];
  fileTags: FileTag[] = [];
  filteredFileTags: FileTag[] = [];
  alle: string = "";
  searchName: string = "";

  constructor(private fileService: FileService, private fileTagService: FileTagService, private authService: AuthService) {
    this.getAllFiles();
  }

  // Fetch all files based on user role
  getAllFiles() {
    let roleId = this.authService.getUserRoleId();
    this.fileService.getFiles(roleId).subscribe(data => {
      this.files = data;
      this.showedList = this.files;
      this.files.sort((a, b) => this.compare(a.uploadDate, b.uploadDate) * ('asc' == 'asc' ? 1 : -1));
      this.fileTagService.getFileTag().subscribe(data => {
        this.fileTags = data;
      });
    });
  }

  // Delete a specific file by ID and remove it from the list
  deleteFile(fileId: number, i: number) {
    this.fileService.deleteFile(fileId).subscribe(data => { 
      console.log(this.files);
      this.files.splice(i, 1);
      console.log(this.files);
    });
  }

  // Download a file by creating a temporary anchor element and triggering the download
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

        // Clean up the temporary URL and anchor element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log("Success");
      });
  }

  // Filter the list of files based on the search query
  onSearchQueryInput(){
    if (this.searchName == '') {
      this.showedList = this.filteredList;
      console.log('if', this.showedList);
    }
    else {
      this.showedList = this.filteredList.filter(file => file.fileName.toLowerCase().includes(this.searchName.toLowerCase()));
      console.log('else', this.showedList);
    }
  }

  // Sort the file data based on the selected column and sort direction
  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.showedList = this.showedList.sort((a, b) => {
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

  // Compare two items for sorting purposes
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

  // Filter the table based on the selected file tags
  onFileTagFilterChanged(selectedFileTags: any[]) {
    this.filteredFileTags = selectedFileTags;
    console.log(this.filteredFileTags);
    this.filterTable();
  }

  // Filter the list of files based on selected file tags
  filterTable() {
    this.filteredList = this.files.filter(file => {
      console.log('file', file);

      const fileTagFilter = this.filteredFileTags.length === 0 || this.filteredFileTags.some(tag => tag.fileTagId === file.fileTag?.fileTagId);

      if (this.filteredFileTags.length === 0) {
        return true;
      }
      else {
        return fileTagFilter;
      }
    });
    this.onSearchQueryInput();
  }
}

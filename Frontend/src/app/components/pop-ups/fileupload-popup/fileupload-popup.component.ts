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
  selectedTag: any = "";
  personId: number = 0;
  personFiles: File[] = [];
  displayFiles: any[] = [];
  formData: FormData = new FormData;
  selectorFileTags: FileTag[] = [];
  fileTags: (FileTag | null)[] = [];
  files: any[] = [];

  // Constructor to initialize services and inject data
  constructor(private dialogRef: MatDialogRef<FileuploadPopupComponent>, private tagService: FileTagService, private fileService: FileService,
    @Inject(MAT_DIALOG_DATA)
    private data: { personId: number; personFiles: File[]; }) {
    if (data?.personId) this.personId = data.personId;
    if (data.personFiles) this.personFiles = data.personFiles;
  }

  // On component initialization, fetch file tags
  ngOnInit() {
    this.getFileTags();
  }

  // Fetch available file tags from the service
  getFileTags() {
    this.tagService.getFileTag().subscribe(res => {
      this.selectorFileTags = res;
    });
  }

  // Handle form submission, append form data and send it to the server
  onSubmit(): void {
    this.formData.append('personId', this.personId.toString());
    this.formData.append('fileTags', JSON.stringify(this.fileTags));

    for (const file of this.files) {
      this.formData.append('file', file);
    }

    this.fileService.uploadMultipleFiles(this.formData).subscribe(res => {
      this.personFiles.push(...res);
      this.dialogRef.close();
    });
  }

  // Handle changes in file tags when the user selects a tag for a file
  onFileTagChange(e: Event, index: number) {
    const selectedIndex = (e.target as HTMLSelectElement).selectedIndex;
    if (selectedIndex === 0) {
      this.fileTags.splice(index, 1, null); // No tag selected
    } else {
      this.fileTags.splice(index, 1, this.selectorFileTags[selectedIndex - 1]); // Selects the corresponding tag
    }
  }

  // Handle file browsing event, pushes files to the array
  fileBrowseHandler(files: any) {
    this.pushFiles(files);
  }

  // Handle files dropped into the component
  onFileDropped($event: any) {
    this.pushFiles($event);
  }

  // Add files to the array and initialize matching tags
  pushFiles(files: any[]) {
    for (const item of files) {
      this.files.push(item);
      const matchingFiletag: FileTag | null = null;
      this.fileTags.push(matchingFiletag);
    }
    console.log(this.files);
    console.log(this.fileTags);
  }

  // Remove file from the list
  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.fileTags.splice(index, 1);
    console.log(this.files);
    console.log(this.fileTags);
  }

  // Format file size in bytes into a human-readable format
  formatBytes(bytes: any, decimals: any) {
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

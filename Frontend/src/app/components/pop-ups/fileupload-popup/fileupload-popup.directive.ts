import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appFileuploadPopup]'
})
export class FileuploadPopupDirective {
  @HostBinding('class.fileover') fileOver: boolean = false;
  @Output() fileDropped = new EventEmitter<any>();

  constructor() { }

  ngOnInit(){
    console.log("THIS IS NOT WORKING!");
    
  }

  @HostListener('dragover', ['$event']) onDragOver(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;

    console.log('Drag over');
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;

    console.log('Drag leave');    
  }

  @HostListener('drop', ['$event']) public ondrop(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    if(files.length > 0){
      console.log(files.length);
      
      this.fileDropped.emit(files);      
    }
  }

}

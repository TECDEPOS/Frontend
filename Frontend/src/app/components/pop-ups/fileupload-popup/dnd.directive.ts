import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  // HostBinding to indicate if the file is being dragged over
  @HostBinding() fileOver: boolean = false;

  // Output event emitter for when a file is dropped
  @Output() fileDropped = new EventEmitter<any>();

  // Constructor for the component
  constructor() { }

  // HostListener for the 'dragover' event to handle file dragging over the drop zone
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
    console.log('Drag Over');
  }

  // HostListener for the 'dragleave' event to handle when a file is dragged away from the drop zone
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    console.log('Drag leave');
  }

  // HostListener for the 'drop' event to handle when a file is dropped in the drop zone
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      console.log(files.length);

      // Emits the files dropped to the parent component
      this.fileDropped.emit(files);
    }
  }
}

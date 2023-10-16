import { Component } from '@angular/core';
import { Module } from 'src/app/Models/Module';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent {
modules: Module[] = [];
}

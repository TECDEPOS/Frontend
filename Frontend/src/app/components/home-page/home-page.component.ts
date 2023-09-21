import { Component, ElementRef, ViewChildren, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service'; 
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PersonsService } from 'src/app/Services/persons.service';
import { Person } from 'src/app/Models/Person';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { Department } from 'src/app/Models/Department';
import { elementAt } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  department: Department[] = [];
  Hired: Person[] = [];
  showedList: Person[] = [];
  completedModules: number = 2;
  pickedDepartment: string = "";
  searchName: string = "";
  alle: string = "";
  searchDepartment: any = ""
  @ViewChildren('Progress', {read: ElementRef}) progress: ElementRef[] = [];

  constructor(private peronService: PersonsService, private departmentService: DepartmentsService) { }
  
  ngOnInit(): void{
    this.getTableData()
  }

  ngAfterViewInit(){
    // console.log(this.progress.getAttribute('data-message-id'));
    console.log("HEj");
  }
  
  getDepartmentData(){
    this.departmentService.getDepartment().subscribe(res => {
      this.department = res
    })
  }

  getTableData(){
    this.peronService.getPersons().subscribe(res => {
      this.Hired = res
      this.showedList = this.Hired
      this.getDepartmentData()
      this.Hired.sort((a,b) => a.name.localeCompare(b.name))   
      this.showedList = this.Hired
    })
  }

  onDepartmentQueryInput(event: any){    
    let personList: Person[] = []
    this.Hired.forEach(element => {
      if(element.department?.name.toLocaleLowerCase().includes(event.value.toLocaleLowerCase())){
        personList.push(element);
      }
      this.showedList = personList
      this.searchDepartment = event.value;
    })
  }

  onSearchQueryInput(event: Event){
    const searchQuery = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    let personList: Person[] = []
    this.Hired.forEach(element => {
      if (element.name.toLocaleLowerCase().includes(searchQuery) && element.department?.name.toLocaleLowerCase().includes(this.searchDepartment.toLocaleLowerCase())){
          personList.push(element);
          console.log("Afdeling");      
      }
      this.showedList = personList    
    });    
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.Hired = this.Hired.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'HiredName':
          return this.compare(a.name, b.name) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredDepartment':
          return this.compare(a.department?.name, b.department?.name) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredEndDate':
          return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredSVU':
          return this.compare(a.svuEligible, b.svuEligible) * (sort.direction == 'asc' ? 1 : -1);
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

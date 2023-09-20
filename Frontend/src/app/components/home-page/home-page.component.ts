import { Component, ElementRef, QueryList, Renderer2, ViewChildren } from '@angular/core';
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
  @ViewChildren('progress') progress: QueryList<ElementRef> = new QueryList

  constructor(private peronService: PersonsService, private departmentService: DepartmentsService, private renderer: Renderer2) { }
  
  ngOnInit(): void{
    this.getTableData()
    
    this.progress.forEach((element, index) => {
      console.log(element);

      
      
    });
  }

  ngAfterViewInit(): void{
   
    console.log(this.progress);
    this.progress.forEach((element, index) => {
      console.log(element);

      
      
    });
    
  }

  lalala(): void{
    console.log(this.progress.first);
    
  }
  
  getDepartmentData(){
    this.departmentService.getDepartment().subscribe(res => {
      this.department = res
    })
  }
  
  tester(){
  }

  getTableData(){
    this.peronService.getPersons().subscribe(res => {
      this.Hired = res
      this.showedList = this.Hired
      this.getDepartmentData()
      this.tester()
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
          return this.compare(a.name, b.name, isAsc);
        case 'HiredDepartment':
          return this.compare(a.department!.name, b.department!.name, isAsc);
        case 'HiredEndDate':
          return this.compare(a.endDate, b.endDate, isAsc);
        case 'HiredSVU':
          return this.compare(a.svuEligible, b.svuEligible, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string | Date | boolean, b: number | string | Date | boolean, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
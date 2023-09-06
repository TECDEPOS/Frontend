import { Component, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
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
  constructor(private peronService: PersonsService, private departmentService: DepartmentsService) { }
  
  ngOnInit(): void{
    this.getTableData()
    this.getDepartmentData()
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
      console.log(res);
      
      this.Hired.sort((a,b) => a.name.localeCompare(b.name))   
    })
  }

  onDepartmentQueryInput(event: any){    
    let personList: Person[] = []
    console.log(this.showedList[0].department?.name);
    console.log(event.value);
    
    if(this.showedList.length > 1,  this.showedList[0].department?.name == event.value){
      console.log("Hej");  
    }
    this.Hired.forEach(element => {
      if(element.department?.name.toLocaleLowerCase().includes(event.value.toLocaleLowerCase())){
        personList.push(element);
      }
      this.showedList = personList
    })
  }

  onSearchQueryInput(event: Event){
    const searchQuery = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    let personList: Person[] = []
    this.Hired.forEach(element => {
      if (element.name.toLocaleLowerCase().includes(searchQuery) && searchQuery !== " "){
        personList.push(element);
      }
      this.showedList = personList    
    });
  }

  orderByName(){
    if(this.Hired[0] === this.Hired.sort((a,b) => b.name.localeCompare(a.name))[0]){
      this.Hired.sort((a,b) => a.name.localeCompare(b.name))
    }
    else{
      this.Hired = this.Hired.sort((a,b) => b.name.localeCompare(a.name))  
    }
  }

  orderByDepartment(){
    if(this.Hired[0] === this.Hired.sort((a,b) => b.department!.name.localeCompare(a.department!.name))[0]){
      this.Hired.sort((a,b) => a.department!.name.localeCompare(b.department!.name))
    }
    else{
      this.Hired.sort((a,b) => b.department!.name.localeCompare(a.department!.name))
    }
  }

  orderBydate(){
    if(this.Hired[0] === this.Hired.sort((a,b) => String(b.endDate).localeCompare(String(a.endDate)))[0]){
      this.Hired.sort((a,b) => String(a.endDate).localeCompare(String(b.endDate)))
    }
    else{
      this.Hired.sort((a,b) => String(b.endDate).localeCompare(String(a.endDate)))
    }
  }

  orderByCompletModule(){
    console.log("Lol What did you think would happen?");
  }

  orderBySVUElegible(){
    if(this.Hired[0] === this.Hired.sort(value => {return value ? 1 : -1 /* `false` values first */})[0]){
      this.Hired.sort(value => {return value ? -1 : 1 /* `True` values first */})
      }
      else{
        this.Hired.sort(value => {return value ? 1 : -1 /* `false` values first */})
    }
  }
}

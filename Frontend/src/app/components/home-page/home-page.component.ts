import { Component, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service'; 
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PersonsService } from 'src/app/Services/persons.service';
import { Person } from 'src/app/Models/Person';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { Department } from 'src/app/Models/Department';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  TextInput = "";
  selected = null;
  tester = false;
  department: Department[] = [];
  Hired: Person[] = [];
  constructor(private peronService: PersonsService, private departmentService: DepartmentsService) { }
  
  ngOnInit(): void{
    // this.getTableData()
    // this.getDepartmentData()
  }
  getDepartmentData(){
    this.departmentService.getDepartment().subscribe(res => {
      this.department = res
    })
  }

  getTableData(){
    this.peronService.getPersons().subscribe(res => {
      this.Hired = res
      this.Hired.sort((a,b) => a.name.localeCompare(b.name))   
    })
  }


  OrderByName(){
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

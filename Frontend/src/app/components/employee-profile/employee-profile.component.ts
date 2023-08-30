import { Component } from '@angular/core';
import { Person } from 'src/app/Models/Person';
import { PersonsService } from 'src/app/Services/persons.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {

  person: Person = new Person;
  constructor(private personService: PersonsService){}
  ngOnInit(){
    this.personService.getPersonById(10).subscribe(res => {
      this.person = res;
      console.log(this.person);
      
    })
  }

  log(test: any){
    console.log(test);
  }
}

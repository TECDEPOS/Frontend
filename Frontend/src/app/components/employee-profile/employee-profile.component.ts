import { Component } from '@angular/core';
import { Department } from 'src/app/Models/Department';
import { Location } from 'src/app/Models/Location';
import { Person } from 'src/app/Models/Person';
import { User } from 'src/app/Models/User';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { LocationsService } from 'src/app/Services/locations.service';
import { PersonsService } from 'src/app/Services/persons.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {

  editDisabled: boolean = true;
  person: Person = new Person;
  backupValues: Person = new Person;
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  test: string = '';
  constructor(private personService: PersonsService, private userService: UserService, private departmentService: DepartmentsService, private locationService: LocationsService) { }

  ngOnInit() {
    this.getPerson();
    this.getUsers();
    this.getDepartments();
    this.getLocations();
  }

  getUsers(){
    this.userService.getUsers().subscribe(res => {
      this.educationalConsultants = res.filter(x => x.userRole === 1 || x.userRole === 4);
      this.operationCoordinators = res.filter(x => x.userRole === 3 || x.userRole === 6);      
    });
  }

  getDepartments(){
    this.departmentService.getDepartment().subscribe(res => {
      this.departments = res;
    });
  }

  getLocations(){
    this.locationService.getLocations().subscribe(res => {
      this.locations = res;
    });
  }

  getPerson() {
    this.personService.getPersonById(11).subscribe(res => {
      this.person = res;
      this.setBackupValues(this.person);
    })
  }

  onSubmit() {
    this.personService.updatePerson(this.person).subscribe(res => {
      this.person = res;
      this.editDisabled = true;
      this.setBackupValues(this.person);
    });
  }

  enableEditMode() {
    this.editDisabled = false;
  }

  cancelEditMode(){
    this.editDisabled = true;
    this.person = JSON.parse(JSON.stringify(this.backupValues));
  }

  setBackupValues(values: Person){
    //Sets backup values used if users press Cancel during edit mode.
    this.backupValues = JSON.parse(JSON.stringify(values));
  }

  compareUserObjects(o1: User, o2: User): boolean {
    if (o2 == null) {
      return false;
    }
    
    return o1.name === o2.name && o1.userId === o2.userId;
  }

  //Used for select dropdowns, without this no value will be shown on load even if a value has been set
  compareObjects(o1: any, o2: any): boolean {
    if (o2 == null) {
      return false;
    }

    if (typeof(o2 == Location)) {
      return o1.name === o2.name && o1.locationId === o2.locationId;  
    }
    else if (typeof(o2 == Department)){
      return o1.name === o2.name && o1.departmentId === o2.departmentId;
    }
    else{
      return false;
    }
  }


}

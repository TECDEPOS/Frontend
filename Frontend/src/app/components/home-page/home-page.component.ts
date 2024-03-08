import { Component, ElementRef, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PersonsService } from 'src/app/Services/persons.service';
import { Person } from 'src/app/Models/Person';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { Department } from 'src/app/Models/Department';
import { Sort } from '@angular/material/sort';
import { elementAt, takeUntil } from 'rxjs';
import { LocationsService } from 'src/app/Services/locations.service';
import { Unsub } from 'src/app/classes/unsub';
import { Location } from 'src/app/Models/Location';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent extends Unsub{
  departments: Department[] = [];
  locations: Location[] = [];
  filteredDepartments: Department[] = [];
  filteredLocations: Location[] = [];
  Hired: Person[] = [];
  showedList: Person[] = [];
  completedModules: number = 0;
  pickedDepartment: string = "";
  searchName: string = "";
  alle: string = "";
  searchDepartment: any = "";
  @ViewChildren('progress') progress: QueryList<ElementRef> = new QueryList

  constructor(private peronService: PersonsService, private departmentService: DepartmentsService, private locationService: LocationsService) { super(); }

  ngOnInit(): void {
    this.getTableData()
  }

  ngAfterViewInit(): void {
    this.progress.changes.subscribe(elm => {
      this.progressBar()
    })
  }

  progressBar(): void {
    this.Hired.forEach(person => {
      let objec = this.progress.find(x => x.nativeElement.id == person.personId);
      let howManyDaysInTotal = (new Date(person!.endDate).getTime() / 1000 - new Date(person!.hiringDate).getTime() / 1000) / 86400
      let howManyDaysSinceStart = (new Date().getTime() / 1000 - new Date(person!.hiringDate).getTime() / 1000) / 86400
      let inProcent = 0

      if (howManyDaysSinceStart < 0) {
        howManyDaysSinceStart = 0
      }

      if (new Date().getTime() / 1000 < new Date(person!.endDate).getTime() / 1000) {
        inProcent = (howManyDaysSinceStart / howManyDaysInTotal) * 100
      }
      else {
        inProcent = 100
      }


      if (objec === undefined) {
        return
      }

      objec!.nativeElement.style.width = inProcent + "%"
      if (inProcent < 75) {
        objec!.nativeElement.style.backgroundColor = "rgba(0, 128, 0, 0.30)"
      }
      if (inProcent > 75 && inProcent < 90) {
        objec!.nativeElement.style.backgroundColor = "rgba(255, 255, 0, 0.30)"
      }
      if (inProcent > 90) {
        objec!.nativeElement.style.backgroundColor = "rgba(255, 0, 0, 0.30)"
      }
    });
  }

  //Fun for fun, hvornår er vi halvejs med vores uddannelse
  findHalf() {
    var start = 1596441600,
      slut = 1755158400,
      mid = slut - ((slut - start) / 2)
    console.log(mid);

  }

  getDepartmentData() {
    this.departmentService.getDepartment().subscribe(res => {
      this.departments = res
    })
  }

  getLocationData() {
    this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations = res;
    });
  }

  getTableData() {
    this.peronService.getPersons().subscribe(res => {
      this.Hired = res
      this.Hired.forEach(element => {
        element.completedModules = this.modulesCompleted(element)
      });

      this.showedList = this.Hired
      this.getDepartmentData();
      this.getLocationData();
      this.Hired.sort((a, b) => a.name.localeCompare(b.name))
      this.showedList = this.Hired
      console.log(this.showedList);
    })
  }

  modulesCompleted(person: Person) {
    return person.personCourses.filter(x => x.status === 3).length;
  }

  onDepartmentQueryInput(event: any) {
    let personList: Person[] = []

    //Returns all, even null
    if (event.value.toLocaleLowerCase() === "" && this.searchName.toLocaleLowerCase() === "") {
      this.showedList = this.Hired
      this.searchDepartment = event.value;
      return
    }

    //Checks for what matches with the department and name
    this.Hired.forEach(element => {
      if (element.department?.name.toLocaleLowerCase().includes(event.value.toLocaleLowerCase()) && element.name.toLocaleLowerCase().includes(this.searchName.toLocaleLowerCase())) {
        personList.push(element);
      }
    })
    this.showedList = personList
    this.searchDepartment = event.value;
  }

  onSearchQueryInput(event: Event) {
    const searchQuery = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    let personList: Person[] = []
    if (searchQuery.toLocaleLowerCase() === "" && this.searchDepartment === "") {
      this.showedList = this.Hired
      this.searchName = searchQuery
      return
    }
        
    this.Hired.forEach(element => {
      if(this.searchDepartment.toLocaleLowerCase() === ""){
        if (element.name.toLocaleLowerCase().includes(searchQuery)) {
          personList.push(element);          
        }
      }
      else{
        if (element.name.toLocaleLowerCase().includes(searchQuery) && element.department?.name.toLocaleLowerCase().includes(this.searchDepartment.toLocaleLowerCase())) {
          personList.push(element);
        }
      }
    });
    this.showedList = personList
    this.searchName = searchQuery;
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }   

    this.showedList = this.showedList.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'HiredName':
          return this.compare(a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
        case 'Initials':
          return this.compare(a.initials.toLocaleLowerCase(), b.initials.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredDepartment':
          return this.compare(a.department?.name.toLocaleLowerCase(), b.department?.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredLocation':
          return this.compare(a.location?.name.toLocaleLowerCase(), b.location?.name.toLocaleLowerCase())  * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredEndDate':
          return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredSVU':
          return this.compare(a.svuEligible, b.svuEligible) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredModules':
          return this.compare(a.personCourses.filter(x => x.status === 3).length, b.personCourses.filter(x => x.status === 3).length) * (sort.direction == 'asc' ? 1 : -1);
        default:
          return 0;
      }
    });
  }

  compare(itemA: any, itemB: any): number {
    let retVal: number = 0;
    if (itemA && itemB) {
      if (itemA > itemB) retVal = 1;
      else if (itemA < itemB) retVal = -1;
    }
    else if (itemA) retVal = 1;
    else if (itemB) retVal = -1;
    return retVal;
  }

  onDepartmentFilterChanged(selectedDepartments: any[]) {
    this.filteredDepartments = selectedDepartments;
    this.filterPersons();
  }

  onLocationFilterChanged(selectedLocations: any[]) {
    this.filteredLocations = selectedLocations;
    this.filterPersons();
  }

  private filterPersons() {
    // Filter the 'Hired' array of persons based on the selected departments and locations
    this.showedList = this.Hired.filter(person => {
      
      // Check if the person's department matches any of the selected departments
      const departmentFilter =
        this.filteredDepartments.length === 0 || this.filteredDepartments.some(dep => dep.departmentId === person.departmentId);
  
      // Check if the person's location matches any of the selected locations
      const locationFilter =
        this.filteredLocations.length === 0 || this.filteredLocations.some(loc => loc.locationId === person.locationId);
  
      // If both department and location filters are empty, include all persons
      if (this.filteredDepartments.length === 0 && this.filteredLocations.length === 0) {
        return true;
      }
  
      // If only the department filter is applied, include persons that match the selected departments
      if (this.filteredDepartments.length !== 0 && this.filteredLocations.length === 0) {
        return departmentFilter;
      }
  
      // If only the location filter is applied, include persons that match the selected locations
      if (this.filteredDepartments.length === 0 && this.filteredLocations.length !== 0) {
        return locationFilter;
      }
  
      // If both department and location filters are applied, include persons that match any of the selected departments or any of the selected locations
      return departmentFilter && locationFilter;
    });
  }
}

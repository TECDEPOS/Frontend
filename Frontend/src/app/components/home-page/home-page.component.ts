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
import { User } from 'src/app/Models/User';
import { MultiDropdownComponent } from '../Misc/multi-dropdown/multi-dropdown.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent extends Unsub {
  departments: Department[] = [];
  locations: Location[] = [];
  operationCoordinators: User[] = [];
  educationalConsultants: User[] = [];
  filteredDepartments: Department[] = [];
  filteredLocations: Location[] = [];
  filteredCoordinators: User[] = [];
  filteredConsultants: User[] = [];
  filteredPersons: Person[] = [];
  Hired: Person[] = [];
  showedList: Person[] = [];
  completedModules: number = 0;
  pickedDepartment: string = "";
  searchName: string = "";
  alle: string = "";
  @ViewChildren('progress') progress: QueryList<ElementRef> = new QueryList
  @ViewChildren(MultiDropdownComponent) dropdowns: QueryList<MultiDropdownComponent> = new QueryList();

  constructor(
    private peronService: PersonsService,
    private departmentService: DepartmentsService,
    private locationService: LocationsService,
    private userService: UserService
  ) { super(); }

  ngOnInit(): void {
    this.getTableData()
  }

  ngAfterViewInit(): void {
    this.progress.changes.subscribe(elm => {
      this.progressBar()
    })
  }

  // Calculate progress bar percentage and apply styles based on date ranges
  progressBar(): void {
    this.Hired.forEach(person => {
      let objec = this.progress.find(x => x.nativeElement.id == person.personId);
      let howManyDaysInTotal = (new Date(person!.endDate).getTime() / 1000 - new Date(person!.hiringDate).getTime() / 1000) / 86400;
      let howManyDaysSinceStart = (new Date().getTime() / 1000 - new Date(person!.hiringDate).getTime() / 1000) / 86400;
      let inProcent = 0;

      if (howManyDaysSinceStart < 0) {
        howManyDaysSinceStart = 0;
      }

      if (new Date().getTime() / 1000 < new Date(person!.endDate).getTime() / 1000) {
        inProcent = (howManyDaysSinceStart / howManyDaysInTotal) * 100;
      } else {
        inProcent = 100;
      }

      if (objec === undefined) {
        return;
      }

      objec!.nativeElement.style.width = inProcent + "%";
      if (inProcent < 75) {
        objec!.nativeElement.style.backgroundColor = "rgba(0, 128, 0, 0.30)";
      }
      if (inProcent > 75 && inProcent < 90) {
        objec!.nativeElement.style.backgroundColor = "rgba(255, 255, 0, 0.30)";
      }
      if (inProcent > 90) {
        objec!.nativeElement.style.backgroundColor = "rgba(255, 0, 0, 0.30)";
      }
    });
  }

  // Fun method to find the halfway point of an education period
  findHalf() {
    var start = 1596441600,
      slut = 1755158400,
      mid = slut - ((slut - start) / 2);
    console.log(mid);
  }

  // Retrieve department data from the department service
  getDepartmentData() {
    this.departmentService.getDepartment().subscribe(res => {
      this.departments = res;
    });
  }

  // Retrieve location data from the location service
  getLocationData() {
    this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations = res;
    });
  }

  // Retrieve user data and filter by roles for coordinators and consultants
  getUserFilters() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.operationCoordinators = res.filter(x => x.userRole === 6);
      this.educationalConsultants = res.filter(x => x.userRole === 4);
    });
  }

  // Retrieve table data, process modules, and apply filters
  getTableData() {
    this.peronService.getPersons().subscribe(res => {
      this.Hired = res;
      this.Hired.forEach(element => {
        element.completedModules = this.modulesCompleted(element);
      });

      this.getDepartmentData();
      this.getLocationData();
      this.getUserFilters();
      this.Hired.sort((a, b) => a.name.localeCompare(b.name));
      this.showedList = this.Hired;
      this.filteredPersons = this.Hired;
    });
  }

  // Count the number of completed modules for a person
  modulesCompleted(person: Person) {
    return person.personCourses.filter(x => x.status === 3).length;
  }

  // Sort table data based on user selection
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
          return this.compare(a.location?.name.toLocaleLowerCase(), b.location?.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
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

  // Compare two items for sorting
  compare(itemA: any, itemB: any): number {
    let retVal: number = 0;
    if (itemA && itemB) {
      if (itemA > itemB) retVal = 1;
      else if (itemA < itemB) retVal = -1;
    } else if (itemA) retVal = 1;
    else if (itemB) retVal = -1;
    return retVal;
  }

  // Filter the table data based on selected departments
  onDepartmentFilterChanged(selectedDepartments: any[]) {
    this.filteredDepartments = selectedDepartments;
    this.filterTable();
  }

  // Filter the table data based on selected locations
  onLocationFilterChanged(selectedLocations: any[]) {
    this.filteredLocations = selectedLocations;
    this.filterTable();
  }

  // Filter the table data based on selected coordinators
  onCoordinatorFilterChanged(selectedCoordinators: any[]) {
    this.filteredCoordinators = selectedCoordinators;
    this.filterTable();
  }

  // Filter the table data based on selected consultants
  onConsultantFilterChanged(selectedConsultants: any[]) {
    this.filteredConsultants = selectedConsultants;
    this.filterTable();
  }

  // Reset all applied filters and dropdown selections
  resetFilters() {
    this.filteredDepartments = [];
    this.filteredLocations = [];
    this.filteredCoordinators = [];
    this.filteredConsultants = [];
    // Removes the selection from each dropdown.
    this.dropdowns.forEach(dropdown => dropdown.resetSelectionValues());
    this.filterTable();
  }

  // Update the displayed list of persons based on the search query input
  onSearchQueryInput() {
    if (this.searchName == '') {
      this.showedList = this.filteredPersons;
    } else {
      this.showedList = this.filteredPersons.filter(person => person.name.toLowerCase().includes(this.searchName.toLowerCase()));
    }
  }

  // Apply filters to the list of persons based on department, location, coordinator, and consultant filters
  private filterTable() {
    this.filteredPersons = this.Hired.filter(person => {
      // Check if the person's department matches any of the selected departments
      const departmentFilter =
        this.filteredDepartments.length === 0 || this.filteredDepartments.some(dep => dep.departmentId === person.departmentId);

      // Check if the person's location matches any of the selected locations
      const locationFilter =
        this.filteredLocations.length === 0 || this.filteredLocations.some(loc => loc.locationId === person.locationId);

      // Check if the person's coordinator matches any of the selected coordinators
      const coordinatorFilter =
        this.filteredCoordinators.length === 0 || this.filteredCoordinators.some(coord => coord.userId === person.operationCoordinatorId);

      // Check if the person's consultant matches any of the selected consultants
      const consultantFilter =
        this.filteredConsultants.length === 0 || this.filteredConsultants.some(ec => ec.userId === person.educationalConsultantId);

      // If all filters are empty, include all persons
      if (
        this.filteredDepartments.length === 0 &&
        this.filteredLocations.length === 0 &&
        this.filteredCoordinators.length === 0 &&
        this.filteredConsultants.length === 0
      ) {
        return true;
      }

      // Include persons that match the selected departments
      if (
        this.filteredDepartments.length !== 0 &&
        this.filteredLocations.length === 0 &&
        this.filteredCoordinators.length === 0 &&
        this.filteredConsultants.length === 0
      ) {
        return departmentFilter;
      }

      // Include persons that match the selected locations
      if (
        this.filteredDepartments.length === 0 &&
        this.filteredLocations.length !== 0 &&
        this.filteredCoordinators.length === 0 &&
        this.filteredConsultants.length === 0
      ) {
        return locationFilter;
      }

      // Include persons that match the selected coordinators
      if (
        this.filteredDepartments.length === 0 &&
        this.filteredLocations.length === 0 &&
        this.filteredCoordinators.length !== 0 &&
        this.filteredConsultants.length === 0
      ) {
        return coordinatorFilter;
      }

      // Include persons that match the selected consultants
      if (
        this.filteredDepartments.length === 0 &&
        this.filteredLocations.length === 0 &&
        this.filteredCoordinators.length === 0 &&
        this.filteredConsultants.length !== 0
      ) {
        return consultantFilter;
      }

      // Include persons that match any of the selected departments, locations, coordinators, or consultants
      return departmentFilter && locationFilter && coordinatorFilter && consultantFilter;
    });
    this.onSearchQueryInput();
  }
}

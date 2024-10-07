import { Component } from '@angular/core';
import { Course } from 'src/app/Models/Course';
import { CourseType } from 'src/app/Models/CourseType';
import { Module } from 'src/app/Models/Module';
import { Person } from 'src/app/Models/Person';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { Status } from 'src/app/Models/Status';
import { User } from 'src/app/Models/User';
import { UserRole } from 'src/app/Models/UserRole';
import { BossViewModel, LeaderViewModel } from 'src/app/Models/ViewModels/BossViewModel';
import { ModuleWithCourseViewModel } from 'src/app/Models/ViewModels/ModuleWithCourseViewModel';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-export-to-excel',
  templateUrl: './export-to-excel.component.html',
  styleUrls: ['./export-to-excel.component.css']
})
export class ExportToExcelComponent {
  newBossHeader: boolean = true;
  newLeaderHeader: boolean = true;
  newEducatorHeader: boolean = true;
  newModuleHeader: boolean = true;
  newCourseHeader: boolean = true;
  rowCounter: number = 0
  headerRows: number[] = [];
  courseHeaderRows: number[] = [];
  workSheetData: any[] = [];
  workSheet: any;
  excelModules: ModuleWithCourseViewModel[] = [];
  bossHeaders: string[] = ['Uddannelseschef', 'Navn', 'Role'];
  leaderHeaders: string[] = ['Uddannelsesleder', 'Navn', 'Role']
  educatorHeaders: string[] = ['Underviser', 'Navn', 'Initialer', 'Afdeling', 'Lokation', 'Slut dato', 'Færdige moduler']
  personCourseHeaders: string[] = ['Kurser', 'Navn', 'Type', 'Start dato', 'Slut dato', 'Status']
  moduleHeaders: string[] = ['Mudul', 'Navn'];
  courseHeaders: string[] = ['Kursus', 'Type', 'Start dato', 'Slut dato']
  courseEducatorHeader: string[] = ['Underviser', 'Navn', 'Initialer', 'Afdeling', 'Lokation', 'Status'];

  constructor() {
  }

  // Method to convert and assign education leaders to each boss
  bossViewModelConverter(bosses: BossViewModel[], leaders: LeaderViewModel[]): BossViewModel[] {
    bosses.forEach(boss => {
      // Filter leaders based on the educationBossId
      boss.educationLeaders = leaders.filter(x => x.educationBossId == boss.userId);
    });
    return bosses;
  }

  // Helper function to remove specific courses from the original list
  removeCoursesFromList(courses: Course[], coursesToRemove: Course[]) {
    coursesToRemove.forEach(course => {
      // Find the index of the course to be removed
      const index = courses.findIndex(c => c.courseId === course.courseId);
      if (index !== -1) {
        // Remove the course if found
        courses.splice(index, 1);
      }
    });
  }

  // Method to export modules data to Excel
  exportModulesToExcel(modules: ModuleWithCourseViewModel[]) {
    this.moduleWorkSheetData(modules);
    this.exportWorkSheetToExcel();
  }

  // Method to export course data to Excel
  exportCoursesToExcel(course: Course[]) {
    this.courseWorkSheetData(course);
    this.exportWorkSheetToExcel();
  }

  // Method to export bosses data to Excel
  exportBossesToExcel(bosses: BossViewModel[]) {
    this.bossesWorkSheetData(bosses);
    this.exportWorkSheetToExcel();
  }

  // Method to export leaders data to Excel
  exportLeadersToExcel(educationLeaders: LeaderViewModel[]) {
    this.leadersWorkSheetData(educationLeaders);
    this.exportWorkSheetToExcel();
  }

  // Method to export educator data to Excel
  exportEducatorsToExcel(educators: Person[]) {
    this.educatorsWorkSheetData(educators);
    this.exportWorkSheetToExcel();
  }

  // Method to convert and export the worksheet to an Excel file
  exportWorkSheetToExcel() {
    this.workSheet = XLSX.utils.aoa_to_sheet(this.workSheetData);
    this.excelStyling();
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, this.workSheet, 'Sheet1');
    XLSX.writeFile(wb, 'ScoreSheet.xlsx');
  }

  // Method to prepare worksheet data for bosses
  bossesWorkSheetData(bosses: BossViewModel[]) {
    bosses.forEach(boss => {
      if (this.newBossHeader) {
        this.workSheetData.push(this.bossHeaders);
        this.headerRows.push(this.rowCounter);
        this.newRow();
        this.newBossHeader = false;
      }
      this.newLeaderHeader = true;

      const bossData = ['', boss.name, UserRole[boss.userRole]];
      this.workSheetData.push(bossData);
      this.newRow();

      if (boss.educationLeaders.length > 0) {
        this.leadersWorkSheetData(boss.educationLeaders);
      }
    });
  }

  // Method to prepare worksheet data for leaders
  leadersWorkSheetData(educationLeaders: LeaderViewModel[]) {
    educationLeaders.forEach(leader => {
      if (this.newLeaderHeader) {
        this.workSheetData.push(this.leaderHeaders);
        this.headerRows.push(this.rowCounter);
        this.newRow();
        this.newLeaderHeader = false;
      }
      this.newBossHeader = true;
      this.newEducatorHeader = true;

      const leaderData = ['', leader.name, UserRole[leader.userRole]];
      this.workSheetData.push(leaderData);
      this.newRow();

      if (leader.educators.length > 0) {
        this.educatorsWorkSheetData(leader.educators);
      }
    });
  }

  // Method to prepare worksheet data for educators
  educatorsWorkSheetData(educators: Person[]) {
    educators.forEach(educator => {
      if (this.newEducatorHeader) {
        this.workSheetData.push(this.educatorHeaders);
        this.headerRows.push(this.rowCounter);
        this.newRow();
        this.newEducatorHeader = false;
      }
      this.newLeaderHeader = true;
      this.newBossHeader = true;

      let finishedCourses = this.educatorsFinishedCourses(educator.personCourses);

      const educatorData = ['', educator.name, educator.initials, educator.department?.name, educator.location?.name, new Date(educator.endDate).toLocaleDateString(), finishedCourses];
      this.workSheetData.push(educatorData);
      this.newRow();

      if (educator.personCourses.length > 0) {
        this.workSheetData.push(this.personCourseHeaders);
        this.headerRows.push(this.rowCounter);
        this.newRow();
        this.newEducatorHeader = true;
        this.newLeaderHeader = true;

        educator.personCourses.forEach(personCourse => {
          const courseData = [
            '',
            personCourse.course?.module.name,
            CourseType[personCourse.course!.courseType], new Date(personCourse.course!.startDate).toLocaleDateString(), new Date(personCourse.course!.endDate).toLocaleDateString(),
            Status[personCourse.status].replaceAll('_', ' ')
          ];
          this.workSheetData.push(courseData);
          this.newRow();
        });
      }
    });
  }

  // Method to calculate the number of finished courses for an educator
  educatorsFinishedCourses(personCourses: PersonCourse[]): number {
    let finishedCourses = 0;
    personCourses.forEach(personCourse => {
      if (personCourse.status == 3) {
        finishedCourses++;
      }
    });
    return finishedCourses;
  }

  // Method to prepare worksheet data for modules
  moduleWorkSheetData(modules: ModuleWithCourseViewModel[]) {
    modules.forEach(module => {
      if (this.newModuleHeader) {
        this.workSheetData.push(this.moduleHeaders);
        this.headerRows.push(this.rowCounter);
        this.newModuleHeader = false;
        this.newRow();
      }
      this.newCourseHeader = true;
      this.newEducatorHeader = true;

      const moduleData = ['', module.name];
      this.workSheetData.push(moduleData);
      this.newRow();

      if (module.courses.length > 0) {
        this.courseWorkSheetData(module.courses);
      }
    });
  }

  // Method to prepare worksheet data for courses
  courseWorkSheetData(courses: Course[]) {
    courses.forEach(course => {
      if (this.newCourseHeader) {
        this.workSheetData.push(this.courseHeaders);
        this.headerRows.push(this.rowCounter);
        this.newCourseHeader = false;
        this.newRow();
      }
      this.newModuleHeader = true;
      this.newEducatorHeader = true;

      const courseData = ['', course.courseType, course.startDate, course.endDate];
      this.workSheetData.push(courseData);
      this.newRow();

      if (course.personCourses.length > 0) {
        this.workSheetData.push(this.courseEducatorHeader);
        this.headerRows.push(this.rowCounter);
        this.newModuleHeader = true;
        this.newCourseHeader = true;
        this.newRow();

        course.personCourses.forEach(personCourse => {
          const educatorData = [
            '',
            personCourse.person!.name, personCourse.person!.initials,
            personCourse.person!.department!.name, personCourse.person!.location!.name,
            personCourse.status
          ];
        });
      }
    });
  }

  // Method to style the Excel sheet with borders, alignment, and fonts
  excelStyling() {
    this.workSheet['!cols'] = [{ wch: 20 }, { wch: 60 }, { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 20 }];

    for (var i in this.workSheet) {
      if (typeof this.workSheet[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);
      let r = cell.r;
      let c = cell.c;

      this.workSheet[i].s = {
        // Styling for all cells
        font: {
          name: 'arial',
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1', // Enables text wrapping
        },
        border: {
          top: {
            style: 'thin',
            color: '000000',
          },
          bottom: {
            style: 'thin',
            color: '000000',
          },
          right: {
            style: 'thin',
            color: '000000',
          },
          left: {
            style: 'thin',
            color: '000000',
          },
        },
      };

      if (c == 0) {
        this.workSheet[i].s.font.bold = true;
      }

      if (r == 0) {
        // First row styling
        this.workSheet[i].s.border.bottom = {
          style: 'thin',
          color: '000000',
        };
      }

      if (this.headerRows.includes(r)) {
        // Header row background color
        this.workSheet[i].s.fill = {
          patternType: 'solid',
          fgColor: { rgb: 'b2b2b2' },
          bgColor: { rgb: 'b2b2b2' },
        };
      }
    }
  }

  // Method to increment the row counter for the worksheet
  newRow() {
    this.rowCounter++;
  }
}

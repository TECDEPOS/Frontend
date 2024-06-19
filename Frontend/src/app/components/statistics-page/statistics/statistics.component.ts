import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { takeUntil } from 'rxjs';
import { Module } from 'src/app/Models/Module';
import { ModuleService } from 'src/app/Services/module.service';
import { PersonsService } from 'src/app/Services/persons.service';
import { Unsub } from 'src/app/classes/unsub';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent extends Unsub {
  modules: Module[] = [];
  selectedGraph: Number = 1;
  chart: any = null;

  //Bar graph
  departmentNames: string[] = [];
  teacherCount: number[] = [];
  //----------



  constructor(
    private moduleService: ModuleService, 
    private personService: PersonsService
    ) 
    {
      super();
      Chart.register(...registerables);
    }

  ngOnInit(){
    this.moduleService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.modules = results;
      console.log(this.modules);
    });
  }

  switchGraph(graphNumber: number){
    this.selectedGraph = graphNumber;

    //Destroy existing charts to prevent errors
    if (this.chart) {
      this.chart.destroy();
    }

    switch (graphNumber) {
      case 1:
        // this.setupBarChart();
        break;
    
      default:
        break;
    }
  }


  onBarChartModuleChange(selectedModule: Module) {
    this.personService.getPersonsPerDepartmentFromModule(selectedModule.moduleId).pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.departmentNames = results.map(x => x.departmentName);
      this.teacherCount = results.map(x => x.teacherCount);


      if (this.chart) {
        this.chart.destroy();
      }
      this.setupBarChart();
    })
  }

  setupBarChart() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.departmentNames,
        datasets: [
          {
            label: 'Undervisere per afdeling for valgte modul',
            data: this.teacherCount
          },
        ],
      },
      //The options are for customizing the appearance and how the chart acts
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              // Display labels on Y-axis with no decimals
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          },
          x: {
            ticks: {
              autoSkip: false //Don't hide labels when resizing
            }
          }
        }
      }
    });
  }
}



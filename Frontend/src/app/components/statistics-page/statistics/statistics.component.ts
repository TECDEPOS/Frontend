import { Component, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { takeUntil } from 'rxjs';
import { Module } from 'src/app/Models/Module';
import { ModuleService } from 'src/app/Services/module.service';
import { PersonCourseService } from 'src/app/Services/person-course.service';
import { PersonsService } from 'src/app/Services/persons.service';
import { Unsub } from 'src/app/classes/unsub';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent extends Unsub implements OnDestroy {
  selectedModule: Module | null = null;
  modules: Module[] = [];
  selectedGraphType: number = 1;
  selectedBarChart: number = 1;
  selectedPieChart: number = 1;
  barChart: any = null;
  finishedPieChart: Chart<'pie'> | null = null;
  unfinishedPieChart: Chart<'pie'> | null = null;
  chartInstances: { [key: string]: Chart } = {};


  //Bar graph
  departmentNames: string[] = [];
  teacherCount: number[] = [];

  //Pie chart
  unfinishedStatuses: string[] = [];
  unfinishedPersonCount: number[] = [];
  finishedStatuses: string[] = [];
  finishedPersonCount: number[] = [];

  // pieChartOptions = 2

  constructor(
    private moduleService: ModuleService,
    private personService: PersonsService,
    private personCourseService: PersonCourseService
  ) {
    super();
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.moduleService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.modules = results;
      console.log(this.modules);
    });
  }

  destroyChart(chart: any | null) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  }

  switchGraph(graphNumber: number) {
    // Destroy existing charts using the old selection value
    if (this.selectedModule) {
      this.destroyCharts(this.selectedGraphType);
    }

    // Update selectedGraph to the new selection value.
    this.selectedGraphType = graphNumber;

    // Fetch new data for the selected graph if a module is already selected
    if (this.selectedModule) {
      this.fetchChartData(this.selectedModule.moduleId, this.selectedGraphType);
    }
  }

  onModuleChange(selectedModule: Module) {
    // Destroy existing charts to prevent errors
    if (this.selectedModule) {
      this.destroyCharts(this.selectedGraphType);
    }

    this.selectedModule = selectedModule;
    this.fetchChartData(selectedModule.moduleId, this.selectedGraphType);
  }

  fetchChartData(moduleId: number, graphNumber: number) {
    switch (graphNumber) {
      case 1:
        this.getBarChartData(moduleId);
        break;
      case 2:
        this.getCourseStatusPieChartData(moduleId);
        break;
      default:
        break;
    }
  }

  destroyCharts(graphNumber: number) {
    switch (graphNumber) {
      case 1:
        if (this.barChart) {
          this.destroyChart(this.barChart);
        }
        break;
      case 2:
        if (this.unfinishedPieChart) {
          this.destroyChart(this.unfinishedPieChart);
        }
        if (this.finishedPieChart) {
          this.destroyChart(this.finishedPieChart);
        }
        break;
      default:
        break;
    }
  }

  pieChartChanged(pieSelected: number) {
    console.log('pieChartChanged: ', pieSelected);
    
    switch (pieSelected) {
      case 1:
        if (this.selectedModule) {
          this.getCourseStatusPieChartData
        }
        break;
      case 2:
        this.getDepartmentLocationPieChartData();
        break;
      default:
        break;
    }
  }

  getBarChartData(moduleId: number) {
    this.personService.getPersonsPerDepartmentFromModule(moduleId).pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.departmentNames = results.map(x => x.departmentName);
      this.teacherCount = results.map(x => x.teacherCount);
      this.setupBarChart();
    })
  }

  getCourseStatusPieChartData(moduleId: number) {
    this.personCourseService.getCourseStatusCount(moduleId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        // Filter the results where StatusId is less than 2
        const filteredResultsLessThan2 = results.filter((x: any) => x.statusId < 2);

        // Filter the results where StatusId is 2 or above
        const filteredResults2AndAbove = results.filter((x: any) => x.statusId >= 2);

        // Map the filtered results to unfinished statuses and their personCount for StatusId less than 2
        this.unfinishedStatuses = filteredResultsLessThan2.map((x: any) => x.courseStatus);
        this.unfinishedPersonCount = filteredResultsLessThan2.map((x: any) => x.personCount);

        // Map the filtered results to finished statuses and their personCount for StatusId 2 and above
        this.finishedStatuses = filteredResults2AndAbove.map((x: any) => x.courseStatus);
        this.finishedPersonCount = filteredResults2AndAbove.map((x: any) => x.personCount);

        this.setupPieChart();
      });
  }

  getDepartmentLocationPieChartData(){

  }

  //Make sure to destroy chart when leaving page. 
  //Call Unsub's ngOnDestroy to make takeUntil approach still work after overriding here.
  override ngOnDestroy() {
    this.destroyChart(this.barChart);
    this.destroyChart(this.unfinishedPieChart);
    this.destroyChart(this.finishedPieChart);
    super.ngOnDestroy();
  }

  setupBarChart() {
    this.barChart = new Chart('canvas1', {
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
              callback: function (value) {
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

  setupPieChart() {
    // Replace underscores with space for both statuses
    const replaceUnderscores = (status: string) => status.replace(/_/g, ' ');
    this.finishedStatuses = this.finishedStatuses.map(replaceUnderscores);
    this.unfinishedStatuses = this.unfinishedStatuses.map(replaceUnderscores);

    // Calculate total sum of personCount for percentage tooltips
    const totalFinished = this.finishedPersonCount.reduce((acc, val) => acc + val, 0);
    const totalUnfinished = this.unfinishedPersonCount.reduce((acc, val) => acc + val, 0);

    // Create pie charts
    this.unfinishedPieChart = this.createPieChart('canvas2', this.unfinishedStatuses, this.unfinishedPersonCount, ['rgb(221, 221, 221)', 'rgb(54, 162, 235)'], totalUnfinished);
    this.finishedPieChart = this.createPieChart('canvas3', this.finishedStatuses, this.finishedPersonCount, ['rgb(255, 0, 0)', 'rgb(0, 128, 0)', 'rgb(255, 153, 0)'], totalFinished);
  }

  // Creates pie charts using these options, saves a lot of repeat chart configs for pies.
  createPieChart(canvasId: string, labels: string[], data: number[], backgroundColors: string[], total: number): Chart<'pie'> {
    const chart = new Chart(canvasId, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Antal',
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 4
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw as number;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';
                return 'Antal: ' + value + ' (' + percentage + ')';
              }
            }
          }
        },
        animation: {
          onComplete: () => {
            if (total === 0) {
              const ctx = chart.ctx;
              const width = chart.width;
              const height = chart.height;

              ctx.save();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '20px Arial';
              ctx.fillStyle = 'gray';
              ctx.fillText('No data', width / 2, height / 2);
              ctx.restore();
            }
          }
        }
      }
    });

    return chart;
  };
}



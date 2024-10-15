import { Component, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { takeUntil } from 'rxjs';
import { Module } from 'src/app/Models/Module';
import { ModuleService } from 'src/app/Services/module.service';
import { StatisticsService } from 'src/app/Services/statistics.service';
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
  leftPieChart: Chart<'pie'> | null = null;
  rightPieChart: Chart<'pie'> | null = null;

  //Bar chart
  barChartLabels: string[] = [];
  barChartData: number[] = [];

  //Pie chart
  leftPieLabels: string[] = [];
  leftPieData: number[] = [];
  rightPieLabels: string[] = [];
  rightPieData: number[] = [];

  constructor(
    private moduleService: ModuleService,
    private statisticsService: StatisticsService
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
      console.log('Chart before destroying: ', chart);
      
      chart.destroy();
      chart = null;
      console.log('Chart after destroying: ', chart);
      // console.log('Chart was actually destroyed');
    }
  }

  switchGraph(graphNumber: number) {    
    // Destroy existing charts using the old selection value
    console.log('destroyCharts called from switchGraph()');
      this.destroyCharts(this.selectedGraphType);
      

    // Update selectedGraph to the new selection value.
    this.selectedGraphType = graphNumber;

    // Get data based on selected modules and selected Chart
    this.fetchChartData();
  }

  onModuleChange(selectedModule: Module) {
    // Destroy existing charts to prevent errors
    if (this.selectedModule) {
      console.log('destroyCharts called from onModuleChange()');
      this.destroyCharts(this.selectedGraphType);
    }

    this.selectedModule = selectedModule;
    this.fetchChartData();
  }

  fetchChartData() {    
    switch (this.selectedGraphType) {
      case 1:
        if (this.selectedBarChart === 1 && this.selectedModule) {
          this.getPersonsPerDepartmentFromModuleBarChart(this.selectedModule.moduleId);
        }
        else if (this.selectedBarChart === 2){
          this.getPersonsPerDepartmentBarChart();
        }
        else if (this.selectedBarChart === 3){
          this.getPersonsPerLocationBarChart();
        }
        break;
      case 2:
        // this.destroyCharts(2);
        if (this.selectedPieChart === 1 && this.selectedModule) {
          this.getCourseStatusPieChartData(this.selectedModule.moduleId);
        }
        break;
      default:
        break;
    }
  }

  destroyCharts(graphNumber: number) {
    switch (graphNumber) {
      case 1:
        if (this.barChart) {
          console.log('Destroying Bar Chart');          
          this.destroyChart(this.barChart);
        }
        break;
      case 2:
        if (this.leftPieChart) {
          console.log('Destroying Left Pie Chart');
          this.destroyChart(this.leftPieChart);
          
        }
        if (this.rightPieChart) {
          console.log('Destroying Right Pie Chart');
          this.destroyChart(this.rightPieChart);
          
        }
        break;
      default:
        break;
    }
  }

  getPersonsPerDepartmentFromModuleBarChart(moduleId: number) {
    this.statisticsService.getPersonsPerDepartmentFromModule(moduleId).pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.barChartLabels = results.map(x => x.departmentName);
      this.barChartData = results.map(x => x.teacherCount);
      this.setupBarChart(this.barChartLabels, this.barChartData, 'Undervisere per afdeling for valgte modul');
    })
  }

  getPersonsPerDepartmentBarChart(){
    this.statisticsService.getPersonsPerDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.barChartLabels = results.map(x => x.departmentName);
      this.barChartData = results.map(x => x.teacherCount);
      this.setupBarChart(this.barChartLabels, this.barChartData, 'Undervisere per afdeling');
    })
  }

  getPersonsPerLocationBarChart(){
    this.statisticsService.getPersonsPerLocation().pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.barChartLabels = results.map(x => x.locationName);
      this.barChartData = results.map(x => x.teacherCount);
      this.setupBarChart(this.barChartLabels, this.barChartData, 'Undervisere per lokation');
    })
  }

  getCourseStatusPieChartData(moduleId: number) {
    this.statisticsService.getCourseStatusCount(moduleId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        // Filter the results where StatusId is less than 2
        const filteredResultsLessThan2 = results.filter((x: any) => x.statusId < 2);

        // Filter the results where StatusId is 2 or above
        const filteredResults2AndAbove = results.filter((x: any) => x.statusId >= 2);

        // Map the filtered results to unfinished statuses and their personCount for StatusId less than 2
        this.leftPieLabels = filteredResultsLessThan2.map((x: any) => x.courseStatus);
        this.leftPieData = filteredResultsLessThan2.map((x: any) => x.personCount);

        // Map the filtered results to finished statuses and their personCount for StatusId 2 and above
        this.rightPieLabels = filteredResults2AndAbove.map((x: any) => x.courseStatus);
        this.rightPieData = filteredResults2AndAbove.map((x: any) => x.personCount);

        // Replace underscores with space for both statuses
        const replaceUnderscores = (status: string) => status.replace(/_/g, ' ');
        this.leftPieLabels = this.leftPieLabels.map(replaceUnderscores);
        this.rightPieLabels = this.rightPieLabels.map(replaceUnderscores);

        this.setupPieChart();
      });
  }

  //Make sure to destroy chart when leaving page. 
  //Call Unsub's ngOnDestroy to make takeUntil approach still work after overriding here.
  override ngOnDestroy() {
    this.destroyChart(this.barChart);
    this.destroyChart(this.leftPieChart);
    this.destroyChart(this.rightPieChart);
    super.ngOnDestroy();
  }

  setupBarChart(labels: string[], data: number[], dataLabel: string) {
    this.destroyCharts(1);
    this.barChart = new Chart('canvas1', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: dataLabel,
            data: data
          },
        ],
      },
      //The options are for customizing the appearance and how the chart acts
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
    // Calculate total sum of personCount for percentage tooltips
    const totalLeft = this.leftPieData.reduce((acc, val) => acc + val, 0);
    const totalRight = this.rightPieData.reduce((acc, val) => acc + val, 0);

    // Create pie charts
    this.leftPieChart = this.createPieChart('canvas2', this.leftPieLabels, this.leftPieData, ['rgb(221, 221, 221)', 'rgb(54, 162, 235)'], totalLeft);
    this.rightPieChart = this.createPieChart('canvas3', this.rightPieLabels, this.rightPieData, ['rgb(255, 0, 0)', 'rgb(0, 128, 0)', 'rgb(255, 153, 0)'], totalRight);
  }

  // Creates pie charts using these options, saves a lot of repeat chart configs for pies.
  createPieChart(canvasId: string, labels: string[], data: number[], backgroundColors: string[], total: number): Chart<'pie'> {
    console.log('Start of createPieChart');
    console.log('Left pieChart: ', this.leftPieChart);
    console.log('Right pieChart: ', this.rightPieChart);
    
    
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
            // Move logic outside the chart initialization
            setTimeout(() => this.checkForEmptyData(chart, total), 0);
            // if ((chart) && total === 0) {
            //   const ctx = chart.ctx;
            //   const width = chart.width;
            //   const height = chart.height;

            //   ctx.save();
            //   ctx.textAlign = 'center';
            //   ctx.textBaseline = 'middle';
            //   ctx.font = '20px Arial';
            //   ctx.fillStyle = 'gray';
            //   ctx.fillText('Ingen data', width / 2, height / 2);
            //   ctx.restore();
            // }
          }
        }
      }
    });
    
    return chart;
  };

  // Separate function to check for empty data and draw custom text if necessary
checkForEmptyData(chart: Chart<'pie'>, total: number) {
  if (total === 0 && chart) {
    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '20px Arial';
    ctx.fillStyle = 'gray';
    ctx.fillText('Ingen data', width / 2, height / 2);
    ctx.restore();
  }
}
}



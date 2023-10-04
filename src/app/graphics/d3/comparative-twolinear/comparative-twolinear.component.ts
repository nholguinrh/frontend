import { Component, ElementRef, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-comparative-twolinear',
  templateUrl: './comparative-twolinear.component.html',
  styleUrls: ['./comparative-twolinear.component.css'],
})
export class ComparativeTwolinearComponent implements OnInit {
  private _data: LineChartModel[] = [];
  @Input() set data(val: LineChartModel[]) {
    this._data = val;
    this.update();
  }
  get data(): LineChartModel[] {
    return this._data;
  }

  @Input('xLabels') public xLabels: string[] = [];
  @Input('showDots') public showDots: boolean = false;
  @Input('dateFormat') format = '%Y';
  private dataAdaptedToD3Js = [];
  public svg;
  public domainMaxRange: number = 0;
  public domainMinRange: number = 0;
  public dateFormat: Function;

  private _isInitiated: boolean = false;

  private margin = { top: 70, right: 200, bottom: 270, left: 130 };
  private width = 950 - this.margin.left - this.margin.right;
  private height = 700 - this.margin.top - this.margin.bottom;

  constructor(public chartElem: ElementRef) {
    this.dateFormat = d3.timeFormat(this.format);
  }

  ngOnInit(): void {
    if (this.data.length < 10) {
      this.xLabels = this.covertToDate(this.xLabels);
      this.data[0].data.forEach((_element, index) => {
        let objectAdapted = { label: this.xLabels[index] };
        for (let i = 0; i < this.data.length; i++) {
          objectAdapted[this.data[i].label] = this.data[i].data[index];
          if (this.domainMaxRange < this.data[i].data[index]) {
            this.domainMaxRange = this.data[i].data[index];
          }
          if (this.domainMinRange > this.data[i].data[index]) {
            this.domainMinRange = this.data[i].data[index];
          }
        }
        this.dataAdaptedToD3Js.push(objectAdapted);
      });

      this.draw();
    }
  }

  private covertToDate(array: any[]) {
    array = array.map((element) => {
      let date = new Date(element);
      return date;
    });
    return array;
  }

  draw() {
    // append the svg object to the body of the page
    let svg = d3
      .select('#my_dataviz')
      .append('svg')
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin.left + this.margin.right} ${
          this.height + this.margin.top + this.margin.bottom
        }`
      )
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    // A color scale: one color for each group
    let myColor = {};
    // List of groups (here I have one group per column)
    let allGroup = [];
    for (let i = 0; i < this.data.length; i++) {
      allGroup.push(this.data[i].label);
      myColor[this.data[i].label] = this.data[i].color;
    }

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.forEach((grpName) => {
      this.dataAdaptedToD3Js.forEach((d) => {
        return { label: this.dateFormat(d.label), value: +d[grpName] };
      });
      // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: this.dataAdaptedToD3Js.forEach((d) => {
          return { label: this.dateFormat(d.label), value: +d[grpName] };
        }),
      };
    });

    let x = d3
      .scaleTime()
      .domain(
        d3.extent(this.dataAdaptedToD3Js, (d) => {
          return this.dateFormat(d.label);
        })
      )
      .rangeRound([0, this.width]);

    // const xaxis = d3.axisBottom(x).tickFormat(d3.format("0"));

    this.domainMinRange =
      this.domainMinRange == 0 ? 0 : this.domainMinRange + -5;

    let y = d3
      .scaleLinear()
      .domain([
        this.domainMinRange,
        Math.abs(
          this.domainMaxRange + (this.domainMaxRange * 0, 2) + this.data.length
        ),
      ])
      .range([this.height, 0]);

    // Add the lines
    let line = d3
      .line()
      .x((d) => {
        return x(d['label']);
      })
      .y(function (d) {
        return y(+d['value']);
      });
    svg
      .selectAll('myLines')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('class', (d) => {
        return d.name;
      })
      .attr('d', (d: any) => {
        return line(d.values);
      })
      .attr('stroke', (d) => {
        return myColor[d.name];
      })
      .style('stroke-width', 10)
      .style('fill', 'none');

    // create a tooltip
    let Tooltip = d3
      .select('#my_dataviz')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px');
    if (this.showDots) {
      svg
        // First we need to enter in a group
        .selectAll('myDots')
        .data(dataReady)
        .enter()
        .append('g')
        .style('fill', (d) => {
          return myColor[d.name];
        })
        .attr('class', (d) => {
          return d.name;
        })
        // Second we need to enter in the 'values' part of this group
        .selectAll('myPoints')
        .data(dataReady)
        .data([dataReady[0].values[5]])
        .attr('class', 'myCircle')
        .enter()
        .append('circle')
        .attr('cx', (d) => {
          return x(d.label);
        })
        .attr('cy', (d) => {
          return y(d.value);
        })
        .attr('r', 20)
        .attr('stroke', this.data[0].color)
        .style('fill', '#5251FA')
        .attr('stroke-width', 10);
    }

    this._isInitiated = true;
  }

  update() {
    if (!this._isInitiated) {
      return;
    }

    this.dataAdaptedToD3Js = [];
    if (this.data.length < 10) {
      this.xLabels = this.covertToDate(this.xLabels);
      this._data[0].data.forEach((_element, index) => {
        let objectAdapted = { label: this.xLabels[index] };
        for (let i = 0; i < this._data.length; i++) {
          objectAdapted[this._data[i].label] = this._data[i].data[index];
          if (this.domainMaxRange < this._data[i].data[index]) {
            this.domainMaxRange = this._data[i].data[index];
          }
          if (this.domainMinRange > this._data[i].data[index]) {
            this.domainMinRange = this._data[i].data[index];
          }
        }
        this.dataAdaptedToD3Js.push(objectAdapted);
      });

      this.draw();
    }
  }
}

interface LineChartModel {
  label: string;
  data: any[];
  color: string;
  legend: string;
}

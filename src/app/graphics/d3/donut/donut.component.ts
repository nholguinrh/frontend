import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { PropiedadConColor } from '../../../shared/model/cliente.model';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.css'],
})
export class DonutComponent implements OnInit {
  private _data: Array<PropiedadConColor> = [];
  @Input() set data(val: Array<PropiedadConColor>) {
    this._data = val;
    this.update();
  }
  get data() {
    return this._data;
  }

  private isInitiated: boolean = false;

  ngOnInit(): void {
    this.bindChart();

    //TODO: Eliminar esta asignación en duro, debe ser desde el origen
    this.data = [
      { name: 'Work Hours', value: 49.15, color: '#8CC63E' },
      { name: 'Non-Work Hours', value: 7.45, color: '#29AAE3' },
      { name: 'Over Time', value: 11, color: '#23B574' },
      { name: 'Project Count', value: 13, color: '#296972' },
    ];
  }

  bindChart() {
    const width = 300;
    const height = 300;

    const outerRadius = width / 2;
    const innerRadius = 100;

    const pie1 = d3
      .pie()
      .value(function (d) {
        return d.value;
      })
      .sort(null);

    const arc: d3.Arc<any, {}> = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius)
      .cornerRadius(3)
      .padAngle(0.015);

    const outerArc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);

    const svg: any = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    svg.append('g').attr('class', 'slices');
    svg.append('g').attr('class', 'labelName');
    svg.append('g').attr('class', 'lines');

    const path = svg
      .selectAll('path')
      .data(pie1(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d) {
        return d.data.color;
      });

    path
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    const data = this.data;
    const restOfTheData = function () {
      const text = svg
        .selectAll('text')
        .data(pie1(data))
        .enter()
        .append('text')
        .transition()
        .duration(200)
        .attr('transform', function (d) {
          return 'translate(' + arc.centroid(d) + ')';
        })
        .attr('dy', '.4em')
        .attr('text-anchor', 'middle')
        .text(function (d) {
          return d.data.value + '%';
        })
        .style('fill', '#fff')
        .style('font-size', '10px');

      var legendRectSize = 20;
      var legendSpacing = 7;
      var legendHeight = legendRectSize + legendSpacing;

      debugger;
      var legend = svg
        .selectAll('.legend')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
          //Just a calculation for x & y position
          return 'translate(-50,' + (i * legendHeight - 55) + ')';
        });
      legend
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('rx', 20)
        .attr('ry', 20)
        .style('fill', function (d) {
          return d.color;
        })
        .style('stroke', function (d) {
          return d.color;
        });

      legend
        .append('text')
        .attr('x', 30)
        .attr('y', 15)
        .text(function (d) {
          return d.name;
        })
        .style('fill', function (d) {
          return d.color;
        })
        .style('font-size', '14px');
    };

    setTimeout(restOfTheData, 1000);
    this.isInitiated = true;
  }

  private update() {
    if (!this.isInitiated) {
      return;
    }

    this.bindChart();
  }
}

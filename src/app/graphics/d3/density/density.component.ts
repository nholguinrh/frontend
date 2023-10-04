import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import * as d3 from 'd3';
import { ES_MX_LOCALE } from '../../../shared/const/es-mx-locale';
import { DateValue } from '../../../shared/model/date-value';
import { MarginConf } from '../../../shared/model/margin-conf';

@Component({
  selector: 'smc-density',
  templateUrl: './density.component.html',
  styleUrls: ['./density.component.css']
})
export class DensityComponent implements OnInit, AfterViewInit {

  private static id = 0;
  componentId: number = 0;

  @ViewChild('density') svgDensityChart: ElementRef;

  _data: Array<DateValue> = [];
  @Input() set data(val: Array<DateValue>) {
    this._data = val;
    this.upadteScale();
  }
  get data() {
    return this._data;
  }

  @Input() sizex: number = 530;
  @Input() sizey: number = 300;
  @Input() color: string = '#fca404';
  @Input('stroke-width') strokeWidth: number = 3;
  @Input('gradient-start') gradientStart: string = '#fee8bb';
  @Input('gradient-stop') gradientStop: string = 'rgba(253, 167, 0, 0.1)';
  @Input('tooltip-color') tooltipColor: string = 'rgba(253, 167, 0, 0.2)';

  @Input() margin?: MarginConf = {
    top: 80,
    right: 10,
    bottom: 10,
    left: 30,
  };

  _scale: 'week' | 'day' | 'hour' = 'week';
  @Input() set scale(val: 'week' | 'day' | 'hour') {
    this._scale = val;
    this.upadteScale();
  }

  _showScale: boolean = true;
  @Input() set showScale(val: boolean) {
    this._showScale = val;
    this.upadteScale();
  }

  width: number;
  height: number;

  X: any;
  Y: any;
  I: any;

  curveType: any = d3.curveCatmullRom;
  @Input() showSLA = true;
  @Input() sla = 84;

  private svg;

  constructor() {
  }


  ngOnInit(): void {
    this.componentId = ++DensityComponent.id;
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.draw();
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  draw() {
    this.X = d3.map(this.data, (d: DateValue) => d.date);
    this.Y = d3.map(this.data, (d: DateValue) => d.value);
    this.I = d3.range(this.X.length);

    const defined = (_d: DateValue, i: number) =>
      !isNaN(this.X[i]) && (this.Y[i] !== null);
    const D = d3.map(this.data, defined);

    const xDomain = d3.extent(this.X);
    const yDomain = [0, d3.max(this.Y)];
    //const yDomain = [0, 110];

    const xType = d3.scaleUtc;
    const yType = d3.scaleLinear;

    const xRange = [this.margin.left, this.width - this.margin.right];
    const yRange = [this.height - this.margin.bottom, this.margin.top];

    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);
    const format = d3.timeFormat('%A');

    const formatShort = d3.timeFormat('%d %b');
    this.curveType = d3.curveCatmullRom;

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(0)
      .ticks(d3.timeWeek.every(2))
      .tickFormat((d: Date) => formatShort(new Date(d.toString())))
      .tickSizeInner(18)
      .tickSizeOuter(0);

    const area = d3
      .area()
      .defined((_: DateValue, i: number) => D[i])
      .curve(this.curveType)
      .x((_: DateValue, i: number) => xScale(this.X[i]))
      .y0(yScale(0))
      .y1((_: DateValue, i: number) => yScale(this.Y[i]));

    const line = d3
      .line()
      .defined((_: DateValue, i: number) => D[i])
      .curve(this.curveType)
      .x((_: DateValue, i: number) => xScale(this.X[i]))
      .y((_: DateValue, i: number) => yScale(this.Y[i]));

    this.svg = d3
      .select(this.svgDensityChart?.nativeElement)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    this.svg.attr('class', this.componentId);
    const defs = this.svg.append('defs');

    this.setAreaAverageGradients(defs);
    this.curveType = d3.curveLinear;

    this.svg
      .append('path')
      .attr('fill', 'url(#densityGradient' + this.componentId + ')')
      .attr('stroke-width', '3')
      .attr('d', area(d3.map(this.I, (i: number) => [i, i])));

    this.svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', this.strokeWidth)
      .attr('d', line(d3.map(this.I, (i: number) => [i, i])));

    
    if (this.showSLA) {
      this.svg.append("line")
        .attr("class", "line")
        .call(d3.line())
        .style("stroke", "#27509B")
        .style("stroke-dasharray", ("3, 2"))
        .style("stroke-width", 1)
        .attr("x1", this.margin.left)
        .attr("x2", this.width -10)
        .attr("y1", yScale(this.sla))
        .attr("y2", yScale(this.sla));

      this.svg.append("text")
        .attr("x", (this.width - 35))				
        .attr("y", yScale(this.sla))
        .style("font-size", "12px") 
        .style("font-weight", "400") 
        .style("font-family","sans-serif")
        .style("fill", '#27509B')
        .text(this.sla + '%');
    }

    return this.svg.node();
  }

  private setAreaAverageGradients(defs: any) {
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'densityGradient' + this.componentId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '-1.92%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '-1.92%')
      .attr('stop-color', this.color)
      .attr('stop-opacity', 0.2);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', this.color)
      .attr('stop-opacity', 0);
  }

  /* private upadteScale() {
    
  } */

  private upadteScale() {

    d3.selectAll('.d3-tip').remove();

    this.setDimensions();
    this.draw();
    
  }


}

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { ES_MX_LOCALE } from 'src/app/shared/const/es-mx-locale';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';

@Component({
  selector: 'smc-inverted-histogram',
  templateUrl: './inverted-histogram.component.html',
  styleUrls: ['./inverted-histogram.component.css'],
})
export class InvertedHistogramComponent implements AfterViewInit {
  @ViewChild('invertedHistogram') svgHistogram: ElementRef;
  @Input() sizex: number = 800;
  @Input() sizey: number = 400;
  @Input() margin?: MarginConf = {
    top: 10,
    right: 0,
    bottom: 10,
    left: 40,
  };
  @Input() showXLabels = true;
  @Input() showYLabels = true;
  @Input() isDynamicRange = false;
  @Input() range: number[] = [30, 90];
  @Input() mean: number = 90;
  @Input() barWidth = 4;

  _showDomain: boolean = false;
  @Input() set showDomain(val: boolean) {
    this._showDomain = val;
  }

  _showScale: boolean = true;
  @Input() set showScale(val: boolean) {
    this._showScale = val;
  }

  private svg;
  public g: any;

  private width: number;
  private height: number;

  X: any;
  Y: any;
  I: any;
  Limit: any;

  xAxisDef: any;
  private isInitiated: boolean = false;

  private _data: Array<DateValue> = [];
  @Input() set data(val: Array<DateValue>) {
    this._data = val;

    this.update();
  }
  get data() {
    return this._data;
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.draw();
  }

  draw() {
    this.X = d3.map(this.data, (d: DateValue) => d.date);
    this.Y = d3.map(this.data, (d: DateValue) => d.value);
    this.I = d3.range(this.X.length);

    let promedio = d3.mean(this.Y);
    this.Limit = Math.max(-d3.min(this.Y), d3.max(this.Y));

    const xDomain = d3.extent(this.X);

    var limitDate = new Date(xDomain[1]);
    limitDate.setDate(limitDate.getDate() - 1);
    limitDate.setHours(limitDate.getHours() + 29);
    limitDate.setMinutes(limitDate.getMinutes() + 59);
    limitDate.setSeconds(limitDate.getSeconds() + 59);
    xDomain[1] = limitDate;

    let yDomain;
    if (this.isDynamicRange) {
      yDomain = this.range;
    } else {
      yDomain = [0, d3.max(this.Y)];
    }

    const xType = d3.scaleTime;
    const yType = d3.scaleLinear;

    const xRange = [this.margin.left, this.width - this.margin.right];
    const yRange = [this.height - this.margin.bottom, this.margin.top];

    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);

    const formatShort = d3.timeFormat('%d %b');

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(0)
      .ticks()
      .tickFormat((d: Date) => formatShort(new Date(d.toString())))
      .tickSizeInner(10)
      .tickSizeOuter(0);

    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(0)
      .tickFormat(function (d, i) {
        return d + '%';
      })
      .tickSizeInner(10)
      .tickSizeOuter(0);

    if (this.showYLabels) {
      let r = this.range[1] - this.range[0];
      let d = r / 25;
      let array: number[] = [];
      array.push(this.range[0]);
      for (let index = 1; index < d; index++) {
        array.push(this.range[0] + index * 25);
      }
      array.push(this.range[1]);
      yAxis.tickValues(yScale.ticks(0).concat(array));
    } else {
      yAxis.tickValues(yScale.ticks(0));
    }

    this.svg = d3
      .select(this.svgHistogram.nativeElement)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    if (!this.isInitiated) {
      this.xAxisDef = this.svg
        .append('g')
        .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
        .style('font-size', '10px')
        .style('font-weight', '600')
        .style('color', '#000000');
    }

    this.xAxisDef
      .transition()
      .duration(1000)
      .call(xAxis)
      .on('start', () => {
        if (!this._showDomain) {
          this.svg.select('.domain').remove();
        }
        if (!this._showScale) {
          this.svg.selectAll('.tick').remove();
        }
      });

    let y;
    if (this.isDynamicRange) {
      y = d3
        .scaleLinear()
        .domain(this.range)
        .range([this.height - this.margin.bottom, this.margin.top]);
    } else {
      y = d3
        .scaleLinear()
        .domain([0, d3.max(this.Y)])
        .range([this.height - this.margin.bottom, this.margin.top]);
    }

    this.svg
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',0)')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('color', '#000000')
      .call(yAxis)
      .call((g: any) => g.select('.domain').remove())
      .call((g: any) => g.selectAll('.tick line').remove());

    this.svg
      .append('text')
      .attr('x', this.width + 8)
      .attr('y', (d) => {
        return y(this.mean) + 3;
      })
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('font-family', 'sans-serif')
      .style('fill', '#285CED')
      .text(this.mean.toString() + '%');

    let u = this.svg.selectAll('.rectA').data(this.data);

    u.join('rect')
      .transition()
      .duration(1000)
      .attr('x', (_: DateValue, i: number) => xScale(this.X[i]))
      .attr('y', (_: DateValue, i: number) => {
        if (this.Y[i] > this.mean) {
          return yScale(this.Y[i]);
        } else {
          return yScale(this.mean);
        }
      })
      .attr('width', this.barWidth)
      .attr(
        'height',
        (_: DateValue, i: number) =>
          this.height - this.margin.bottom - yScale(90)
      )
      .attr('fill', 'red')
      .attr('class', 'rectA');

    let v = this.svg.selectAll('.rectB').data(this.data);

    v.join('rect')
      .transition()
      .duration(1000)
      .attr('x', (_: DateValue, i: number) => xScale(this.X[i]))
      .attr('y', (_: DateValue, i: number) => {
        if (this.Y[i] > this.mean) {
          return yScale(90);
        } else {
          return yScale(this.Y[i]);
        }
      })
      .attr('width', this.barWidth)
      .attr('height', (_: DateValue, i: number) => {
        if (this.Y[i] > this.mean) {
          return this.height - this.margin.bottom - yScale(90);
        } else {
          return this.height - this.margin.bottom - yScale(this.Y[i]);
        }
      })
      .attr('fill', 'white')
      .attr('class', 'rectB')
      .style('stroke-width', '3')
      .style('stroke', 'white');

    //AQUI SE PUEDE MANDAR EL THIS.MEAN O EL PROMEDIO
    this.svg
      .append('line')
      .attr('class', 'line')
      .call(d3.line())
      .style('stroke', '#285CED')
      /* .style("stroke-dasharray", ("3, 2")) */
      .style('stroke-width', 1)
      .attr('x1', this.margin.left)
      .attr('x2', this.width)
      .attr('y1', (d) => {
        return y(this.mean);
      })
      .attr('y2', (d) => {
        return y(this.mean);
      });

    this.isInitiated = true;
  }

  private update() {
    if (!this.isInitiated) {
      return;
    }

    this.draw();
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }
}

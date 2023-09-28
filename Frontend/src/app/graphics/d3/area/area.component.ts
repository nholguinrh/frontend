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
  selector: 'app-area',
  templateUrl: './area.component.html',
})
export class AreaComponent implements OnInit, AfterViewInit {
  private static id = 0;
  componentId: number = 0;

  @ViewChild('area') areaChart: ElementRef;

  _data: Array<DateValue> = [];
  @Input() set data(val: Array<any>) {
    console.log(val);

    if (val.length > 0 && typeof val[0].date == 'string') {
      this._data = val.map((dt) => {
        let dateValue: DateValue = {
          date: new Date(dt.date),
          value: dt.value,
        };
        return dateValue;
      });
    } else {
      this._data = val;
    }
    this.updateDraw();
  }

  _color = '#f7d0c5';
  @Input() set color(val: string) {
    this._color = val;
  }
  get color() {
    return this._color;
  }

  _tooltipColor = 'rgba(253, 167, 0, 0.2)';
  @Input('tooltip-color') set tooltipColor(val: string) {
    this._tooltipColor = val;
  }

  get data() {
    return this._data;
  }

  @Input() sizex: number = 530;
  @Input() sizey: number = 300;
  @Input('gradient-start') gradientStart: string = '#fee8bb';
  @Input('gradient-stop') gradientStop: string = '#3b68ed';
  @Input('linear-gradient') linearGradient: string = '#FFD8E1';

  @Input() margin?: MarginConf = {
    top: 80,
    right: 60,
    bottom: 10,
    left: 70,
  };

  @Input() areaType: 'tickets' | 'average';
  @Input() variant: boolean = false;

  private _scale: 'week' | 'day' | 'hour' | 'dayMonth' | 'minute';
  @Input() set scale(val: 'week' | 'day' | 'hour' | 'dayMonth' | 'minute') {
    this._scale = val;
  }
  get scale() {
    return this._scale;
  }

  _showScale: boolean = true;
  @Input() set showScale(val: boolean) {
    this._showScale = val;
  }

  _showDomain: boolean = false;
  @Input() set showDomain(val: boolean) {
    this._showDomain = val;
  }
  @Input('tick-last-color') ticklastcolor: string = '#FF6F6F';
  @Input() full: boolean = false;
  @Input() showXLabels = true;
  //@Input() unit: string = '%';
  @Input() showYLabels = false;
  @Input() isDynamicRange = false;

  private _range: number[] = [0, 90];
  @Input() set range(val: number[]) {
    this._range = val;
  }
  get range() {
    return this._range;
  }

  private _unit: string = '%';
  @Input() set unit(val: string) {
    this._unit = val;
    this.updateDraw();
  }
  get unit() {
    return this._unit;
  }

  @Input() specialFormat = false;

  @Input() showSLA: boolean = false;
  @Input() sla = 84;
  @Input() slaColor = '#F95A36';

  width: number;
  height: number;

  area: any;
  line: any;

  curveType: any = d3.curveCatmullRom;

  X: any;
  Y: any;
  I: any;
  xAxis: any;
  xScale: any;
  yScale: any;
  formatShort = d3.utcFormat('%d %b');
  format = d3.timeFormat('%d/%m/%Y');

  yAxis: any;
  svg: any;

  isInitiated: boolean = false;

  ngOnInit(): void {
    this.componentId = ++AreaComponent.id;
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.initDraw();
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  private initDraw() {
    this.drawCharts();

    this.svg = d3
      .select(this.areaChart.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    this.svg.attr('class', this.componentId);
    const defs = this.svg.append('defs');

    this.setGradients(defs);

    this.svg
      .append('path')
      .attr('fill', 'url(#areaGradient' + this.componentId + ')')
      .attr('strock-width', '3')
      .attr('class', 'area-chart' + this.componentId)
      .attr('d', this.area(d3.map(this.I, (i: number) => [i, i])));

    this.svg
      .append('path')
      .attr('fill', 'none')
      /* .attr('stroke', 'url(#lineGradient' + this.componentId + ')') */
      .attr('stroke', this.color)
      .attr('stroke-width', 3)
      .attr('class', 'line-chart' + this.componentId)
      .attr('d', this.line(d3.map(this.I, (i: number) => [i, i])));

    this.isInitiated = true;

    this.createAxis();

    const focus = this.svg.append('g').style('display', 'none');

    // Interacciones
    const mouseMove = (ev: any) => {
      if(!(this.data.length > 0)){
        return
      }
      ev.preventDefault();

      const bisectDate = d3.bisector((dv: DateValue) => dv.date).left;

      const [xCoord, _yCoord] = d3.pointer(ev);

      const x0 = this.xScale.invert(xCoord);

      const i = bisectDate(this.data, x0, 1);
      const d0 = this.data[i - 1];
      const d1 = this.data[i];

      const xOffset = this.areaChart.nativeElement.offsetLeft;
      const yOffset = this.areaChart.nativeElement.offsetTop;

      if (this._scale === 'week') {
        this.formatShort = d3.timeFormat('%d/%m/%Y');
      } else if (this._scale === 'day') {
        this.formatShort = d3.timeFormat('%d %b-%H:%Mhrs');
      } else if (this._scale === 'dayMonth') {
        this.formatShort = d3.timeFormat('%d');
      } else {
        this.formatShort = d3.timeFormat('%d %b %H:%M');
      }
      let d: DateValue;
      if (d1) {
        d =
          x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime()
            ? d1
            : d0;
      } else {
        d = d0;
      }

      let valueTicket;
      if(this._unit){
        valueTicket = this._unit;
      }else{
        valueTicket = '%';
      }
      if (this.areaType == 'tickets') {
        valueTicket = '%';
      }
    
      focus
        .select('circle.y')
        .attr(
          'transform',
          'translate(' + this.xScale(d.date) + ',' + this.yScale(d.value) + ')'
        );

      toltp
        .style('top', yOffset + this.yScale(d.value) - 75 + 'px')
        .style('left', xOffset + this.xScale(d.date) - 50 + 'px');

      toltp
        .select('text')
        .html(
          `<span style='font-size: 9px;'>${this.formatShort(
            d.date
          )}</span> <br> <span>${d.value + ' ' + valueTicket}</span>`
        );
    };

    const mouseOverEvent = (ev: any) => { 
      console.log('Color de fondo: '+this._color);
      if(this.data.length > 0){ 
        focus.style('display', null);
        toltp.style('opacity', 1);
        toltp.style('background',this._color);      
      }
    };

    if (this.showSLA) {
      //if(d3.max(this.Y) > this.sla){
      if(this.range[1] > this.sla){
        this.svg
          .append('line')
          .attr('class', 'line')
          .call(d3.line())
          .style('stroke', this.slaColor)
          .style('stroke-dasharray', '3, 2')
          .style('stroke-width', 1)
          .attr('x1', this.margin.left)
          .attr(
            'x2',this.width - this.margin.right
          )
          .attr('y1', this.yScale(this.sla))
          .attr('y2', this.yScale(this.sla));

        this.svg
          .append('text')
          .attr(
            'x',
            this.full
              ? this.width - this.margin.right + 4
              : this.width - this.margin.right
          )
          .attr('y', this.yScale(this.sla - 0.4))
          .style('font-size', this.full ? '14px' : '10px')
          .style('font-weight', '400')
          .style('font-family', 'sans-serif')
          .style('fill', this.slaColor)
          .text(this.sla + '' + this._unit);
      }
    }

    const toltp = d3
      .select(this.areaChart.nativeElement)
      .append('div')
      .attr('class', 'd3-tip-area')
      .style('opacity', '0');

    toltp.append('text');

    this.setTooltips(focus, toltp);

    const rect = this.svg
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      ;

    rect
      .on('mouseover',  mouseOverEvent)
      .on('mouseout', function () {
        focus.style('display', 'none');
        toltp.style('opacity', 0);
      })
      .on('mousemove', mouseMove);

    return this.svg.node();
  }

  private updateDraw() {
    if (!this.isInitiated) {
      return;
    }
    this.svg.selectAll('line').remove();
    this.svg.selectAll('text').remove();
    this.drawCharts();
    this.createAxis();

    this.svg
      .select('.ejeX')
      .transition()
      .duration(3000)
      .call(this.xAxis)
      .on('start', () => {
          if (!this._showDomain) {
            this.svg.select('.domain').remove();
          }
        //this.svg.selectAll('.tick line').remove();
        this.svg.selectAll('.tick text').style('color', '#797C8C');
        this.svg
          .select('.tick:last-of-type text')
          .style('color', this.ticklastcolor);
      });

    this.svg
      .select('.area-chart' + this.componentId)
      .transition()
      .duration(3000)
      .attr('d', this.area(d3.map(this.I, (i: number) => [i, i])));

    this.svg
      .select('.line-chart' + this.componentId)
      .transition()
      .duration(3000)
      .attr('d', this.line(d3.map(this.I, (i: number) => [i, i])));
  }

  private drawCharts() {
    this.X = d3.map(this.data, (d: DateValue) => d.date);
    this.Y = d3.map(this.data, (d: DateValue) => d.value);
    this.I = d3.range(this.X.length);

    const defined = (_d: DateValue, i: number) =>
      !isNaN(this.X[i]) && (this.Y[i] !== null);
    const D = d3.map(this.data, defined);

    const xDomain = d3.extent(this.X);
    let yDomain;
    if (this.isDynamicRange) {
      yDomain = this.range;
    } else {
      this.range = [
        Math.round(d3.min(this.Y) - d3.min(this.Y) * 0.1),
        Math.round((d3.max(this.Y) + d3.max(this.Y) * 0.1)+1),
      ];
      if(this.range[0] < 10){
        this.range[0] = 0;
      }

      if(this.range[1] < 1){
        this.range[1] = 1;
      }
      yDomain = this.range;
      //yDomain = [0, 110];
    }

    const xType = d3.scaleUtc;
    const yType = d3.scaleLinear;

    const xRange = [this.margin.left, this.width - this.margin.right];
    const yRange = [this.height - this.margin.bottom, this.margin.top];

    this.xScale = xType(xDomain, xRange);
    this.yScale = yType(yDomain, yRange);

    this.customizeCharts();

    this.defineXAxis();

    this.area = d3
      .area()
      .defined((_: DateValue, i: number) => D[i])
      .curve(this.curveType)
      .x((_: DateValue, i: number) => this.xScale(this.X[i]))
      .y0(this.yScale(this.range[0]))
      .y1((_: DateValue, i: number) => this.yScale(this.Y[i]));

    this.line = d3
      .line()
      .defined((_: DateValue, i: number) => D[i])
      .curve(this.curveType)
      .x((_: DateValue, i: number) => this.xScale(this.X[i]))
      .y((_: DateValue, i: number) => this.yScale(this.Y[i]));

  }

  private defineXAxis() {
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);

    let formatShort = d3.timeFormat('%d');
    console.log(this.scale)
    if (this.scale === 'week') {
      if (this.full) {
        formatShort = d3.timeFormat('%-d/%m/%Y');
      } else {
        if (this.variant) {
          formatShort = d3.timeFormat('%d');
        } else {
          formatShort = d3.timeFormat('%d %b');
        }
      }
    } else if (this.scale === 'hour') {
      formatShort = d3.timeFormat('%H:%M');
    } else if (this.scale === 'minute'){
      formatShort = d3.timeFormat('%H:%M');
    }else {
      if (this.full) {
        formatShort = d3.timeFormat('%H:%M');
      } else {
        formatShort = d3.timeFormat('%H:00');
      }
    }
    if (this.specialFormat) {
      this.formatShort = formatShort;
    }

    this.defineXAxisTicks();

    this.yAxis = d3
      .axisLeft(this.yScale)
      .tickSize(0)
      .tickFormat((d) => {
        return d + this._unit;
      })
      .tickSizeInner(this.margin.right + this.margin.left - this.width)
      .tickSizeOuter(0);

      if (this.showYLabels) {
        let r = this.range[1] - this.range[0];
        let d = 8;
        /* if(r > 10){
           d = r / 10;
        }else{
           d = 10;
        } */
        let array: number[] = [];
        /* array.push(this.range[0]); */
        let contador = 1;
        let rangoY;
        /* if(this.range[1] <= 10){
          rangoY = 1;
        }else if(this.range[1] <= 100 && this.range[1] > 10){
          rangoY = 10;
        }else if(this.range[1] <= 1000 && this.range[1] > 100){
          rangoY = 100;
        } */
        rangoY = r/d
        for (let index = 1; index < Math.round(d); index++) {
          array.push(this.range[0] + (Math.round(rangoY) * index))
          contador ++ ;
        }
        array.push(this.range[0] + (rangoY * contador));
        this.yAxis.tickValues(
          this.yScale.ticks(0).concat(array)
        ).tickPadding(5);

      }else{
        this.yAxis.tickValues(
          this.yScale.ticks(0)
        ).tickPadding(5);
      }
  }

  private setGradients(defs: any) {
    switch (this.areaType) {
      case 'average':
        this.setAreaAverageGradients(defs);
        this.setLineaAverageGradients(defs);
        this.curveType = d3.curveLinear;
        break;
      case 'tickets':
        this.setAreaTicketsGradients(defs);
        this.setLineaTicketsGradients(defs);
        this.curveType = d3.curveCatmullRom;
        break;
      default:
        break;
    }
  }

  private customizeCharts() {
    switch (this.areaType) {
      case 'average':
        this.curveType = d3.curveMonotoneX;
        //  this.curveType = d3.curveCatmullRom;
        break;
      case 'tickets':
        this.curveType = d3.curveLinear;
        break;
      default:
        this.curveType = d3.curveMonotoneX;
        //  this.curveType = d3.curveCatmullRom;
        break;
    }
  }

  private setAreaAverageGradients(defs: any) {
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'areaGradient' + this.componentId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '-1.92%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '-1.92%')
      .attr('stop-color', this.gradientStop)
      .attr('stop-opacity', 0.12);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', this.gradientStop)
      .attr('stop-opacity', 0);
  }

  private setLineaAverageGradients(defs: any) {
    const lineGradient = defs
      .append('linearGradient')
      .attr('id', 'lineGradient' + this.componentId);

    lineGradient
      .append('stop')
      .attr('offset', '0.213542')
      .attr('stop-color', this.color)
      .attr('stop-opacity', 1);

    lineGradient
      .append('stop')
      .attr('offset', '0.510417')
      .attr('stop-color', this.color)
      .attr('stop-opacity', 1);

    lineGradient
      .append('stop')
      .attr('offset', '0.822917')
      .attr('stop-color', this.color)
      .attr('stop-opacity', 1);

    lineGradient
      .append('stop')
      .attr('offset', '1')
      .attr('stop-color', this.linearGradient)
      .attr('stop-opacity', 1);
  }

  private setAreaTicketsGradients(defs: any) {
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'areaGradient' + this.componentId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '-43.68%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '-43.68%')
      .attr('stop-color', this.gradientStart);

    areaGradient
      .append('stop')
      .attr('offset', '100.49%')
      .attr('stop-color', this.gradientStop);
  }

  private setLineaTicketsGradients(defs: any) {
    const lineGradient = defs
      .append('linearGradient')
      .attr('id', 'lineGradient' + this.componentId);

    lineGradient
      .append('stop')
      .attr('offset', '100')
      .attr('stop-color', this.color)
      .attr('stop-opacity', 0.6);
  }

  private setTooltips = (focus: any, toltp: any) => {
    switch (this.areaType) {
      case 'average':
        focus
          .append('circle')
          .attr('class', 'y')
          .style('fill', '#FFFFFF')
          .style('opacity', 1)
          .style('stroke', this.color)
          .style('stroke-width', 3)
          .attr('r', 10);

        toltp
          .style('background', this.tooltipColor)
          .style('border-radius', '7')
          .attr('class', 'd3-tip-area simple');

        break;
      case 'tickets':
        focus
          .append('circle')
          .attr('class', 'y')
          .style('fill', this.color)
          .style('opacity', 1)
          .style('stroke', '#FFFFFF')
          .style('stroke-width', 5)
          .style('box-shadow', '0px 4px 8px rgba(82, 67, 170, 0.32)')
          .attr('r', 7.5);

        toltp
          .style('background', this.tooltipColor)
          .style('border-radius', '7')
          .attr('class', 'd3-tip-area simple');
        break;
      default:
        break;
    }
  };

  defineXAxisTicks() {
    this.xAxis = d3
      .axisBottom(this.xScale)
      .tickSize(0)
      .tickFormat((d: Date) => this.formatShort(new Date(d.toString())))
      .tickSizeInner(18)
      .tickSizeOuter(0);

    if (this.showXLabels) {
      if (this.specialFormat) {
        if (this.scale === 'week') {
          if (this.full) {
            this.xAxis.tickValues(this.xScale.ticks(d3.timeDay.every(1)));
          } else {
            if (this.variant) {
              this.xAxis.tickValues(this.xScale.ticks(d3.timeDay.every(1)));
            } else {
              this.xAxis.tickValues(this.xScale.ticks(d3.timeDay.every(1)));
            }
          }
        } else if (this.scale === 'minute'){
          this.xAxis.tickValues(this.xScale.ticks(12));
        } else {
          if (this.full) {
            this.xAxis.tickValues(this.xScale.ticks(24));
          } else {
            this.xAxis.tickValues(
              this.slaColor == '#F95A36'
                ? this.xScale.ticks(12)
                : this.xScale.ticks(24)
            );
          }
        }
      } else {
        this.xAxis.tickValues([this.X[0], this.X[this.X.length - 1]]);
      }
    } else {
      this.xAxis.tickValues(0);
    }
  }

  createAxis() {
    this.svg.selectAll('g').select('.tick:last-of-type text').remove();

    this.svg.selectAll('g').remove();

    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .style('font-size', '12px')
      .style('color', '#797C8C')
      .call(this.xAxis)
      .attr('class', 'ejeX')
      .call((g: any) => {
        if (!this._showDomain) {
          g.select('.domain').remove();
        }
      })
      .call((g: any) => g.selectAll('.tick line').remove())
      .call((g: any) =>
        g.select('.tick:last-of-type text').style('color', this.ticklastcolor)
      )
      .call((g: any) => {
        if (!this._showScale) {
          g.selectAll('.tick').remove();
        }
      });

    if (this.full) {
      if (this.scale === 'hour') {
        this.svg
          .selectAll('text')
          .attr('transform', 'translate(11, 25) rotate(90)');
      } else if (this.scale === 'day') {
        this.svg
          .selectAll('text')
          .attr('transform', 'translate(-10,20) rotate(315)');
      } else if (this.scale === 'minute') {
        this.svg
          .selectAll('text')
          .attr('transform', 'translate(-10,20) rotate(315)');
      } else {
        this.svg
          .selectAll('text')
          .attr('transform', 'translate(-35,35) rotate(315)');
      }
    }else{
      if (this.scale === 'hour') {
        this.svg
          .selectAll('text')
          .attr('transform', 'translate(-20,5) rotate(-55)');
      } else if (this.scale === 'day') {
        this.svg
          .selectAll('text')
          .attr('transform', 'translate(-20,5) rotate(-55)');
      } else if (this.scale === 'minute') {
        this.svg
          .selectAll('text')
          .attr('transform', 'translate(-15,0) rotate(315)');
      } else {
        this.svg
        .selectAll('text')
        .attr('transform', 'translate(0,0)');
      }
    }

    if (this.showYLabels) {
      this.svg
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',0)')
        .attr('class', 'ejeY')
        .style('font-size', (g) => {
          if (this.full) {
            return '16px';
          } else {
            return '10px';
          }
        })
        .style('font-weight', '600')
        .style('color', '#7C8DB5')
        .call(this.yAxis)
        .call((g: any) => {
          if (!this._showDomain) {
            g.select('.domain').remove();
          }
        })
        .call((g: any) =>
          g.select('.tick:last-of-type text').style('color', '#285CED')
        )
        .call((g: any) => {
          return g.selectAll('.tick line').attr('opacity', 0.1);
        });
    }

    if (this.showSLA) {
      //if(d3.max(this.Y) > this.sla){
      if(this.range[1] > this.sla){
        this.svg
          .append('line')
          .attr('class', 'line')
          .call(d3.line())
          .style('stroke', this.slaColor)
          .style('stroke-dasharray', '3, 2')
          .style('stroke-width', 1)
          .attr('x1', this.margin.left)
          .attr(
            'x2',this.width - this.margin.right
          )
          .attr('y1', this.yScale(this.sla))
          .attr('y2', this.yScale(this.sla));
  
        this.svg
          .append('text')
          .attr(
            'x',
            this.full
              ? this.width - this.margin.right + 4
              : this.width - this.margin.right
          )
          .attr('y', this.yScale(this.sla - 0.4))
          .style('font-size', this.full ? '14px' : '10px')
          .style('font-weight', '400')
          .style('font-family', 'sans-serif')
          .style('fill', this.slaColor)
          /* .text(this.sla + '' + this._unit); */
          .text(this.sla + '' + this._unit);

          this.svg
          .append('text')
          .attr(
            'x',
            this.full
              ? this.width - this.margin.right + 5
              : this.width - this.margin.right
          )
          .attr('y', this.yScale(this.sla - 3))
          .style('font-size', this.full ? '14px' : '10px')
          .style('font-weight', '400')
          .style('font-family', 'sans-serif')
          .style('fill', this.slaColor)
          .text( 'SLA');
      }
    }
  }
}

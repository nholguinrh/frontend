import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import d3Tip from "d3-tip";
import { Observable } from 'rxjs';
import { ES_MX_LOCALE } from '../../../shared/const/es-mx-locale';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements AfterViewInit, OnInit, OnDestroy {

  isDarkTheme: Observable<boolean>;
  public dark: boolean = false;

  @ViewChild('barchar') svgBarChart: ElementRef;
  @Input() sizex: number;
  @Input() sizey: number;
  @Input() margin?: MarginConf = {
    top: 10,
    right: 0,
    bottom: 5,
    left: 30,
  };
  @Input() isDynamicRange = false;
  @Input() range: number[] = [50, 90];
  @Input() unit: string = ' hrs';
  @Input() full: boolean = false;
  @Input() grid: boolean = false;
  @Input() tooltipLabel: string = '';
  @Input() tickets: boolean = false;
  @Input() general: boolean = false;

  @Input() different?: boolean = false;
  @Input('different-color') differentcolor = '#FFB84B';
  _color = '#FFB84B';
  @Input() set color(val: string) {
    this._color = val;
  }

  _colorText = '#0B112A'
  @Input() set colorText(val: string) {
    this._colorText = val;
  }

  get color() {
    return this._color;
  }
  @Input() rx = 4;
  @Input() barWidth = 4;
  @Input() showLimits = true;
  @Input() showXLabels = true;
  @Input() showYLabels = true;
  @Input() secondary = false;
  @Input('secondary-color') secondaryColor = '#F9896B';
  @Input() border = false;
  @Input() xposition: number = 0;

  @Input() showSLA = false;
  @Input() slaMean = true;
  @Input() sla = 84;
  @Input() measure = 10;

  _showScale: boolean = true;
  @Input() opacity: number = 1;
  @Input() set showScale(val: boolean) {
    this._showScale = val;
  }

  _showDomain: boolean = true;
  @Input() set showDomain(val: boolean) {
    this._showDomain = val;
  }

  _scale: 'week' | 'day' | 'hour' | 'month' | 'hourDiario' | 'minute' = 'week';
  @Input() set scale(val: 'week' | 'day' | 'hour' | 'month' |'hourDiario' | 'minute') {
    this._scale = val;
  }

  get scale() {
    return this._scale;
  }

  _data: Array<DateValue> = [];
  @Input() set data(val: Array<any>) {
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
    this.update();
  }
  get data() {
    return this._data;
  }

  private svg;
  public g: any;

  private width: number;
  private height: number;

  X: any;
  Y: any;
  I: any;

  xAxis: any;
  yAxis: any;
  xScale: any;
  yScale: any;

  isInitiated: boolean = false;
  formatShort = d3.utcFormat('%d %b');

  @Input() viewTooltip: boolean = true;
  constructor() {
    this.removeTooltips();
  }

  ngOnInit(): void {
    this.removeTooltips();
    let mode = localStorage.getItem('darkTheme');
    if (mode != null) {
      this.dark = mode === '1' ? true : false;
    }
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.draw();
  }

  ngOnDestroy(): void {
    d3.selectAll('.d3-tip').remove();
  }

  private removeTooltips(){
    d3.selectAll('.TooltipGenerated').remove();    
  }

  private create() {    
    this.removeTooltips();
    console.log('xposition',this.xposition);
    this.X = d3.map(this.data, (d: DateValue) => d.date);
    this.Y = d3.map(this.data, (d: DateValue) => d.value);
    this.I = d3.range(this.X.length);

    const xDomain = d3.extent(this.X);
    let yDomain;
    if (this.isDynamicRange) {
      yDomain = this.range;
    } else {
      this.range = [Math.round(d3.min(this.Y) - (d3.min(this.Y) * .1)), Math.round((d3.max(this.Y) + (d3.max(this.Y) * .1))+1)]
      if(this.range[0] > 0 && this.range[0] < 10){
        this.range[0] = (this.range[0] - 1);
      }
      if(this.range[0] <= 0){
        this.range[0] = 0;
      }
      if(this.range[1] < 1){
        this.range[1] = 1;
      }
      yDomain = this.range; 
      //yDomain = [0, 110];
    }
    console.log("Rango Barra:",this.range);

    const xType = d3.scaleTime;
    const yType = d3.scaleLinear;

    const xRange = [this.margin.left, this.width - this.margin.right];
    const yRange = [this.height - this.margin.bottom, this.margin.top];

    this.xScale = xType(xDomain, xRange);
    this.yScale = yType(yDomain, yRange);
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);

    let formatShort = this.getFormat();

    this.xAxis = d3
      .axisBottom(this.xScale)
      .tickSize(0)
      .tickFormat((d: Date) => formatShort(new Date(d.toString())))
      .tickSizeInner(5)
      .tickSizeOuter(0);

    this.defineTicksXAxis();

    this.yAxis = d3
      .axisLeft(this.yScale)
      .tickSize(0)
      .tickFormat((d) => {
        return d + this.unit;
      })
      .tickSizeInner(this.margin.right + this.margin.left - this.width - 20)
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

  private getFormat() {
    let formatShort =  d3.timeFormat('%d %b');
    if(this._scale === 'week'){
      if(this.full){
        formatShort = d3.timeFormat('%m/%-d/%Y');
      }else{
        formatShort = d3.timeFormat('%d/%m/%Y');
      }
    }else if(this._scale === 'month'){
      formatShort = d3.timeFormat("%d");
    }else if(this._scale === 'hour'){
      formatShort = d3.timeFormat('%H:%M');
    } else if (this.scale === 'minute'){
      formatShort = d3.timeFormat('%H:%M');
    }else{
      if(this.full){
        formatShort = d3.timeFormat("%H:%M");
      }else{
        formatShort = d3.timeFormat('%H:%M');
      }
    }
    return formatShort;
  }

  private defineXAxis() {
    this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.xposition} , ${this.height - this.margin.bottom})`
      )
      .style('font-size', (g) => {
        if (this.full) {
          return '12px';
        } else {
          return '7px';
        }
      })
      .style('color', '#7C8DB5')
      .call(this.xAxis)
      .call((g: any) => {
        if (!this._showDomain) {
          g.select('.domain').remove();
        }
      })
      .call((g: any) =>
        g.select('.tick:last-of-type text').style('color', '#285CED')
      )
      .call((g: any) => g.selectAll('.tick line').remove())
      .call((g: any) => {
        if (!this._showScale) {
          g.selectAll('.tick').remove();
        }
      });

    this.transformLabels();
  }

  private transformLabels() {
    if(this.full){
      if(this._scale === 'hour'){
        this.svg
        .selectAll("text")
        .attr("transform", "translate(11, 25) rotate(90)");
      }else if(this._scale === 'day'){
        this.svg
        .selectAll("text")
        .attr("transform", "translate(-10,20) rotate(315)");
      } else if (this.scale === 'minute') {
        this.svg
          .selectAll('text')
          .attr('transform', 'translate(-10,20) rotate(315)');
      } else{
        this.svg
        .selectAll("text")
        .attr("transform", "translate(-10,35) rotate(-50)");
      }
    }
  }

  private defineYAxis() {
    this.svg
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',0)')
      .style('font-size', (g) => {
        if (this.full) {
          return '16px';
        } else {
          return '8px';
        }
      })
      .style('font-weight', '600')
      .style('color', '#7C8DB5')
      .call(this.yAxis)
      .call((g: any) => g.select('.domain').remove())
      .call((g: any) => {
        if (this.full) {
          return g
            .selectAll('.tick text')
            .attr('transform', 'translate(-20,0)');
        }
      })
      .call((g: any) =>
        g.select('.tick:last-of-type text').style('color', '#285CED')
      )
      .call((g: any) => {
        if (!this.grid) {
          return g.selectAll('.tick line').remove();
        } else {
          return g.selectAll('.tick line').attr('opacity', 0.1);
        }
      });
  }

  private defineTicksXAxis() {
    if (this.showXLabels) {
      if(this._scale === 'week'){
        if(this.full){
          this.xAxis.tickValues(
            this.xScale.ticks(7)
          );
        }else{
          this.xAxis.tickValues(
            this.xScale.ticks(7)
          ).tickPadding(10) ;
        }
      }else if(this._scale === 'month'){
        this.xAxis.tickValues(
          this.xScale.ticks(31)
        );
      }else if(this._scale === 'day'){
        this.xAxis.tickValues(
          this.xScale.ticks(12)
        ).tickPadding(10) ;
      } else if (this.scale === 'minute'){
        this.xAxis.tickValues(this.xScale.ticks(12));
      } else{
        if(this.full){
          this.xAxis.tickValues(
            this.xScale.ticks(40)
          );
        }else{
          this.xAxis.tickValues(
            this.xScale.ticks()
          );
        }
      }
    } else {
      this.xAxis.tickValues(this.xScale.ticks(0));
    }
  }

  private draw() {
    this.create();

    this.svg = d3
      .select(this.svgBarChart.nativeElement)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    this.defineXAxis();
    this.defineYAxis();
    this.isInitiated = true;
    this.setForms();
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  private setForms() {



    if (this.showLimits) {
      this.svg
        .append('line')
        .attr('class', 'line')
        .call(d3.line())
        .style('stroke', '#27509B')
        .style('stroke-dasharray', '3, 2')
        .style('stroke-width', 1)
        .attr('x1', this.margin.left)
        .attr('x2', this.width + this.barWidth)
        .attr('y1', this.margin.top)
        .attr('y2', this.margin.top);

      this.svg
        .append('line')
        .attr('class', 'line')
        .call(d3.line())
        .style('stroke', '#27509B')
        .style('stroke-dasharray', '3, 2')
        .style('stroke-width', 1)
        .attr('x1', this.margin.left)
        .attr('x2', this.width + this.barWidth)
        .attr('y1', this.height / 2)
        .attr('y2', this.height / 2);
    }

    if (this.showSLA) {
      //if(d3.max(this.Y) > this.sla){
      if(this.range[1] > this.sla){
        if (this.slaMean) {
          this.svg
            .append('line')
            .attr('class', 'line')
            .call(d3.line())
            .style('stroke', '#27509B')
            .style('stroke-dasharray', '3, 2')
            .style('stroke-width', 1)
            .attr('x1', this.margin.left)
            .attr('x2', this.width)
            .attr('y1', this.height - d3.mean(this.Y))
            .attr('y2', this.height - d3.mean(this.Y));
        } else {
  
          this.svg
            .append('line')
            .attr('class', 'line')
            .call(d3.line())
            .style('stroke', '#F95A36')
            .style('stroke-dasharray', '3, 2')
            .style('stroke-width', 1)
            .attr('x1', this.margin.left)
            .attr('x2', this.full ? this.width + this.rx : this.width + this.rx + 10)
            .attr('y1', this.yScale(this.sla))
            .attr('y2', this.yScale(this.sla));
  
          this.svg.append("text")
            .attr("x", (this.width + this.rx + 15))
            .attr("y", this.yScale(this.sla - 0.4))
            .style("font-size", this.full ? '14px' : '10px')
            .style("font-weight", "400")
            .style("font-family","sans-serif")
            .style("fill", '#F95A36')
            .text(this.sla + '' + this.unit);
  
        }
      }
    }

    let defs = this.svg.append('defs');

    let filter = defs.append('filter').attr('id', 'dropshadow');

    let feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode').attr('in', 'offsetBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    let formatShort = this.getFormat();

    let width = 120;
    let height = 40;
    let fontSize = 10;
    let fontWeight = 400;
    let lineHeight = 15;

    if(this.full){
      width = 150;
      height = 50;
      fontSize = 14;
      fontWeight = 500;
      lineHeight = 20;
    }

    if (this._scale === 'week') {
      this.formatShort = d3.timeFormat('%d/%m/%Y');
    } else if (this._scale === 'day') {
      this.formatShort = d3.timeFormat('%d %b-%H:%Mhrs');
    } else {
      this.formatShort = d3.timeFormat('%d %b %H:%M');
    }

    let tip = d3Tip()
    .offset([-8, 0])
    .html((d)=> {
      let fecha = new Date(d.target.__data__.date);
      let fechaTool = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
      if(this.viewTooltip){
        if(this.dark){
          return " <div class='TooltipGenerated' style='width: "+ width +"px; height: "+ height +"px; border-radius: 3px; line-height: "+ lineHeight +"px; text-align: center; padding-top: 5px; font-size: "+ fontSize +"px; font-weight: "+ fontWeight +"; background: "+this.color+";'><span style='color: #FFFFFF !important'>"+this.formatShort(new Date(d.target.__data__.date))+"</span><br><span style='font-size: "+ (fontSize+1) +"px; font-weight: "+ (fontWeight+100) +"; color: #dbdbdb !important'><b>"+ (this.general ? 'Activos: ': '') + d.target.__data__.value +''+ this.unit +''+ (this.tickets ? this.tooltipLabel : '') + "</b></span></div>";
      }else{
          return " <div class='TooltipGenerated' style='width: "+ width +"px; height: "+ height +"px; border-radius: 3px; line-height: "+ lineHeight +"px; text-align: center; padding-top: 5px; font-size: "+ fontSize +"px; font-weight: "+ fontWeight +"; background: "+this.color+";'><span style='color: #0B112A !important'>"+this.formatShort(new Date(d.target.__data__.date))+"</span><br><span style='font-size: "+ (fontSize+1) +"px; font-weight: "+ (fontWeight+100) +";'><b>"+ (this.general ? 'Activos: ': '') + d.target.__data__.value +''+ this.unit +''+(this.tickets ? this.tooltipLabel : '') + "</b></span></div>";
      } 
      }
    });


    let widthSize
    this.svg.call(tip);
    if((this._scale == 'day' || this._scale == 'hour' || this.scale == 'minute') && !this.full){
      console.log(this._scale)
      widthSize = 10
    }else{
      widthSize = this.barWidth
    }
    let rects = this.svg
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (_: DateValue, i: number) => this.xScale(this.X[i]))
      .attr('width', widthSize)
      .attr('height', 0)
      .attr('y', (_: DateValue, i: number) => this.yScale(50))
      .on('mouseover', tip.show )
      .on('mouseleave', tip.hide);
    rects
      .transition()
      .delay(function (d, i) {
        return i * 50;
      })
      .duration(300)
      .attr('y', (_: DateValue, i: number) => this.yScale(this.Y[i]))
      .attr(
        'height',
        (_: DateValue, i: number) =>
          this.height - this.margin.bottom - this.yScale(this.Y[i])
      )
      .attr('fill', (_: DateValue, i) => {
        if (this.different) {
          if (d3.max(this.Y) == _.value) {
            return this.differentcolor;
          } else {
            return this.color;
          }
        } else {
          if (this.secondary) {
            if (i % 2 == 0) {
              return this.color;
            } else {
              return this.secondaryColor;
            }
          } else {
            return this.color;
          }
        }
      })
      .attr('fill-opacity', this.opacity)
      .style('stroke-width', (d) => {
        if (this.border) {
          return '1';
        } else {
          return 'none';
        }
      })
      .style('stroke', (d) => {
        if (this.border) {
          return '#285CED';
        } else {
          return 'none';
        }
      })
      .attr('rx', this.rx)
      .attr('cursor', 'pointer')
      .attr('filter', 'url(#dropshadow)');
  }

  private update() {
    if (!this.isInitiated) {
      return;
    }

    d3.selectAll('.d3-tip').remove();

    this.svg.selectAll('g').remove();

    this.svg.selectAll('rect').remove();

    this.svg.selectAll('line').remove();

    this.svg.selectAll('text').remove();

    this.create();
    this.defineXAxis();
    this.defineYAxis();
    this.setForms();
  }
}

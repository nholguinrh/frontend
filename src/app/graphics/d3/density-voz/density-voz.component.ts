import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import * as d3Collection from 'd3-collection';
import { ES_MX_LOCALE } from '../../../shared/const/es-mx-locale';
import { DateValue } from '../../../shared/model/date-value';
import { MarginConf } from '../../../shared/model/margin-conf';

@Component({
  selector: 'smc-density-voz',
  templateUrl: './density-voz.component.html',
  styleUrls: ['./density-voz.component.css']
})
export class DensityVozComponent implements OnInit, AfterViewInit {

  private static id = 0;
  componentId: number = 0;

  @ViewChild('my_dataviz') svgDensityChart: ElementRef;

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

  @Input() color: any[] = ['#75787D'];
  colorSelect: any[] = [];
  @Input('stroke-width') strokeWidth: number = 2;
  @Input('gradient-start') gradientStart: string = '#fee8bb';
  @Input('gradient-stop') gradientStop: string = 'rgba(253, 167, 0, 0.1)';
  @Input('tooltip-color') tooltipColor: string = 'rgba(253, 167, 0, 0.2)';

  @Input('select') select: number = 0;
  
  @Input() margin?: MarginConf = {
    top: 80,
    right: 10,
    bottom: 10,
    left: 30,
  };

  @Input() unit: string = '';
  // @Input() unit: string = '%';
  @Input() isDynamicRange = false;
  @Input() showSLA = false;
  @Input() sla = 84;
  @Input() range: number[] = [0,100];
  _showDomain: boolean = false;
  @Input() full: boolean = false;
  @Input() showAxis: boolean = true;
  @Input() showXLabels: boolean = true;
  @Input() showYLabels: boolean = true;

  
      

  _scale: 'week' | 'day' | 'hour' | 'minute' = 'week';
  @Input() set scale(val: 'week' | 'day' | 'hour' | 'minute') {
    this._scale = val;
    this.upadteScale();
  }


  _isDoubleArea: boolean = true;
  @Input() set isDoubleArea(val: boolean) {
    this._isDoubleArea = val;
    this.upadteScale();
  }

  @Input() showScale: boolean = true;


  width: number;
  height: number;
  X: any;
  Y: any;
  X2: any;
  Y2: any;
  T2: any;
  I: any;
  xAxis: any;
  xScale: any;
  yScale: any;
  yAxis: any;
  formatShort = d3.utcFormat('%d %b');
  format = d3.timeFormat('%d/%m/%Y');
  curveType: any = d3.curveCatmullRom;

  area: any;
  line: any;

  areaTwo: any;
  lineTwo: any;
  

  private svg;

  constructor() {
  }


  ngOnInit(): void {
    this.componentId = ++DensityVozComponent.id;
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
    this.colorSelect = []
    if(this.data.find(element => element.type === "Completa") != undefined && this.data.find(element => element.type === "Simultanea") != undefined){
      this.colorSelect = this.color
    }else if(this.data.find(element => element.type === "Completa") != undefined){
      this.colorSelect = [this.color[0]]
    }else{
      this.colorSelect = [this.color[1]]
    }
    
    this.svg = d3
      .select(this.svgDensityChart?.nativeElement)
      .append('svg')
      .attr('class', 'densityGraph')
      //.attr('fill', 'url(#densityGraph' + this.componentId + ')')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    this.X = d3.map(this.data, (d: DateValue) => d.date);
    this.Y = d3.map(this.data, (d: DateValue) => d.value);
    this.I = d3.range(this.X.length);

    const xDomain = d3.extent(this.X);
    
    let yDomain;
    let isNull = this.Y.find(element =>  element != null);
    if(!isNull){
      this.isDynamicRange = true;
      this.range = [0,1]; 
    }
    
    /* this.Y.forEach(element => {
      if(!element){
        this.isDynamicRange = true;
        this.range = [0,1]; 
      }
    }); */
    //const yDomain = [0, d3.max(this.Y)];
    if (this.isDynamicRange) {
      yDomain = this.range;
    } else {
      this.range = [
        Math.round(d3.min(this.Y) - d3.min(this.Y) * 0.1),
        Math.round(d3.max(this.Y) + d3.max(this.Y) * 0.1),
      ];
      if(this.range[0] < 10){
        this.range[0] = 0;
      }
      if(this.range[1] < 1){
        this.range[1] = 1;
      }
      yDomain = this.range;
    }

    const xType = d3.scaleUtc;
    const yType = d3.scaleLinear;

    const xRange = [this.margin.left, this.width - this.margin.right];
    const yRange = [this.height - this.margin.bottom, this.margin.top];

    this.xScale = xType(xDomain, xRange);
    this.yScale = yType(yDomain, yRange);

    //Tipo de curva
    this.curveType = d3.curveCatmullRom
    //this.curveType = d3.curveCatmullRom;

    //Funcion para pintar lineas
    this.defineAxis();
    
    //Definicion de Ejes X & Y
    if(this._isDoubleArea){

      this.X = d3.map(this.data.filter( function(d){return d.type === "Completa"} ), (d: DateValue) => d.date);
      this.Y = d3.map(this.data.filter( function(d){return d.type === "Completa"} ), (d: DateValue) => d.value);
      this.I = d3.range(this.X.length);
      this.X2 =  d3.map(this.data.filter( function(d){return d.type === "Simultanea"} ), (d: DateValue) => d.date);
      this.Y2 =  d3.map(this.data.filter( function(d){return d.type === "Simultanea"} ), (d: DateValue) => d.value);
      const I2 = d3.range(this.X2.length);

      const defined2 = (_d: DateValue, i: number) =>
      !isNaN(this.X2[i]) && (this.Y2[i] !== null);

      const D2 = d3.map(this.data, defined2);

      //Se agregan los datos en la area 2
      this.areaTwo = d3
        .area()
        .defined((_: DateValue, i: number) => D2[i])
        .curve(this.curveType)
        .x((_: DateValue, i: number) => this.xScale(this.X2[i]))
        .y0(this.yScale(this.range[0]))
        .y1((_: DateValue, i: number) => this.yScale(this.Y2[i]));

      this.lineTwo = d3
        .line()
        .defined((_: DateValue, i: number) => D2[i])
        .curve(this.curveType)
        .x((_: DateValue, i: number) => this.xScale(this.X2[i]))
        .y((_: DateValue, i: number) => this.yScale(this.Y2[i]));

        
      const defs = this.svg.append('defs');
      this.setAreaAverageGradientsSecond(defs);

         //Se transforma la area 2
         this.svg
         .append('path')
         .attr('fill', 'url(#densityGradientTwo' + this.componentId + ')')
         .attr('strock-width', '3')
         .attr('class', 'density-area' + this.componentId)
         .attr('d', this.areaTwo(d3.map(I2, (i: number) => [i, i])));
 
         this.svg
         .append('path')
         .attr('fill', 'none')
         .attr('stroke', this.colorSelect[1])
         .attr('stroke-width', this.strokeWidth)
         .attr('class', 'density-line' + this.componentId)
         .attr('d', this.lineTwo(d3.map(I2, (i: number) => [i, i])));
    }

    const defined = (_d: DateValue, i: number) =>
      !isNaN(this.X[i]) && (this.Y[i] !== null);
    const D = d3.map(this.data, defined);
    
    //Se agregan los datos en la area 1
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
    
    
    if(!(this.data.find(element => element.type === "Completa") != undefined && this.data.find(element => element.type === "Simultanea") != undefined)){
    }
    const defs = this.svg.append('defs');
    this.setAreaAverageGradients(defs);

    //Se transforma la area 1
      this.svg
      .append('path')
      .attr('fill', 'url(#densityGradientOne' + this.componentId + ')')
      .attr('strock-width', '3')
      .attr('class', 'density-area' + this.componentId)
      .attr('d', this.area(d3.map(this.I, (i: number) => [i, i])));
    
      this.svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', this.colorSelect[0])
      .attr('stroke-width', this.strokeWidth)
      .attr('class', 'density-line' + this.componentId)
      .attr('d', this.line(d3.map(this.I, (i: number) => [i, i])));
      

    //Mostrar el limite SLA
    if (this.showSLA) {
      this.svg.append("line")
        .attr("class", "line")
        .call(d3.line())
        .style("stroke", "#27509B")
        .style("stroke-dasharray", ("3, 2"))
        .style("stroke-width", 1)
        .attr("x1", this.margin.left)
        .attr("x2", this.width -10)
        .attr("y1", this.yScale(this.sla))
        .attr("y2", this.yScale(this.sla));

      this.svg.append("text")
        .attr("x", (this.width - 35))				
        .attr("y", this.yScale(this.sla))
        .style("font-size", "12px") 
        .style("font-weight", "400") 
        .style("font-family","sans-serif")
        .style("fill", '#27509B')
        .text(this.sla + '%');
    }

    //Tooltip
    if(!this._isDoubleArea && !this.isDynamicRange){
      this.tipD3();
    }

    

    return this.svg.node();
  }

  private setAreaAverageGradients(defs: any) {
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'densityGradientOne' + this.componentId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      //.attr('y1', '-1.92%')
      .attr('y1', '-43.68%')
      .attr('y2', '100%');
    areaGradient
      .append('stop')
      //.attr('offset', '-1.92%')
      .attr('offset', '-43.68%')
      .attr('stop-color', this.colorSelect[0])
      .attr('stop-opacity', 0.6);
    areaGradient
      .append('stop')
      //.attr('offset', '100%')
      .attr('offset', '100.49%')
      .attr('stop-color', this.colorSelect[0])
      .attr('stop-opacity', 0);
  }

  private setAreaAverageGradientsSecond(defs: any) {
    const areaGradientTwo = defs
      .append('linearGradient')
      .attr('id', 'densityGradientTwo' + this.componentId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      //.attr('y1', '-1.92%')
      .attr('y1', '-43.68%')
      .attr('y2', '100%');
    areaGradientTwo
      .append('stop')
      //.attr('offset', '-1.92%')
      .attr('offset', '-43.68%')
      .attr('stop-color', this.colorSelect[1])
      .attr('stop-opacity', 0.6);
    areaGradientTwo
      .append('stop')
      //.attr('offset', '100%')
      .attr('offset', '100.49%')
      .attr('stop-color', this.colorSelect[1])
      .attr('stop-opacity', 0);

  }

  private defineAxis(){
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);
    if(this.full){
      if (this._scale === 'week') {
        this.format = d3.timeFormat('%-d/%m/%Y - %H:%M');
      }else if (this._scale === 'hour') {
        this.format = d3.timeFormat('%H:%M');
      } else if (this._scale === 'minute'){
        this.format = d3.timeFormat('%M');
      }else {
        this.format = d3.timeFormat('%H:%M');
      }
    }else{
      if (this._scale === 'week') {
        this.format = d3.timeFormat('%d/%m/%Y');
      } else if (this._scale === 'day') {
        this.format = d3.timeFormat('%H hrs');
      } else if (this._scale === 'hour') {
        this.format = d3.timeFormat('%H:%M');
      } else if (this._scale === 'minute') {
        this.format = d3.timeFormat('%M');
      } else {
        this.format = d3.timeFormat('%d/%m/%Y');
      }
    }

    this.xAxis = d3
      .axisBottom(this.xScale)
      .tickSize(0)
      .tickFormat((d: Date) => this.format(new Date(d.toString())))
      .tickSizeInner(this.margin.top + this.margin.bottom - this.height)
      //.tickSizeInner(18)
      .tickSizeOuter(0);

    this.yAxis = d3
      .axisLeft(this.yScale)
      .tickSize(0)
      .tickFormat((d)=>{ return d + this.unit })
      .tickSizeInner(this.margin.right + this.margin.left - this.width)
      .ticks(d3.timeWeek.every(2))
      .tickSizeOuter(0)
      .tickPadding(5);

    if (true) {
      //if (this.full) {
        if (this._scale === 'week') {
          this.xAxis.tickValues(this.xScale.ticks(d3.timeDay.every(1)))
          //this.xAxis.tickValues(this.xScale.ticks(6));
        }else if (this._scale === 'day'){
          //this.xAxis.tickValues(this.xScale.ticks(this._data.length));
          this.xAxis.tickValues(this.xScale.ticks(12));
        }else if (this._scale === 'hour'){
          this.xAxis.tickValues(this.xScale.ticks(12));
        }else if (this._scale === 'minute'){
          this.xAxis.tickValues(this.xScale.ticks(12));
          //this.xAxis.tickValues([this.X[0], this.X[this.X.length - 1]]);
        }else {
          this.xAxis.tickValues([this.X[0], this.X[this.X.length - 1]]);
          //this.xAxis.tickValues(this.xScale.ticks(7));
        }
      //}
    } else {
      this.xAxis.tickValues(0);
    }

    if (this.showYLabels) {
      let r = this.range[1] - this.range[0];
      let d = 8;
      let array: number[] = [];
      let contador = 1;
      let rangoY;
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
      this.yAxis.tickValues(this.yScale.ticks(0)).tickPadding(5);
    }


    // Se pintan los ejes
    if(this.showAxis){
      this.svg
        .append('g')
        .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
        .style('font-size', '10px')
        .style('color', '#7C8DB5')
        .call(this.xAxis)
        .attr('class', 'ejeXDensity')
        .call((g: any) => {
          if (this._showDomain) {
            g.select('.domain').remove();
          }
        })
        .call((g: any) => g.selectAll('.tick line').remove())
        .call((g: any) => {
          if (!this.showScale) {
            g.selectAll('.tick').remove();
          }
        });

      
      this.svg
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',0)')
        .style('font-size', '10px')
        .style('font-weight', '600')
        .style('color', '#7C8DB5')
        .call(this.yAxis)
        .attr('class', 'ejeYDensity')
        .call((g: any) => {
          if (!this._showDomain) {
            g.select('.domain').remove();
          }
        })
        .call((g: any) => {
          return g.selectAll('.tick line').attr('opacity', 0.1);
        });
    }

  }


  private tipD3(){
    
    const focus = this.svg.append('g').style('display', 'none');

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

      const xOffset = this.svgDensityChart.nativeElement.offsetLeft;
      const yOffset = this.svgDensityChart.nativeElement.offsetTop;

      let formatShort: any;

      if (this._scale === 'week') {
        formatShort = d3.timeFormat('%d/%m/%Y');
      } else if (this._scale === 'day') {
        formatShort = d3.timeFormat('%H hrs');
      } else if (this._scale === 'hour') {
        formatShort = d3.timeFormat('%H:%M');
      } else if (this._scale === 'minute') {
        formatShort = d3.timeFormat('%M');
      } else {
        formatShort = d3.timeFormat('%d/%m/%Y');
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
      if(d.value != null){
    
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
            `<span style='font-size: 10px;'>${formatShort(
              d.date
            )}</span> <br> <span>${d.value + ' '}</span>`
          );
      }
    };

    const mouseOverEvent = (ev: any) => { 
      if(this.data.length > 0){ 
        focus.style('display', null);
        toltp.style('opacity', 1);
        toltp.style('background',this.colorSelect[0]);      
      }
    };

    const toltp = d3
      .select(this.svgDensityChart?.nativeElement)
      .append('div')
      .attr('class', 'd3-tip-area density')
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
    

  }


  private setTooltips = (focus: any, toltp: any) => {
    focus
      .append('circle')
      .attr('class', 'circleDensity y')
      .style('fill', '#FFFFFF')
      .style('opacity', 1)
      .style('stroke', this.colorSelect[0])
      .style('stroke-width', 3)
      .attr('r', 10);


    toltp
      .style('background', this.tooltipColor)
      .style('border-radius', '7')
      .attr('class', 'd3-tip-area simple density');
  };

  private upadteScale() {

    //d3.selectAll('svg').remove();
        d3.selectAll('.densityGraph').remove();

    /*d3.selectAll('.ejeXDensity').remove();
    d3.selectAll('.ejeYDensity').remove();
    d3.selectAll('.line').remove();
    d3.selectAll('.text').remove();
    d3.selectAll('.density-area' + this.componentId).remove();
    d3.selectAll('.density-line' + this.componentId).remove();
    d3.selectAll('#densityGradientOne' + this.componentId).remove();
    d3.selectAll('#densityGradientTwo' + this.componentId).remove();
    d3.selectAll('.circleDensity').remove();
    */
    
    
    
    
    this.setDimensions();
    this.draw();

    
  }


}

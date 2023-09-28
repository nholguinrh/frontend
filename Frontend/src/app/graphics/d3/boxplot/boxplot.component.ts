import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import * as d3 from 'd3';
import * as d3Collection from 'd3-collection';
import d3Tip from "d3-tip";
import { DateValue } from 'src/app/shared/model/date-value';
import { SpendValue } from 'src/app/shared/model/spend-value';
import { ES_MX_LOCALE } from 'src/app/shared/const/es-mx-locale';


@Component({
  selector: 'app-boxplot',
  templateUrl: './boxplot.component.html',
  styleUrls: ['./boxplot.component.css']
})
export class BoxplotComponent implements AfterViewInit, OnInit {

  private static id = 0;
  componentId: number = 0;

  @ViewChild('svg') svgBoxPlot: ElementRef;
  @Input() sizex: number = 530;
  @Input() sizey: number = 300;
  @Input() margin?: MarginConf = {
    top: 10,
    right: 0,
    bottom: 5,
    left: 35,
  };

  _showDomain: boolean = true;
  @Input() set showDomain(val: boolean) {
    this._showDomain = val;
  }

  _showScale: boolean = true;
  @Input() set showScale(val: boolean) {
    this._showScale = val;
  }

  private svg;
  g: any;

  width: number;
  height: number;

  X: any;
  Y: any;
  I: any;

  _data: Array<DateValue> = [];
  @Input() set data(val: Array<DateValue>) {
    this._data = val;
    this.update();
  }
  get data() {
    return this._data;
  }

  @Input() showXLabels = true;
  @Input() showYLabels = true;
  @Input() isDynamicRange = false;
  @Input() range: number[] = [50, 90];
  @Input() color: string = '#285CED';
  @Input() secondaryColor: string = '#DB5262';
  @Input('box-width') boxWidth: number = 5;
  @Input() rx: number = 5;
  
  @Input() full: boolean = false;
  @Input() showSLA: boolean = false;
  @Input() sla = 84;

  _scale: 'week' | 'day' | 'hour' = 'week';
  @Input() set scale(val: 'week' | 'day' | 'hour') {
    this._scale = val;
  }

  _unit: string = '%';
  @Input() set unit(val: string){
    this._unit = val;
  }

  get unit() {
    return this._unit;
  }

  xAxis: any;
  yAxis: any;
  xScale: any;
  yScale: any;
  formatShort: any;

  isInitiated: boolean = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.setDimensionsBlox();
    this.draw();
  }

  ngOnInit(): void {
    this.componentId = ++BoxplotComponent.id;
  }

  private create() {

    this.X = d3.map(this.data, (d: DateValue) => d.date);
    this.Y = d3.map(this.data, (d: DateValue) => d.value);
    this.I = d3.range(this.X.length);

    const xDomain = d3.extent(this.X);
    let yDomain;
    if(this.isDynamicRange){
      yDomain = this.range;
    }else{
      let inicio : number = d3.min(this.Y) - (d3.min(this.Y) * .20);
      if(inicio < 0 ){
        inicio = 0;
      }
      let fin : number = d3.max(this.Y) - (d3.max(this.Y) * .10);
      this.range =  [0, d3.max(this.Y)]
      yDomain = this.range;
    }

    const xType = d3.scaleTime;
    const yType = d3.scaleLinear;

    const xRange = [this.margin.left, this.width - this.margin.right];
    const yRange = [this.height - this.margin.bottom, this.margin.top];

    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);

    /* 12 DIAS */
    /* const formatShort = d3.timeFormat('%d %b'); */
    /* 12 HORAS */
    /* const formatShort = d3.timeFormat("%I %p"); */
    this.formatShort =  d3.timeFormat('%d %b');
    if(this._scale === 'week'){
      /* console.log('week'); */
      if(this.full){
        this.formatShort = d3.timeFormat('%m/%-d/%Y %I %p');
      }else{
        this.formatShort = d3.timeFormat('%d/%m/%Y');
      }
    }else if(this._scale === 'hour'){
      /* console.log('hour'); */
      this.formatShort = d3.timeFormat("%H:%M");
    }else{
      /* console.log('day'); */
      if(this.full){
        this.formatShort = d3.timeFormat("%H:%M");
      }else{
        this.formatShort = d3.timeFormat("%H hrs");
      }
    }

    this.xAxis = d3
    .axisBottom(xScale)
    .tickSize(0)
    .tickFormat((d: Date) => this.formatShort(new Date(d.toString())))
    .tickSizeInner(5)
    .tickSizeOuter(0);

    if(this.showXLabels){
      if(this._scale === 'week'){
        if(this.full){
          this.xAxis.tickValues(
            xScale.ticks(20)
          );
        }else{
          this.xAxis.tickValues(
            xScale.ticks(5)
          );
        }
      }else{
        if(this.full){
          this.xAxis.tickValues(
            xScale.ticks(40)
          );
        }else{
          this.xAxis.tickValues(
            xScale.ticks()
          );
        }
      }
    }else{
      this.xAxis.tickValues(
        xScale.ticks(0)
      );
    }

    this.yAxis = d3
      .axisLeft(yScale)
      .tickSize(0)
      .tickFormat((d)=>{ return d + this.unit })
      .tickSizeInner(this.margin.right + this.margin.left - this.width)
      .tickSizeOuter(0);

    if(this.showYLabels){

      let r = this.range[1] - this.range[0];
      let d;
      if(r > 10){
         d = r / 10;
      }else{
         d = 10;
      }
      
      let array: number[] = [];
      /* array.push(this.range[0]); */
      let contador = 1;
      let rangoY;
      if(this.range[1] <= 10){
        rangoY = 1;
      }else if(this.range[1] <= 100 && this.range[1] > 10){
        rangoY = 10;
      }else if(this.range[1] <= 1000 && this.range[1] > 100){
        rangoY = 100;
      }
      for (let index = 1; index < Math.round(d); index++) {
        array.push(this.range[0] + (rangoY * index))
        contador ++ ;
      }
      array.push(this.range[0] + (rangoY * contador));
      this.yAxis.tickValues(
        yScale.ticks(0).concat(array)
      ).tickPadding(15);
      
    }else{
      this.yAxis.tickValues(
        yScale.ticks(0)
      ).tickPadding(15);
    }

  }

  private defineXAxisBlox(){

    this.svg
    .append('g')
    .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
    .style('font-size', (g)=> {
      if(this.full){
        return '12px'
      }else{
        return '8px'
      }
    })
    .style('color', '#7C8DB5')
    .call(this.xAxis)
    .call((g: any) =>{
        if (!this._showDomain){
          g.select('.domain').remove()
        }
      }
    )
    .call((g: any) =>
        g.select('.tick:last-of-type text').style('color', '#285CED')
    )
    .call((g: any) => g.selectAll('.tick line').remove())
    .call((g: any) => {
      if (!this._showScale) {
        g.selectAll('.tick').remove();
      }
    });

    if(this.full){
      if(this._scale === 'hour'){
        this.svg
        .selectAll("text")
        .attr("transform", "translate(11, 25) rotate(90)");
      }else if(this._scale === 'day'){
        this.svg
        .selectAll("text")
        .attr("transform", "translate(-10,20) rotate(315)");
      }else{
        this.svg
        .selectAll("text")
        .attr("transform", "translate(-10,35) rotate(315)");
      }
    }
    
  }

  private defineYAxisBlox(){
    this.svg
    .append('g')
    .attr("transform", "translate(" + (this.margin.left) + ",0)")
    .style('font-size',  (g)=> {
      if(this.full){
        return '16px'
      }else{
        return '10px'
      }
    })
    .style('font-weight', '600')
    .style('color', '#7C8DB5')
    .call(this.yAxis)
    .call((g: any) => g.select('.domain').remove())
    .call((g: any) =>
        g.select('.tick:last-of-type text').style('color', '#285CED')
    )
    .call((g: any) => {
        return g.selectAll('.tick line').attr('opacity', 0.1);
    });
  }

  private draw() {

    this.create();

    this.svg = d3
    .select(this.svgBoxPlot.nativeElement)
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    this.defineXAxisBlox();
    this.defineYAxisBlox();
    this.isInitiated = true;
    this.setFormsBlox();
    
  }

  private setDimensionsBlox() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  private update() {
    
    if (!this.isInitiated) {
      return;
    }

    this.svg.selectAll("g")
    .remove();

    this.svg.selectAll("boxes")
    .remove();

    this.svg.selectAll("vertLines")
    .remove();

    this.svg.selectAll("rect")
    .remove();

    this.svg.selectAll("line")
    .remove();

    this.draw();    
  }

  private setFormsBlox(){
    let x = d3.scaleTime()
    .range([ this.margin.left, this.width - this.margin.right ])
    .domain(d3.extent(this.X));

    let y;
    if(this.isDynamicRange){
      y = d3.scaleLinear()
      .domain(this.range)
      .range([this.height - this.margin.bottom, this.margin.top]);
    }else{
      y = d3.scaleLinear()
      .domain([0, d3.max(this.Y)])
      .range([this.height - this.margin.bottom, this.margin.top]);
    }


    let sumstat = d3Collection.nest() 
    .key(d => d.date)
    .rollup(d=> {
      /* let q1 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.25)
      let median = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.5)
      let q3 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.75)
      let interQuantileRange = q3 - q1
      let min = q1 - 1.5 * interQuantileRange
      if(min < 0){
        min = 0;
      }
      let max = q3 + 1.5 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max}) */
      
      /* let valores = d.map(function(g) { return g.value;});
      let q1 = Math.round((d3.min(valores) * 1) /this.range[0]);
      let median = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.5)
      let q3 = Math.round((d3.max(valores) * 100) /this.range[1]);
      let interQuantileRange = q3 - q1
      let min = q1 - 5;
      if(min < 0){
        min = 0;
      }
      let max = q3+5;
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max}) */

      let valores = d.map(function(g) { return g.value;});
      let q1 = Math.round(d3.min(valores));
      let median = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.5)
      let q3 = Math.round((d3.max(valores)));
      let interQuantileRange = q3 - q1
      let min = q1 - 5;
      if(min < 0){
        min = 0;
      }
      let max = q3+5;
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    })
    .entries(this.data);

    this.svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", (d) => {return(x(new Date(d.key)))})
      .attr("x2", (d) => {return(x(new Date(d.key)))})
      .attr("y1", (d) => {return(y(0))})
      .attr("y2", (d) => {return(y(this.range[1]))})
      .attr("stroke", (d, i) => {
        if(d.value.q3 > 80 ){
          return this.color;
        }else{
          return this.secondaryColor;
        }
      })
      .style("width", 40);

    let tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([110, 0])
    .html((d)=> {
      if(this._scale === 'week'){
        let format =  d3.timeFormat('%d/%m/%Y');
        return " <div style='width: 100px; height: 85px; border-radius: 3px; line-height: 15px; padding-top: 5px; padding-left: 5px; background-color: #FFFFFF; border: 1px solid #C4C4C4; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); border-radius: 7px; font-size: 10px;' fxLayout='column' fxLayoutAlign='space-around start'>"+
          "<div><b>"+ format(new Date(d.target.__data__.key.toString()))  + "</b></div>" + 
          "<div>Min: <b>"+ d.target.__data__.value.min + "</b></div>" + 
          "<div>Max: <b>"+ d.target.__data__.value.max + "</b></div>" + 
          "<div>Apertura: <b>"+ d.target.__data__.value.q1 + "</b></div>" + 
          "<div>Cierre: <b>"+ d.target.__data__.value.q3 + "</b></div>" + 
        "</div>";
      }
      else{
        let format =  d3.timeFormat('%d/%m/%Y %H:%M hrs');
        return " <div style='width: 110px; height: 85px; border-radius: 3px; line-height: 15px; padding-top: 5px; padding-left: 5px; background-color: #FFFFFF; border: 1px solid #C4C4C4; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); border-radius: 7px; font-size: 10px;' fxLayout='column' fxLayoutAlign='space-around start'>"+
          "<div><b>"+ format(new Date(d.target.__data__.key.toString()))  + "</b></div>" + 
          "<div>Min: <b>"+ d.target.__data__.value.min + "</b></div>" + 
          "<div>Max: <b>"+ d.target.__data__.value.max + "</b></div>" + 
          "<div>Apertura: <b>"+ d.target.__data__.value.q1 + "</b></div>" + 
          "<div>Cierre: <b>"+ d.target.__data__.value.q3 + "</b></div>" + 
        "</div>";
      }
      
    });

    this.svg.call(tip);

    const defs = this.svg.append('defs');
    let filter = defs.append('filter')
    .attr('id', 'bluefilter')
    .attr("width", "300%")
    .attr("height", "300%")
    .attr("rx", this.rx)
    .attr("y","-20%")
    .attr("x","-60%");

    filter.append("feMorphology")
    .attr("in", "SourceGraphic")
    .attr("result", "upperLayer")
    .attr("operator", "dilate")
    .attr("radius", "5 5");

    filter.append("feMorphology")
      .attr("in", "SourceAlpha")
      .attr("result", "enlargedAlpha")
      .attr("operator", "dilate")
      .attr("radius", "6 10");

    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 5)
      .attr("result", "blur");
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 5)
      .attr("dy", 1)
      .attr("result", "offsetBlur")
    filter.append("feFlood")
      .attr("in", "offsetBlur")
      .attr("flood-color", this.color)
      .attr("flood-opacity", "0.3")
      .attr("result", "offsetColor");
    filter.append("feComposite")
      .attr("in", "offsetColor")
      .attr("in2", "offsetBlur")
      .attr("operator", "in")
      .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    const defs2 = this.svg.append('defs');
    let filter2 = defs2.append('filter')
    .attr('id', 'redfilter')
    .attr("width", "300%")
    .attr("height", "300%")
    .attr("rx", this.rx)
    .attr("y","-20%")
    .attr("x","-60%");
    
    filter2.append("feMorphology")
    .attr("in", "SourceGraphic")
    .attr("result", "upperLayer")
    .attr("operator", "dilate")
    .attr("radius", "5 5");

    filter2.append("feMorphology")
    .attr("in", "SourceAlpha")
    .attr("result", "enlargedAlpha")
    .attr("operator", "dilate")
    .attr("radius", "6 10");


    filter2.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 5)
      .attr("result", "blur");
    filter2.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 5)
      .attr("dy", 1)
      .attr("result", "offsetBlur")
    filter2.append("feFlood")
      .attr("in", "offsetBlur")
      .attr("flood-color", this.secondaryColor)
      .attr("flood-opacity", "0.3")
      .attr("result", "offsetColor");
    filter2.append("feComposite")
      .attr("in", "offsetColor")
      .attr("in2", "offsetBlur")
      .attr("operator", "in")
      .attr("result", "offsetBlur");

    var feMerge2 = filter2.append("feMerge");

    feMerge2.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge2.append("feMergeNode")
        .attr("in", "SourceGraphic");
    
    this.svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
    .on('mouseover', tip.show )
    .on('mouseout', tip.hide)
    .attr("x", (d)=>{return(x(new Date(d.key))-this.boxWidth/2)})
    .transition()
    .duration(200)
    .ease(d3.easeElastic)
    .attr("y", function(d){return(y(d.value.q3))})
    .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
    .transition()
    .delay(function(d, i){ return i * 20})
    .duration(200)
    .ease(d3.easeLinear)
    .attr("width", this.boxWidth )
    .attr("stroke", (d, i) => {
      if(d.value.q3 > 80){
        return this.color;
      }else{
        return this.secondaryColor;
      }
    })
    .attr("fill", (d, i) => {
      if(d.value.q3 > 80){
        return this.color;
      }else{
        return this.secondaryColor;
      }
    })
    .attr("rx", this.rx)
    .style('box-shadow', '0 0 5px 5px red')
    .attr("cursor", "pointer")
    .attr("filter", (d, i) => {
      if(d.value.q3 > 80){
        return "url(#bluefilter)"
      }else{
        return "url(#redfilter)"
      }
    });

    if (this.showSLA) {

      this.svg
          .append('line')
          .attr('class', 'line')
          .call(d3.line())
          .style('stroke', '#F95A36')
          .style('stroke-dasharray', '3, 2')
          .style('stroke-width', 1)
          .attr('x1', this.margin.left)
          .attr('x2', this.full ? this.width - this.margin.right : this.width + this.rx + 10)
          .attr('y1', y(this.sla))
          .attr('y2', y(this.sla));

        this.svg.append("text")
          .attr("x", this.full ? (this.width + 5 - this.margin.right) : (this.width + 15))				
          .attr("y", y(this.sla - 0.4))
          .style("font-size", this.full ? '14px' : '10px') 
          .style("font-weight", "400") 
          .style("font-family","sans-serif")
          .style("fill", '#F95A36')
          .text(this.sla + '' + this.unit);

    }

  }

}
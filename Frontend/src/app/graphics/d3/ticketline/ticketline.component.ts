import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import * as d3 from 'd3';
import * as d3Collection from 'd3-collection';
import d3Tip from 'd3-tip';
import { DateValue } from 'src/app/shared/model/date-value';
import { SpendValue } from 'src/app/shared/model/spend-value';
import { ES_MX_LOCALE } from 'src/app/shared/const/es-mx-locale';

@Component({
  selector: 'app-ticketline',
  templateUrl: './ticketline.component.html',
  styleUrls: ['./ticketline.component.css'],
})
export class TicketlineComponent implements AfterViewInit, OnInit, OnDestroy {
  private static id = 0;
  componentId: number = 0;
  @Input() strokeWidth: number = 2;
  isInitiated: boolean = false;

  @Input() isFull: boolean = false;

  @ViewChild('ticketline') svgTicket:ElementRef;
  @Input() sizex: number;
  @Input() sizey: number;
  @Input() margin?: MarginConf = {
    top: 20,
    right: 0,
    bottom: 10,
    left: 20,
  };
  @Input() isDynamicRange = false;
  @Input() range: number[] = [0, 100];
  @Input() metric: number = 10;
  @Input() colors: string[] = ['#00CF99', '#F7B500'];
  @Input() showXLabels = true;
  @Input() showYLabels = true;
  @Input() showYDomain = false;
  @Input() showTips = false;
  @Input() curve = true;
  @Input() showLast = false;
  @Input() showGradient = false;
  @Input('gradient-start') gradientStart: string[] = ['#97aff3', '#F7B500'];
  @Input('gradient-stop') gradientStop: string[] = [
    'rgba(151,175,243, 0.01)',
    'rgba(253, 167, 0, 0.1)',
  ];
  @Input() gridx: boolean = false;
  @Input() gridy: boolean = false;
  @Input() month: boolean = false;
  @Input() domainOpacity: boolean = true;
  @Input() dark: boolean = false;

  _showDomain: boolean = false;
  @Input() set showDomain(val: boolean) {
    this._showDomain = val;
  }

  _showScale: boolean = true;
  @Input() set showScale(val: boolean) {
    this._showScale = val;
  }
  @Input() unit: string = '';

  private svg;
  public g: any;

  private width: number;
  private height: number;

  X: any;
  Y: any;
  I: any;
  D: any;

  xAxis: any;
  yAxis: any;
  xScale: any;
  yScale: any;

  formatShort = d3.utcFormat('%d %b');
  @Input() full: boolean = false;

  private area: any;
  private line: any;

  _data: Array<SpendValue> = [];
  @Input() set data(val: Array<SpendValue>) {
    this._data = val;
    this.update();
  }
  get data() {
    return this._data;
  }

  _scale: 'week' | 'day' | 'hour' | 'minute'  = 'week';
  @Input() set scale(val: 'week' | 'day' | 'hour' | 'minute' ) {
    this._scale = val;
  }

  constructor(){
    if (this.showTips) {
      console.log('Quitando Tooltips d3-tip');
      d3.selectAll('.d3-tip').remove();
    }else{
      console.log('Quitando Tooltips d3-tip-general');
      d3.selectAll('.d3-tip-general').remove();
    }
  }

  ngOnDestroy(): void {
    d3.selectAll('.d3-tip').remove();
    d3.selectAll('.d3-tip-general').remove();
  }

  ngOnInit(): void {
    this.componentId = ++TicketlineComponent.id;
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.draw();
    
  }

  private draw() {
    
    this.svg = d3
    .select(this.svgTicket.nativeElement)
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .attr('style', 'max-width: 100%;');
    
    this.isInitiated = true;
    this.create();
    this.defineAxis();
    this.setForms();
    

  }

  private create() {
    this.X = d3.map(this.data, (d: SpendValue) => d.date);
    this.Y = d3.map(this.data, (d: SpendValue) => d.value);
    this.I = d3.range(this.X.length);

    const defined = (_d: DateValue, i: number) =>
      !isNaN(this.X[i]) && (this.Y[i] !== null);

    this.D = d3.map(this.data, defined);

    const xDomain = d3.extent(this.X);
    let yDomain;
    if (this.isDynamicRange) {
      //yDomain = this.range;
      yDomain = [d3.min(this.Y) - (d3.min(this.Y) * .1), d3.max(this.Y) + (d3.max(this.Y) * .1)];
    } else {
      yDomain = [0, d3.max(this.Y) + (d3.max(this.Y) * .1)];
    }

    const xType = d3.scaleTime;
    const yType = d3.scaleLinear;

    const xRange = [this.margin.left, this.width - this.margin.right];
    const yRange = [this.height - this.margin.bottom, this.margin.top];

    this.xScale = xType(xDomain, xRange);
    this.yScale = yType(yDomain, yRange);

    
  }

  private defineAxis() {

    d3.timeFormatDefaultLocale(ES_MX_LOCALE);

    let formatShort =  d3.timeFormat('%d %b');
    if(this._scale === 'week'){
      if(this.full){
        formatShort = d3.timeFormat('%d/%m/%Y');
      }else{
        if(this.month){
          formatShort = d3.timeFormat('%d');
        }else{
          formatShort = d3.timeFormat('%d/%m/%Y');
        }
      }
    }else if(this._scale === 'hour'){
      formatShort = d3.timeFormat("%H:%M");
    } else if (this._scale === 'minute'){
      formatShort = d3.timeFormat('%M');
    }else{
      if(this.full){
        formatShort = d3.timeFormat("%H:%M");
      }else{
        formatShort = d3.timeFormat("%H hrs");
      }
    }

    this.xAxis = d3
    .axisBottom(this.xScale)
    .tickSize(0)
    .tickFormat((d: Date) => formatShort(new Date(d.toString())))
    .tickSizeInner(this.margin.top + this.margin.bottom - this.height)
    .tickSizeOuter(0);

    if(this.showXLabels){
      if(this._scale === 'week'){
        if(this.full){
          this.xAxis.tickValues(
            this.xScale.ticks(30)
          ).tickPadding(8);
        }else{
          if(this.month){
            this.xAxis.tickValues(
              this.xScale.ticks(20)
            ).tickPadding(8);
          }else{
            this.xAxis.tickValues(
              this.xScale.ticks(5)
            ).tickPadding(8);
          }
        }
      }else if (this.scale === 'minute'){
        this.xAxis.tickValues(this.xScale.ticks(12));
      }else{
        if(this.full){
          this.xAxis.tickValues(
            this.xScale.ticks(40)
          ).tickPadding(8);
        }else{
          this.xAxis.tickValues(
            this.xScale.ticks()
          ).tickPadding(8);
        }
      }
    }else{
      this.xAxis.tickValues(
        this.xScale.ticks(0)
      ).tickPadding(8);
    }

    this.yAxis = d3
      .axisLeft(this.yScale)
      .tickSize(0)
      .ticks(1)
      .tickSizeInner(1)
      .tickSizeOuter(0);

    this.yAxis = d3
    .axisLeft(this.yScale)
    .tickSize(0)
    .tickFormat((d)=>{ return d + this.unit })
    .tickSizeInner(this.margin.right + this.margin.left - this.width)
    .tickSizeOuter(0);

    if(this.showYLabels){

      if(this.isDynamicRange){
        let r = this.range[1] - this.range[0];
        let d = r / this.metric;
        let array: number[] = [];
        array.push(this.range[0]);
        for (let index = 1; index < d; index++) {
          array.push(this.range[0] + (this.metric * index))
        }
        array.push(this.range[1]);
        this.yAxis.tickValues(
          this.yScale.ticks(0).concat(array)
        ).tickPadding(15);
      }else{
        this.yAxis.tickValues(
          this.yScale.ticks()
        ).tickPadding(15);
      }
    }else{
      this.yAxis.tickValues(
        this.yScale.ticks(0)
      ).tickPadding(15);
    }
    
  }

  private transformLabels() {
    if(this.full){
        this.svg
        .selectAll("text")
        .attr("transform", "translate(-10,35) rotate(-50)");
    }
  }

  private setGradients(id: any, defs: any, start: string, stop: string) {
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'areaGradient' + id)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '-43.68%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '-43.68%')
      .attr('stop-color', start);

    areaGradient
      .append('stop')
      .attr('offset', '100.49%')
      .attr('stop-color', stop);
  }

  private update() {

    if (!this.isInitiated) {
      return;
    }          
    
    this.svg.selectAll("g")
    .remove();

    this.svg.selectAll("line")
    .remove();

    this.svg.selectAll("path")
    .remove();

    this.svg.selectAll("circle")
    .remove();
    

    this.create();
    this.defineAxis();
    this.setForms();
    
  }

  private setForms(){
    let sumstat = d3Collection
      .nest()
      .key((d) => d.media)
      .entries(this.data);

    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
      .style('font-size', (g) => {
        if (this.isFull) {
          return '12px';
        } else {
          return '7px';
        }
      })
      .style('color', '#7C8DB5')
      .call(this.xAxis)
      .attr('class', 'ejeX')
      .call((g: any) => {
        if (!this._showDomain) {
          g.select('.domain').remove();
        }else{
          if(this.domainOpacity){
            g.select('.domain').attr('opacity', 0.2);
          }
        }
      })
      .call((g: any) => {
        if (!this.gridx) {
          return g.selectAll('.tick line').remove();
        } else {
          return g.selectAll('.tick line').attr('opacity', 0.1);
        }
      })
      .call((g: any) => {
        if (!this._showScale) {
          g.selectAll('.tick').remove();
        }
      });

      this.transformLabels();
      
    this.svg
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',0)')
      .style('font-size', this.isFull ? '18px' : '8px')
      .style('color', '#7C8DB5')
      .call(this.yAxis)
      .attr('class', 'ejeY')
      .call((g: any) => {
        if(this.showYDomain){
          return g.select('.domain')
        }else{
          return g.select('.domain').remove()}
        }  
      )
      .call((g: any) => {
        if (!this.gridy) {
          return g.selectAll('.tick line').remove();
        } else {
          return g.selectAll('.tick line').attr('opacity', 0.2);
        }
      });

    let x = d3
      .scaleTime()
      .range([this.margin.left, this.width - this.margin.right])
      .domain(d3.extent(this.X));

    let y;
    if (this.isDynamicRange) {
      y = d3
        .scaleLinear()
        .domain(this.range)
        .range([this.height - this.margin.bottom, this.margin.top]);
    } else {
      y = d3
        .scaleLinear()
        .domain([0, d3.max(this.Y) + (d3.max(this.Y) * .1)])
        .range([this.height - this.margin.bottom, this.margin.top]);
    }

    const defs = this.svg.append('defs');

    let typeCurve
    if(this.curve){
      typeCurve = d3.curveMonotoneX
      //  this.curveType = d3.curveCatmullRom;
    }else{
      typeCurve = d3.curveCardinal
    }

    let linea = d3
      .area()
      .defined((_: DateValue, i: number) => this.D[i])
      .curve(typeCurve)
      .x((_: DateValue, i: number) => this.xScale(this.X[i]))
      .y((_: DateValue, i: number) => this.yScale(this.Y[i]));

    this.svg
      .selectAll('.line')
      .append('g')
      .attr('class', 'line')
      .data(sumstat)
      .enter()
      .append('path')
      .attr('class', 'tickline-line-chart' + this.componentId)
      .transition()
      .duration(1000)
      .attr('d', (d) => {
        if(this.showTips){
          return d3
          .line()
          .x((d) => x(d.date))
          .y((d) => y(d.value))
          
          .curve(d3.curveLinear)
          .defined((_: DateValue, i: number) => this.D[i])
          /*.defined(function (d) {
            return d.value;
          })(d.values);*/
        }else{

          return linea(d3.map(this.I, (i: number) => [i, i]))
        }
          /*
          return d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.value))
            .curve(d3.curveLinear)
            .defined(function (d) {
              return d.value;
            })(d.values);*/
      })
      .attr('fill', 'none')
      .attr('stroke', (d, i) => {
        return this.colors[i];
      })
      .attr('stroke-width', this.strokeWidth);

    this.area = d3
      .area()
      .defined((_: DateValue, i: number) => this.D[i])
      .curve(typeCurve)
      .x((_: DateValue, i: number) => this.xScale(this.X[i]))
      .y0(this.yScale(0))
      .y1((_: DateValue, i: number) => this.yScale(this.Y[i]));

    this.svg
      .append('path')
      .attr('fill', (d, i) => {
        if (this.showGradient) {
          let id = this.componentId + '' + i;
          this.setGradients(
            id,
            defs,
            this.gradientStart[i],
            this.gradientStop[i]
          );
          return 'url(#areaGradient' + id + ')';
        } else {
          return 'none';
        }
      })
      .attr('class', 'tickline-area-chart' + this.componentId)
      .style('cursor', 'pointer')
      .transition()
      .duration(1000)
      .attr('fill-opacity', () => {
        if(this.dark){
          return 0.4
        }else{
          return 0.8
        }
      })
      .attr('d', this.area(d3.map(this.I, (i: number) => [i, i])));      

    let offsetGeneral
    
    if (this.showTips) {
      if(this.isFull){
        offsetGeneral = [55, 8]
      }else{
        offsetGeneral = [45, 8]
      }
      let tip = d3Tip()
        .attr('class', 'd3-tip-general')
        .offset(offsetGeneral)
        .html((d) => {
          let format;
          if(this._scale != 'minute'){
            format =  d3.timeFormat('%d/%m/%Y');
          }
          if(this._scale == 'minute'){
            format = d3.timeFormat("%H:%M");
          }
          if(this.isFull){
            return (
              `<div style='width: 170px; height: 70px; margin-left: -10px; border-radius: 3px; background-color: #fdf0cc; font-size: 20px; line-height: 25px; text-align: center; padding-top: 5px; color: #8f8f8f;'>
                ${format(d.target.__data__.date)} <br><b> ${d.target.__data__.value}
                </b></div><div class='image-dashboard-tooltip-ticketline2' style='width: 140px; height: 50px; margin-top: 10px; background-size: 50px 50px;'></div>
              `);
          }else{
            return (
              `<div style='width: 85px; height: 35px; margin-left: -10px; border-radius: 3px; background-color: #fdf0cc; font-size: 8px; line-height: 11px; text-align: center; padding-top: 5px; color: #8f8f8f;'>
                ${format(d.target.__data__.date)} <br><b> ${d.target.__data__.value} 
                </b></div><div class='image-dashboard-tooltip-ticketline2' style='width: 60px; height: 25px; background-size: 30px 30px;'></div>
              `);
          }     
        });

      this.svg.call(tip);
      let contador 
      contador = contador + 1;
      let secondTip = d3Tip()
        .attr('class', 'd3-tip-general')
        .offset(offsetGeneral)
        .html((d) => {
          let format;
          if(this._scale != 'minute'){
            format =  d3.timeFormat('%d/%m/%Y');
          }
          if(this._scale == 'minute'){
            format = d3.timeFormat("%H:%M");
          }
          if(this.isFull){
            return (
              `<div style='width: 170px; height: 70px; margin-left: -10px; border-radius: 3px; background-color: #ccf5eb; font-size: 20px; line-height: 25px; text-align: center; padding-top: 5px; color: #8f8f8f;'>
                ${format(d.target.__data__.date)} <br><b> ${d.target.__data__.value}
                </b></div><div class='image-dashboard-tooltip-ticketline3' style='width: 140px; height: 50px; margin-top: 10px; background-size: 50px 50px;'></div>
              `);
          }else{
            return (
              `<div style='width: 85px; height: 35px; margin-left: -10px; border-radius: 3px; background-color: #ccf5eb; font-size: 8px; line-height: 11px; text-align: center; padding-top: 5px; color: #C4C4C4;'>
                ${format(d.target.__data__.date)} <br><b> ${d.target.__data__.value}
                </b></div><div class='image-dashboard-tooltip-ticketline3' style='width: 60px; height: 25px; background-size: 30px 30px;'></div>
              `);
          }
        });

      this.svg.call(secondTip);

      this.svg
        .selectAll('circles')
        .data(sumstat[0].values.filter((x) => x.value >= 0))
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', (d) => {
          return x(d.date);
        })
        .attr('cy', (d) => {
          return y(d.value);
        })
        .attr("stroke-width", 1)
        .attr('r', (d) => 30)
        .style('fill', 'transparent')
        .style('cursor', 'pointer')
        .attr('fill-opacity', 1)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

      this.svg
        .selectAll('circlesSecondary')
        .data(sumstat[1].values.filter((x) => x.value >= 0))
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', (d) => {
          return x(d.date);
        })
        .attr('cy', (d) => {
          return y(d.value);
        })
        .attr("stroke-width", 10)
        .attr('r', (d) => 30)
        .style('fill', 'transparent')
        .style('cursor', 'pointer')
        .attr('fill-opacity', 1)
        .on('mouseover', secondTip.show)
        .on('mouseout', secondTip.hide);
    }else{
      if(this.isFull){
        offsetGeneral = [55, 10]
      }else{
        offsetGeneral = [45, 10]
      }
      let tipGeneral = d3Tip()
        .attr('class', 'd3-tip-general')
        .offset(offsetGeneral)
        .html((d) => {
          let format;
          if(this._scale != 'minute'){
            format =  d3.timeFormat('%d/%m/%Y');
          }
          if(this._scale == 'minute'){
            format = d3.timeFormat("%H:%M");
          }
          console.log('Es pantalla completa: '+ (this.isFull?'Si':'No'));
          if(this.isFull){
            return (            
              " <div style='width: 170px; height: 70px; margin-left: -10px; border-radius: 3px; "
                  +"background-color: #d7e1fb; font-size: 20px; line-height: 25px; text-align: center; padding-top: 5px; color: #3062ee;'>" +
              format(d.target.__data__.date) +
              '<br><b>Activos: ' +
              d.target.__data__.value + ' '+ this.unit +
              "</b></div><div class='image-dashboard-tooltip-ticketline3' style='width: 140px; height: 50px; margin-top: 10px; background-size: 50px 50px;'></div>"
            );
          }else{
            return (            
              " <div style='width: 85px; height: 35px; margin-left: -10px; border-radius: 3px; "
                  +"background-color: #d7e1fb; font-size: 8px; line-height: 11px; text-align: center; padding-top: 5px; color: #3062ee;'>" +
              format(d.target.__data__.date) +
              '<br><b>Activos: ' +
              d.target.__data__.value + ' '+ this.unit +
              "</b></div><div class='image-dashboard-tooltip-ticketline3' style='width: 60px; height: 25px;     background-size: 30px 30px;'></div>"
            );
          }
        });

      this.svg.call(tipGeneral);
      
      this.svg
        .selectAll('circles')
        .data(sumstat[0].values.filter((x) => x.value >= 0))
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', (d) => {
          return x(d.date);
        })
        .attr('cy', (d) => {
          return y(d.value);
        })
        .attr("stroke-width", 10)
        .attr('r', (d) => 30)
        .style('fill', 'transparent')
        .style('cursor', 'pointer')
        .attr('fill-opacity', 1) 
        .on('mouseover', tipGeneral.show)
        .on('mousemove', tipGeneral.show)
        .on('mouseout', tipGeneral.hide);
    }

    if (this.showLast) {
      let last = sumstat[1].values.filter((x) => x.value >= 0);
      
      this.svg
        .selectAll('circlesSecondary')
        .data([last[last.length - 1]].filter((x) => x.value >= 0))
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', (d) => {
          return x(d.date);
        })
        .attr('cy', (d) => {
          return y(d.value);
        })
        .attr('r', (d) => 5)
        .style('fill', '#285CED')
        .attr('stroke', (d, i) => {
          return this.colors[1];
        })
        .attr('stroke-width', this.strokeWidth)
        .style('cursor', 'pointer')
        .attr('fill-opacity', 1);
    }
    
  }
  
  
}

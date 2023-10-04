import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import * as d3 from 'd3';

@Component({
  selector: 'smc-one-bar',
  templateUrl: './one-bar.component.html',
  styles: [],
})
export class OneBarComponent implements AfterViewInit, OnInit {
  @ViewChild('onebarline') svgOneBar: ElementRef;
  @Input() sizex: number;
  @Input() sizey: number;
  @Input() margin?: MarginConf = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  @Input() color: string;
  @Input() background: string;
  @Input() rx: number;
  @Input('border-color') border: string;
  @Input() titulo: string;

  private _value: number;
  @Input() set value(val: number) {
    this._value = val;
  }
  get value() {
    return this._value;
  }

  @Input() max: number;

  @Input() textcolor: string = '#000000';
  @Input() textx: number = 40;
  @Input() texty: number = 13;
  @Input() transparent: boolean = true;
  @Input() varian: boolean = false;

  private svg;
  public g: any;

  private width: number;
  private height: number;
  private boxShadow: string;
  contador: number = 0;

  private xAxisDef: any;
  private yAxisDef: any;

  private isInitiated: boolean = false;

  datos: any;

  @Input() set valores(val: any) {
    console.log('Valores', val);
  }

  constructor() {}

  ngOnInit(): void {
    this.boxShadow =
      this.sizey < 5 ? '0px 5px 3px rgba(0, 0, 0, 0.25)' : 'none';
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    //TODO: Esta asignación no tiene sentido
    let data = [{ title: this.titulo, value: this.value }];
    this.datos = data;
    this.draw(data);
    this.contador = this.contador + 1;
  }

  private draw(data) {
    this.svg = d3
      .select(this.svgOneBar.nativeElement)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr(
        'style',
        'max-width: 100%; height: auto; height: intrinsic; box-shadow:' +
          this.boxShadow +
          ';'
      );

    let x = d3
      .scaleLinear()
      .domain([0, this.max + 2])
      .range([0, this.width]);

    var y = d3
      .scaleBand()
      .range([0, this.height])
      .domain(
        data.map(function (d) {
          return d.title;
        })
      )
      .padding(0.1);

    if (!this.isInitiated) {
      this.xAxisDef = this.svg
        .append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');
      this.yAxisDef = this.svg.append('g');
    }

    this.xAxisDef
      .transition()
      .duration(2000)
      .call(d3.axisBottom(x))
      .on('start', () => {
        this.svg.select('.domain').remove();
        this.svg.selectAll('.tick').remove();
      });

    this.yAxisDef
      .transition()
      .duration(2000)
      .call(d3.axisLeft(y))
      .on('start', () => {
        this.svg.select('.domain').remove();
      });

    this.svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('stroke', this.border)
      .attr('stroke-width', 2)
      .style('opacity', 1)
      .style('fill', this.transparent ? 'transparent' : this.background)
      .attr('rx', this.rx);

    const u = this.svg.selectAll('.myRect' + this.contador).data(data);

    u.join('rect')
      .transition()
      .duration(2000)
      .attr('x', x(1))
      .attr('y', function (d) {
        return y(d.title);
      })
      .attr('width', function (d) {
        return x(d.value);
      })
      .attr('height', y.bandwidth())
      .attr('fill', this.color)
      .attr('fill-opacity',  () =>{
        let value;
        console.log('d:',this.color);
        if(this.color == '#285CED'){
          value = '0.5'
        }else{
          value = '10'
        }
        return value;
      })
      .attr('rx', this.rx)
      .attr('class', 'myRect' + this.contador);

    this.svg
      .append('text')
      .attr('x', this.textx)
      .attr('y', this.texty)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('font-family', 'sans-serif')
      .style('fill', this.textcolor)
      .text(this.titulo);

    this.isInitiated = true;
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  private create() {}

  private update(datos) {
    if (!this.isInitiated) {
      return;
    }
    this.draw(datos);
  }
}

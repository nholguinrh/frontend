import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import * as d3 from 'd3';
import { ES_MX_LOCALE } from '../../../shared/const/es-mx-locale';

import { InterfaceDateValue } from '../../../shared/model/interface-date-value';
import { InterfaceValue } from '../../../shared/model/interface-value';
import { MarginConf } from '../../../shared/model/margin-conf';

@Component({
  selector: 'app-lines-group-full-size',
  templateUrl: './lines-group-full-size.component.html',
  styles: [
    `
      .border {
        border: 1px solid #000000 !important;
        border-radius: 10px;
        padding-top: 14px;
        padding-bottom: 17px;
        padding-inline: 19px;
      }

      .lines-group-chart-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: #0b112a;
      }
    `,
  ],
})
export class LinesGroupFullSizeComponent implements OnInit {
  private static id = 0;
  componentId: number = 0;

  @ViewChild('linesGroupFullSize') linesGroupChart: ElementRef;
  @ViewChild('complementaryFullSize') complementaryChart: ElementRef;

  _data: Array<InterfaceDateValue> = [];
  @Input() set data(val: Array<InterfaceDateValue>) {
    this._data = val;
    this.update();
  }
  get data() {
    return this._data;
  }

  _dataComplementary: Array<InterfaceValue> = [];
  @Input() set dataComplementary(val: Array<InterfaceValue>) {
    this._dataComplementary = val;
  }
  get dataComplementary() {
    return this._dataComplementary;
  }

  @Input() margin?: MarginConf = {
    top: 30,
    right: 10,
    bottom: 30,
    left: 70,
  };

  @Input() marginComplementary?: MarginConf = {
    top: 30,
    right: 70,
    bottom: 80,
    left: 10,
  };

  @Input() title: string;
  @Input() titleC: string;

  @Input() sizex: number = 530;
  @Input() sizey: number = 200;
  @Input() sizexC: number = 200;
  @Input() sizeyC: number = 200;

  @Input() color: string = '#FFBD14';
  @Input() secondaryColor: string = '#C4C4C4';

  @Input() unidad: string = 'Mbps';

  @Input() selectedInterface: string = '';

  widthComplementary: number;
  heightComplementary: number;

  width: number;
  height: number;

  private isInitiated: boolean = true;
  private xAxisDef: any;
  private yAxisDef: any;

  constructor() {
    this._data = [
      { date: new Date(2022, 9, 10), value: 31, interface: 'Interface 1' },
      { date: new Date(2022, 9, 11), value: 50, interface: 'Interface 1' },
      { date: new Date(2022, 9, 12), value: 29, interface: 'Interface 1' },
      { date: new Date(2022, 9, 13), value: 32, interface: 'Interface 1' },
      { date: new Date(2022, 9, 14), value: 31, interface: 'Interface 1' },
      { date: new Date(2022, 9, 15), value: 30, interface: 'Interface 1' },
      { date: new Date(2022, 9, 16), value: 27, interface: 'Interface 1' },
      { date: new Date(2022, 9, 17), value: 33, interface: 'Interface 1' },
      { date: new Date(2022, 9, 18), value: 35, interface: 'Interface 1' },
      { date: new Date(2022, 9, 19), value: 50, interface: 'Interface 1' },
      { date: new Date(2022, 9, 20), value: 32, interface: 'Interface 1' },
      { date: new Date(2022, 9, 21), value: 28, interface: 'Interface 1' },
      { date: new Date(2022, 9, 22), value: 37, interface: 'Interface 1' },
      { date: new Date(2022, 9, 10), value: 31 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 11), value: 33 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 12), value: 29 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 13), value: 32 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 14), value: 31 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 15), value: 30 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 16), value: 27 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 17), value: 33 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 18), value: 35 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 19), value: 15 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 20), value: 32 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 21), value: 28 - 1, interface: 'Interface 2' },
      { date: new Date(2022, 9, 22), value: 37 - 12, interface: 'Interface 2' },
      {
        date: new Date(2022, 9, 10),
        value: 31 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 11),
        value: 33 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 12),
        value: 29 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 13),
        value: 32 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 14),
        value: 31 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 15),
        value: 30 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 16),
        value: 27 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 17),
        value: 33 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 18),
        value: 35 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 19),
        value: 15 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 20),
        value: 32 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 21),
        value: 28 - 2.54,
        interface: 'Interface 3',
      },
      {
        date: new Date(2022, 9, 22),
        value: 37 - 2.54,
        interface: 'Interface 3',
      },

      {
        date: new Date(2022, 9, 10),
        value: 31 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 11),
        value: 33 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 12),
        value: 29 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 13),
        value: 32 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 14),
        value: 31 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 15),
        value: 30 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 16),
        value: 27 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 17),
        value: 33 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 18),
        value: 35 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 19),
        value: 15 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 20),
        value: 32 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 21),
        value: 28 - 3.2,
        interface: 'Interface 4',
      },
      {
        date: new Date(2022, 9, 22),
        value: 37 - 3.2,
        interface: 'Interface 4',
      },
      { date: new Date(2022, 9, 10), value: 31 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 11), value: 33 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 12), value: 29 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 13), value: 32 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 14), value: 31 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 15), value: 30 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 16), value: 27 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 17), value: 33 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 18), value: 35 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 19), value: 15 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 20), value: 32 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 21), value: 28 - 4, interface: 'Interface 5' },
      { date: new Date(2022, 9, 22), value: 37 - 4, interface: 'Interface 5' },
      {
        date: new Date(2022, 9, 10),
        value: 31 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 11),
        value: 33 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 12),
        value: 29 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 13),
        value: 32 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 14),
        value: 31 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 15),
        value: 30 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 16),
        value: 27 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 17),
        value: 33 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 18),
        value: 35 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 19),
        value: 15 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 20),
        value: 32 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 21),
        value: 28 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 22),
        value: 37 - 5.2,
        interface: 'Interface 6',
      },
      {
        date: new Date(2022, 9, 10),
        value: 31 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 11),
        value: 33 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 12),
        value: 29 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 13),
        value: 32 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 14),
        value: 31 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 15),
        value: 30 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 16),
        value: 27 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 17),
        value: 33 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 18),
        value: 35 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 19),
        value: 15 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 20),
        value: 32 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 21),
        value: 28 - 7.25,
        interface: 'Interface 7',
      },
      {
        date: new Date(2022, 9, 22),
        value: 37 - 7.25,
        interface: 'Interface 7',
      },
      { date: new Date(2022, 9, 10), value: 31 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 11), value: 33 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 12), value: 29 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 13), value: 32 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 14), value: 31 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 15), value: 30 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 16), value: 27 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 17), value: 33 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 18), value: 35 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 19), value: 15 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 20), value: 32 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 21), value: 28 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 22), value: 37 - 8, interface: 'Interface 8' },
      { date: new Date(2022, 9, 10), value: 31 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 11), value: 33 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 12), value: 29 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 13), value: 32 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 14), value: 31 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 15), value: 30 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 16), value: 27 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 17), value: 33 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 18), value: 35 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 19), value: 15 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 20), value: 32 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 21), value: 28 - 9, interface: 'Interface 9' },
      { date: new Date(2022, 9, 22), value: 37 - 9, interface: 'Interface 9' },
    ];

    this._dataComplementary = [
      {
        interfaceName: 'Interface 1',
        value: 50,
      },
      {
        interfaceName: 'Interface 2',
        value: 45,
      },
      {
        interfaceName: 'Interface 3',
        value: 40,
      },
      {
        interfaceName: 'Interface 4',
        value: 35,
      },
      {
        interfaceName: 'Interface 5',
        value: 30,
      },
      {
        interfaceName: 'Interface 6',
        value: 25,
      },
      {
        interfaceName: 'Interface 7',
        value: 25,
      },
      {
        interfaceName: 'Interface 8',
        value: 26,
      },
      {
        interfaceName: 'Interface 9',
        value: 29,
      },
      {
        interfaceName: 'Interface 10',
        value: 20,
      },
      {
        interfaceName: 'Interface 11',
        value: 13,
      },
    ];
  }

  ngOnInit(): void {
    this.componentId = ++LinesGroupFullSizeComponent.id;
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.draw();
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;

    this.widthComplementary =
      this.sizexC -
      this.marginComplementary.left -
      this.marginComplementary.right;
    this.heightComplementary =
      this.sizeyC -
      this.marginComplementary.top -
      this.marginComplementary.bottom;
  }

  draw() {
    const X = d3.map(this.data, (d: InterfaceDateValue) => d.date);
    const Y = d3.map(this.data, (d: InterfaceDateValue) => d.value);

    const ySteps = Math.floor(d3.max(Y) / 10) + 1;

    const xDomain = d3.extent(X);
    const yDomain = [0, 10 * ySteps];

    const xType = d3.scaleUtc;
    const yType = d3.scaleLinear;

    const xRange = [0, this.width];
    const yRange = [this.height, 0];

    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);

    const svg = d3
      .select(this.linesGroupChart.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin?.left + this.margin?.right)
      .attr('height', this.height + this.margin?.top + this.margin?.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    svg.attr('class', `lines-group-${this.componentId}`);

    let sumStat = d3.group(this.data, (d) => d.interfaceName);
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);

    // const formatShort = d3.timeFormat('%d %b');

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((_d: Date) => '')
      .tickSizeInner(10);
    // for show scale: formatShort(new Date(d));

    xAxis.tickValues(xScale.ticks(d3.timeDay.every(1)));

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d: number) => `${d} ${this.unidad}`);

    yAxis.tickValues(yScale.ticks(ySteps));

    const grid = (g) =>
      g
        .attr('stroke', '#C4C4C4')
        .attr('stroke-width', 1)
        .call((g) =>
          g
            .append('g')
            .selectAll('line')
            .data(yScale.ticks(ySteps))
            .join('line')
            .attr('y1', (d) => yScale(d))
            .attr('y2', (d) => yScale(d))
            .attr('x1', 0)
            .attr('x2', this.width)
        );

    if (!this.isInitiated) {
      this.xAxisDef = svg
        .append('g')
        .attr('transform', `translate(0, ${this.height})`);
      this.yAxisDef = svg.append('g');
    }

    this.xAxisDef
      .transition()
      .duration(1000)
      .call(xAxis)
      .on('start', () => {
        svg.select('domain').remove();
        svg.selectAll('.tick line').attr('transform', `translate(0,${13})`);
      });

    this.yAxisDef
      .transition()
      .duration(1000)
      .call(yAxis)
      .on('start', () => {
        svg.select('domain').remove();
        svg.selectAll('.tick line').remove();
      });

    svg.append('g').call(grid);

    let u = svg.selectAll('.line').data(sumStat);

    u.join('path')
      .transition()
      .duration(3000)
      .attr('fill', 'none')
      .attr('stroke', this.secondaryColor)
      .attr('stroke-width', 1)
      .attr('d', function (d: [string, Array<InterfaceDateValue>]) {
        return d3
          .line()
          .x(function (d: InterfaceDateValue) {
            return xScale(d.date);
          })
          .y(function (d: InterfaceDateValue) {
            return yScale(+d.value);
          })(d[1]);
      })
      .style('cursor', 'pointer')
      .on('mouseover', this.onMouseover)
      .on('mouseout', this.onMouseout)
      .on('click', (di: any, id: any) => {
        this.selectLine(di, id, this.color, this.secondaryColor, true);
      });
    this.drawComplementary();
  }

  update() {
    if (!this.isInitiated) {
      return;
    }
    this.draw();
  }

  drawComplementary() {
    const svgC = d3
      .select(this.complementaryChart.nativeElement)
      .append('svg')
      .attr(
        'width',
        this.widthComplementary +
          this.marginComplementary.left +
          this.marginComplementary.right
      )
      .attr(
        'height',
        this.heightComplementary +
          this.marginComplementary.top +
          this.marginComplementary.bottom
      )
      .append('g')
      .attr(
        'transform',
        'translate(' +
          this.marginComplementary.left +
          ',' +
          this.marginComplementary.top +
          ')'
      );

    const xScaleC = d3
      .scaleBand()
      .range([0, this.widthComplementary])
      .domain(this._dataComplementary.map((d: InterfaceValue) => d.interfaceName))
      .padding(0.3);

    const yScaleC = d3
      .scaleLinear()
      .range([this.heightComplementary, 0])
      .domain([
        0,
        d3.max(this.dataComplementary, (d: InterfaceValue) => d.value),
      ]);

    const yAxisC = d3
      .axisRight(yScaleC)
      .tickFormat((d: number) => `${d} ${this.unidad}`);
    const xAxisC = d3.axisBottom(xScaleC);

    yAxisC.tickValues(yScaleC.ticks(1));

    svgC.attr('class', `linesC-full-size-${this.componentId}`);
    svgC
      .append('g')
      .attr('transform', 'translate(' + this.widthComplementary + ',0)')
      .call(yAxisC)
      .call((g: any) =>
        g.selectAll('.tick line').attr('stroke', this.secondaryColor)
      )
      .call((g: any) => {
        g.selectAll('text').attr('transform', 'translate(15,25)rotate(-90)');
      })
      .select('.domain')
      .attr('stroke', this.secondaryColor);

    svgC
      .append('g')
      .attr('transform', 'translate(0,' + this.heightComplementary + ')')
      .call(xAxisC)
      .call((g: any) => g.select('.domain').attr('stroke', this.secondaryColor))
      .call((g: any) => g.selectAll('.tick line').remove())
      .selectAll('text')
      .attr('transform', 'translate(-12,70)rotate(-90)')
      .style('text-anchor', 'start');

    svgC
      .selectAll('myRect')
      .data(this.dataComplementary)
      .join('rect')
      .attr('x', (d: InterfaceValue) => xScaleC(d.interfaceName))
      .attr('y', (d: InterfaceValue) => yScaleC(d.value))
      .attr('width', xScaleC.bandwidth())
      .attr(
        'height',
        (d: InterfaceDateValue) => this.heightComplementary - yScaleC(d.value)
      )
      .attr('fill', this.secondaryColor)
      .style('cursor', 'pointer')
      .on('mouseover', this.onMouseover)
      .on('mouseout', this.onMouseout)
      .on('click', (di: any, id: any) =>
        this.selectRect(di, id, this.color, this.secondaryColor, true)
      );
  }

  onMouseover() {
    d3.select(this).transition().duration('300').attr('opacity', '.5');
  }

  onMouseout() {
    d3.select(this).transition().duration('300').attr('opacity', '1');
  }

  selectLine(
    _d: any,
    i: any,
    color: string,
    secondaryColor: string,
    startEvent: boolean
  ) {
    d3.selectAll(`.lines-group-${this.componentId} path`)
      .attr('stroke', (d) => {
        if (!d) {
          return 'currentcolor';
        }

        return d[0] == i[0] ? color : secondaryColor;
      })
      .attr('stroke-width', (d: any) => {
        if (!d) {
          return 1;
        }

        return d[0] == i[0] ? 3 : 1;
      });

    if (startEvent) {
      this.selectRect(
        null,
        { interfaceName: i[0], value: -1 },
        color,
        secondaryColor,
        false
      );
    }
  }

  selectRect(
    _d: any,
    i: InterfaceValue,
    color: string,
    secondaryColor: string,
    startEvent: boolean
  ) {
    d3.selectAll(`.linesC-full-size-${this.componentId} rect`).attr(
      'fill',
      (d: InterfaceValue) =>
        d.interfaceName == i.interfaceName ? color : secondaryColor
    );

    d3.selectAll(`.linesC-full-size-${this.componentId} text`).attr(
      'font-weight',
      (d: string) => (d == i.interfaceName ? '600' : 'normal')
    );

    if (startEvent) {
      this.selectLine(null, [i.interfaceName], color, secondaryColor, false);
    }
  }
}

import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { InterfaceDateValue } from '../../../shared/model/interface-date-value';
import * as d3 from 'd3';
import { ES_MX_LOCALE } from '../../../shared/const/es-mx-locale';
import { InterfaceValue } from '../../../shared/model/interface-value';
import { MarginConf } from '../../../shared/model/margin-conf';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-lines-group',
  templateUrl: './lines-group.component.html',
  styles: [
    `
      .border {
        border: 0px solid #d0d0ce !important;
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

      .tick-text {
        font-size: 12px;
        line-height: 15px;
        color: #697181;
      }
    `,
  ],
})
export class LinesGroupComponent implements OnInit {
  private static id = 0;
  componentId: number = 0;

  @Input() showBorder = true;
  @Input() showIcon = true;

  @ViewChild('linesGroup') linesGroupChart: ElementRef;
  @ViewChild('complementary') complementaryChart: ElementRef;

  _data: Array<InterfaceDateValue> = [];
  @Input() set data(val: Array<InterfaceDateValue>) {
    this._data = val;
    this.updateDraw();
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

  @Input() graficaIndividual?: number = 1;

  @Input() margin?: MarginConf = {
    top: 30,
    right: 10,
    bottom: 30,
    left: 70,
  };

  @Input() marginComplementary?: MarginConf = {
    top: 30,
    right: 10,
    bottom: 30,
    left: 70,
  };

  @Input() title: string;

  @Input() secondTitle: string;

  @Input() sizex: number = 530;
  @Input() sizey: number = 200;
  @Input() sizexC: number = 200;
  @Input() sizeyC: number = 200;

  @Input() color: string = '#FFBD14';
  @Input() secondaryColor: string = '#C4C4C4';

  @Input() unidad: string = 'Mbps';

  @Input() selectedInterface: string = '';

  @Input() single: boolean = false;
  @Input() icon: boolean = true;

  @Input() scaleRange: '1h' | '4h' | '24h' | '7d' | '14d' | '30d';

  widthComplementary: number;
  heightComplementary: number;

  width: number;
  height: number;

  ySteps: number;

  X: any;
  Y: any;
  I: any;
  xAxis: any;
  yAxis: any;
  xScale: any;
  yScale: any;

  tickTransformation = 'translate(-13, 25) rotate(270)';

  svg: any;

  format = d3.timeFormat('%x');

  isInitiated: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.componentId = ++LinesGroupComponent.id;
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.initDraw();
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;

    if (!this.single) {
      (this.widthComplementary =
        this.sizexC -
        this.marginComplementary.left -
        this.marginComplementary.right),
        (this.heightComplementary =
          this.sizeyC -
          this.marginComplementary.top -
          this.marginComplementary.bottom);
    }
  }

  private initDraw() {
    this.drawCharts();

    this.svg = d3
      .select(this.linesGroupChart.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin?.left + this.margin?.right)
      .attr('height', this.height + this.margin?.top + this.margin?.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.svg.attr('class', `lines-${this.componentId}`);

    this.drawLines();
    this.createAxis();
    this.isInitiated = true;

    this.drawChart();
  }

  private drawChart() {
    let sumStat = d3.group(this.data, (d) => d.interfaceNameName);

    const xScale = this.xScale;
    const yScale = this.yScale;
    this.svg
      .selectAll('.line')
      .data(sumStat)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', this.single ? this.color : this.secondaryColor)
      .attr('stroke-width', this.single ? 3 : 1)
      .attr('class', 'line-group-chart' + this.componentId)
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
        if (this.single) {
          return;
        }
        this.selectLine(di, id, this.color, this.secondaryColor, true);
      });

    if (!this.single) {
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
        .scaleLinear()
        .range([0, this.widthComplementary])
        .domain([
          0,
          d3.max(this.dataComplementary, (d: InterfaceValue) => d.value),
        ]);

      const yScaleC = d3
        .scaleBand()
        .range([0, this.heightComplementary])
        .domain(this._dataComplementary.map((d: InterfaceValue) => d.interfaceName))
        .padding(0.3);
      const yAxisC = d3.axisLeft(yScaleC).tickSize(0);
      svgC.attr('class', `linesC-${this.componentId}`);
      svgC.append('g').call(yAxisC).select('.domain').attr('stroke', '#c4c4c4');

      svgC
        .selectAll('myRect')
        .data(this.dataComplementary)
        .join('rect')
        .attr('x', xScaleC(0))
        .attr('y', (d: InterfaceValue) => yScaleC(d.interfaceName))
        .attr('width', (d: InterfaceValue) => xScaleC(d.value))
        .attr('height', yScaleC.bandwidth())
        .attr('fill', this.secondaryColor)
        .style('cursor', 'pointer')
        .on('mouseover', this.onMouseover)
        .on('mouseout', this.onMouseout)
        .on('click', (di: any, id: any) =>
          this.selectRect(di, id, this.color, this.secondaryColor, true)
        );
    }
  }

  private drawLines() {
    const grid = (g) =>
      g
        .attr('stroke', '#C4C4C4')
        .attr('stroke-width', 1)
        .call((g) =>
          g
            .append('g')
            .selectAll('line')
            .data(this.yScale.ticks(this.ySteps))
            .join('line')
            .attr('y1', (d) => this.yScale(d))
            .attr('y2', (d) => this.yScale(d))
            .attr('x1', 0)
            .attr('x2', this.width)
            .attr('class', 'line-path')
        );

    this.svg.append('g').call(grid);
  }

  private createAxis() {
    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(this.xAxis)
      .attr('class', 'ejeX')
      .call((g: any) => g.selectAll('.tick line').remove())
      .call((g: any) =>
        g
          .selectAll('.tick text')
          .attr('transform', this.tickTransformation)
          .attr('fill', '#697181')
      );

    this.svg
      .append('g')
      .call(this.yAxis)
      .call((g: any) => g.select('.domain').remove())
      .call((g: any) => g.selectAll('.tick line').remove());
  }

  private updateDraw() {
    if (!this.isInitiated) {
      return;
    }

    this.svg.selectAll('.line-path').remove();

    this.drawCharts();
    this.drawLines();

    this.svg
      .select('.line-group-chart' + this.componentId)
      .transition()
      .duration(200)
      .remove();

    this.svg
      .select('.ejeX')
      .transition()
      .duration(3000)
      .call(this.xAxis)
      .on('start', () => {
        this.svg.selectAll('.tick line').remove();
      })
      .call((g: any) =>
        g
          .selectAll('.tick text')
          .attr('transform', this.tickTransformation)
          .attr('fill', '#697181')
      );
    this.svg.select('.ejeY').transition().duration(3000).call(this.yAxis);

    let sumStat = d3.group(this.data, (d) => d.interfaceName);

    const xScale = this.xScale;
    const yScale = this.yScale;

    this.svg
      .selectAll('.line')
      .data(sumStat)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', this.single ? this.color : this.secondaryColor)
      .attr('stroke-width', this.single ? 3 : 1)
      .attr('class', 'line-group-chart' + this.componentId)
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
        if (this.single) {
          return;
        }
        this.selectLine(di, id, this.color, this.secondaryColor, true);
      });

    if (!this.single) {
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
        .scaleLinear()
        .range([0, this.widthComplementary])
        .domain([
          0,
          d3.max(this.dataComplementary, (d: InterfaceValue) => d.value),
        ]);

      const yScaleC = d3
        .scaleBand()
        .range([0, this.heightComplementary])
        .domain(this._dataComplementary.map((d: InterfaceValue) => d.interfaceName))
        .padding(0.3);
      const yAxisC = d3.axisLeft(yScaleC).tickSize(0);
      svgC.attr('class', `linesC-${this.componentId}`);
      svgC.append('g').call(yAxisC).select('.domain').attr('stroke', '#c4c4c4');

      svgC
        .selectAll('myRect')
        .data(this.dataComplementary)
        .join('rect')
        .attr('x', xScaleC(0))
        .attr('y', (d: InterfaceValue) => yScaleC(d.interfaceName))
        .attr('width', (d: InterfaceValue) => xScaleC(d.value))
        .attr('height', yScaleC.bandwidth())
        .attr('fill', this.secondaryColor)
        .style('cursor', 'pointer')
        .on('mouseover', this.onMouseover)
        .on('mouseout', this.onMouseout)
        .on('click', (di: any, id: any) =>
          this.selectRect(di, id, this.color, this.secondaryColor, true)
        );
    }
  }

  private drawCharts() {
    this.X = d3.map(this.data, (d: InterfaceDateValue) => d.date);
    this.Y = d3.map(this.data, (d: InterfaceDateValue) => d.value);

    const xDomain = d3.extent(this.X);
    this.ySteps = 3;
    const yDomain = [0, Math.round(d3.max(this.Y) + d3.max(this.Y) * .1)];

    const xType = d3.scaleUtc;
    const yType = d3.scaleLinear;

    const xRange = [0, this.width];
    const yRange = [this.height, 0];

    this.xScale = xType(xDomain, xRange);
    this.yScale = yType(yDomain, yRange);

    this.defineAxis();
  }

  private defineAxis() {
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);

    let format = d3.timeFormat('%x');
    switch (this.scaleRange) {
      case '1h':
      case '4h':
      case '24h':
        format = d3.timeFormat('%H:%M');
        break;

      case '7d':
        format = d3.timeFormat('%x %H:%M Hrs');
        break;

      case '14d':
      case '30d':
        format = d3.timeFormat('%x');
        break;

      default:
        format = d3.timeFormat('%d');
        break;
    }

    this.format = format;

    this.defineXAxisTicks();
    this.yAxis = d3
      .axisLeft(this.yScale)
      .tickFormat((d: number) => `${d} ${this.unidad}`);

    this.yAxis.tickValues(this.yScale.ticks(this.ySteps));
  }

  private defineXAxisTicks() {
    d3.timeFormatDefaultLocale(ES_MX_LOCALE);
    this.xAxis = d3
      .axisBottom(this.xScale)
      .tickFormat((d: Date) => this.format(new Date(d.toString())));

    switch (this.scaleRange) {
      case '1h':
        this.xAxis.tickValues(this.xScale.ticks(d3.timeMinute.every(1)));
        this.tickTransformation = 'translate(-13, 25) rotate(270)';
        break;
      case '4h':
        this.xAxis.tickValues(this.xScale.ticks(d3.timeMinute.every(10)));
        this.tickTransformation = 'translate(-13, 7) rotate(-35)';
        break;
      case '24h':
        this.xAxis.tickValues(this.xScale.ticks(d3.timeHour.every(1)));
        this.tickTransformation = 'translate(-13, 25) rotate(270)';

        break;
      case '7d':
        this.xAxis.tickValues(this.xScale.ticks(d3.timeHour.every(6)));
        this.tickTransformation = 'translate(-30, 45) rotate(-57)';
        break;
      case '14d':
        this.xAxis.tickValues(this.xScale.ticks(d3.timeDay.every(1)));
        this.tickTransformation = 'rotate(0)';
        break;
      case '30d':
        this.xAxis.tickValues(this.xScale.ticks(d3.timeDay.every(1)));
        this.tickTransformation = 'translate(-17, 25) rotate(-35)';
        break;
      default:
        this.xAxis.tickValues(this.xScale.ticks(d3.timeDay.every(1)));
        this.tickTransformation = 'translate(0, 0) rotate(0)';
    }
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
    d3.selectAll(`.lines-${this.componentId} path`)
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
    d3.selectAll(`.linesC-${this.componentId} rect`).attr(
      'fill',
      (d: InterfaceValue) =>
        d.interfaceName == i.interfaceName ? color : secondaryColor
    );

    d3.selectAll(`.linesC-${this.componentId} text`).attr(
      'font-weight',
      (d: string) => (d == i.interfaceName ? '600' : 'normal')
    );

    if (startEvent) {
      this.selectLine(null, [i.interfaceName], color, secondaryColor, false);
    }
  }

  fullSize() {
    localStorage.setItem('full-type', 'DISPOSITIVO_DETALLE_METRICA');
    localStorage.setItem('group-type', String(this.graficaIndividual));
    this.router.navigateByUrl(
      NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.detalleFullSize + ')'
    );
  }

}

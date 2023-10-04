import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { MarginConf } from 'src/app/shared/model/margin-conf';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css'],
})
export class LineGraphComponent implements AfterViewInit {
  private static id = 0;
  componentId: number = 0;
  private _object: any;
  @Input('data') set object(val: any) {
    this._object = val;
    //this.update();
  }
  get object() {
    return this._object;
  }

  @ViewChild('lineGraph') svgLineGraph: ElementRef;
  @Input() color: any;
  @Input() dark: boolean;
  @Input() sizex: number;
  @Input() sizey: number;
  @Input() margin?: MarginConf = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  private svg;
  public g: any;

  private width: number;
  private height: number;

  private isInitiated: boolean = false;

  ngAfterViewInit(): void {
    this.setDimensions();
    this.draw();
  }

  ngOnInit(): void {
    this.componentId = ++LineGraphComponent.id;
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  draw() {
    this.color = this.color == null ? '#FF0D0D' : this.color;

    let ax = [];
    let ay = [];
    this.object.data.forEach(function (d, i) {
      ax[i] = d.x;
      ay[i] = d.y;
    });
    let xMax = d3.max(ax);
    let xMin = d3.min(ax);
    let yMax = d3.max(ay) + 50;
    let yMin = 0;

    let w = this.width * 0.9;
    let h = this.width * 0.35;

    let margin_x = this.width * 0.14;
    let margin_y = this.width * 0.1 - 10;

    this.svg = d3
      .select(this.svgLineGraph.nativeElement)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    let x = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([0 + margin_x, w - margin_x]);
    let y = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([0, h - margin_y]);

    let g = this.svg.append('g').attr('transform', 'translate(0,' + h + ')');

    //declare a variable called line in which every data is converted into a point (x,y).
    let line = d3.line();

    line.x(function (d) {
      return x(d.x);
    });
    line.y(function (d) {
      return -y(d.y);
    });

    //draw the xLabels
    g.selectAll('.xLabel')
      .data(x.ticks(this.object.data.length)) //cantidad de ticks no intervalo
      .enter()
      .append('text')
      .attr('class', 'xLabel')
      .text('|')
      .attr('x', function (d) {
        return x(d);
      })
      .attr('y', 1) //distancia a  la linea
      .style('fill', '#C4C4C4')
      .attr('text-anchor', 'middle');

    // draw the yLabels
    g.selectAll('.yLabel')
      .data(y.ticks(3))
      .enter()
      .append('text')
      .attr('class', 'yLabel')
      .text(String)
      .attr('x', 25)
      .attr('y', function (d) {
        return -y(d);
      })
      .style('fill', '#C4C4C4')
      .attr('text-anchor', 'end');

    // draw the x axis
    g.append('line')
      .attr('x1', x(xMin))
      .attr('x2', x(xMax) + 20)
      .attr('y1', -y(yMin))
      .attr('y2', -y(yMin));

    // draw the y axis
    g.append('line')
      .attr('x1', x(xMin))
      .attr('y1', -y(yMin))
      .attr('x2', x(xMin))
      .attr('y2', -y(yMax) - 10);

    //draw the x ticks
    g.selectAll('.xTicks') //Pequeña linea junto al tick
      .data(x.ticks(this.object.data.length))
      .enter()
      .append('line')
      .attr('class', 'xTicks')
      .attr('x1', function (d) {
        return x(d);
      })
      .attr('y1', -y(0))
      .attr('x2', function (d) {
        return x(d);
      })
      .attr('y2', -y(0) - 5);

    // draw the y ticks
    g.selectAll('.yTicks') //Pequeña linea junto al tick
      .data(y.ticks(5))
      .enter()
      .append('line')
      .attr('class', 'yTicks')
      .attr('y1', function (d) {
        return -1 * y(d);
      })
      .attr('x1', x(0) + 5)
      .attr('y2', function (d) {
        return -1 * y(d);
      })
      .attr('x2', x(0));

    //draw the x grid
    g.selectAll('.xGrids')
      .data(x.ticks(this.object.data.length))
      .enter()
      .append('line')
      .attr('class', 'xGrids')
      .attr('x1', function (d) {
        return x(d);
      })
      .attr('y1', -y(yMin))
      .attr('x2', function (d) {
        return x(d);
      })
      .attr('y2', -y(yMax) - 10);

    // draw the y grid
    g.selectAll('.yGrids')
      .data(y.ticks(this.object.data.length / 2))
      .enter()
      .append('line')
      .attr('class', 'yGrids')
      .attr('y1', function (d) {
        return -1 * y(d);
      })
      .attr('x1', x(xMax) + 20)
      .attr('y2', function (d) {
        return -y(d);
      })
      .attr('x2', x(xMin));

    const defs = this.svg.append('defs');

    const filter = defs.append('filter').attr('id', 'drop-shadow');

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result
    // in blur
    filter
      .append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 2)
      .attr('result', 'blur');

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    filter
      .append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 5)
      .attr('dy', 5)
      .attr('result', 'offsetBlur');

    filter
      .append('feFlood')
      .attr('in', 'offsetBlur')
      .attr('flood-color', '#D0D0CE')
      .attr('flood-opacity', '0.8')
      .attr('result', 'offsetColor');

    filter
      .append('feComposite')
      .attr('in', 'offsetColor')
      .attr('in2', 'offsetBlur')
      .attr('operator', 'in')
      .attr('result', 'offsetBlur');

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    let feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode').attr('in', 'offsetBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const u = g.selectAll('.lineGraph'+this.componentId+'').data([this.object.data], function (d) {
      return d.x;
    });

    u.join('path')
      .attr('class', 'lineGraph'+this.componentId+'')
      .transition()
      .duration(3000)
      .attr('d', line(this.object.data))
      .style('stroke', this.color)
      .style('stroke-width', 3)
      .style('fill', 'none')
      .style('filter', 'url(#drop-shadow'+this.componentId+')')
      .attr('width', 100 + '%')
      .attr('height', h + 25);

    this.isInitiated = true;
  }

  private update() {
    if (!this.isInitiated) {
      return;
    }

    this.draw();
  }
}

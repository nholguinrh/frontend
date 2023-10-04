import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import { MarginConf } from 'src/app/shared/model/margin-conf';

@Component({
  selector: 'app-speedometer',
  templateUrl: './speedometer.component.html',
  styleUrls: ['./speedometer.component.css']
})
export class SpeedometerComponent implements AfterViewInit, OnInit {

  @ViewChild('speedometer') svgSpeedChart: ElementRef;

  @Input() color: string = '#285CED';
  @Input() secondary: string = '#EEF1F8';
  @Input('color-label') colorLabel: string = '#000000';

  @Input() sizex: number;
  @Input() sizey: number;
  @Input() size: number = 400;
  @Input() ringWidth: number = 60;
  @Input() proportion: number = 1;
  @Input() pointerLengthPercent: number = 0.14;
  @Input() positionText: number[]= [320, 210, 54, 210];
  @Input() fontSize: string = "17px";

  _value: number = 6;
  @Input() set value(val: number) {
    this._value = val;
    this.update();
  }

  @Input() margin?: MarginConf = {
    top: 10,
    right: 0,
    bottom: 5,
    left: 30,
  };

  private svg;
  public g: any;

  private width: number;
  private height: number;
  private range: number[];


  gaugemap : any = {};
  powerGauge: any;
  d3 : any;
  @Input() estilo: string;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.create();
    this.draw();
  }

  private create(){
    this.svg = d3
    .select(this.svgSpeedChart?.nativeElement)
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
  }

  private draw(){
    
    this.create();

    let self = this;
    let gauge =  (container, configuration) => {
      let config = {
        size: 710,
        clipWidth: 200,
        clipHeight: 110,
        ringInset: 40,
        ringWidth: 20,

        pointerWidth: 29,
        pointerTailLength: 0,
        pointerHeadLengthPercent: this.pointerLengthPercent,

        minValue: 0,
        maxValue: 10,

        minAngle: -90,
        maxAngle: 90,

        transitionMs: 750,

        majorTicks: 2,
        labelFormat: d3.format('d'),
        labelInset: 10,

        arcColorFn: d3.interpolateHsl(d3.rgb('#3969ED'), d3.rgb('#EEF1F8'))
      };

      let range = undefined;
      let r = undefined;
      let pointerHeadLength = undefined;
      let value = 0;

      let arc = undefined;
      let scale = undefined;
      let ticks = undefined;
      let tickData = undefined;
      let pointer = undefined;

      function deg2rad(deg) {
        return deg * Math.PI / 180;
      }

      function newAngle(d) {
        var ratio = scale(d);
        var newAngle = config.minAngle + (ratio * range);
        return newAngle;
      }

      const configure = (configuration) => {
        let prop = undefined;
        for (prop in configuration) {
          config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        scale = d3.scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);
        
        
        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(1).map(i => {
            return this._value / 10;
        });
        

        arc = d3.arc()
          .innerRadius(r - config.ringWidth - config.ringInset)
          .outerRadius(r - config.ringInset)
          .startAngle(function (d, i) {
            var ratio = d * i;
            return deg2rad(config.minAngle + (ratio * range));
          })
          .endAngle(function (d, i) {
            var ratio = d * (i + 1);
            return deg2rad(config.minAngle + (ratio * range));
          });
        
      }
      self.gaugemap.configure = configure;

      function centerTranslation() {
        return 'translate(' + r + ',' + (r-22) + ')';
      }

      const isRendered = () => {
        return (this.svg !== undefined);
      }
      self.gaugemap.isRendered = isRendered;

      const render = (newValue) => {
        this.svg
        .append(':svg')
        .attr('class', 'gauge')
        .attr('transform', `translate(0, ${this.height - this.margin.bottom})`);


        let defs = this.svg.append("defs");

        let filter = defs.append("filter")
        .attr("id", "dropshadow")

        filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 4)
        .attr("result", "blur");
        filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 2)
        .attr("dy", 2)
        .attr("result", "offsetBlur")
        filter.append("feFlood")
        .attr("in", "offsetBlur")
        .attr("flood-color", "#3d3d3d")
        .attr("flood-opacity", "0.2")
        .attr("result", "offsetColor");
        filter.append("feComposite")
        .attr("in", "offsetColor")
        .attr("in2", "offsetBlur")
        .attr("operator", "in")
        .attr("result", "offsetBlur");

        let feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

        let centerTx = centerTranslation();
        let arcsbase = this.svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);
          arcsbase.selectAll('path')
          .data([1])
          .enter().append('path')
          .attr('fill', this.secondary)
          .attr("filter", "url(#dropshadow)")
          .attr('d', arc);

        let arcs = this.svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);
          arcs.selectAll('path')
          .data(tickData)
          .enter().append('path')
          .attr('fill', this.color)
          .attr("filter", "url(#dropshadow)")
          .attr('d', arc);

          this.svg
          .append('circle')
          .attr('cx', '49.6%')
          .attr('cy', '80%')
          .attr('r', 40 * this.proportion)
          .attr("filter", "url(#dropshadow)")
          .style("fill", this.secondary);

        let lineData = [[config.pointerWidth / 2, 0],
          [0, -pointerHeadLength],
          [-(config.pointerWidth / 2), 0],
          [0, config.pointerTailLength],
          [config.pointerWidth / 2, 0]];
          let pointerLine = d3.line().curve(d3.curveLinear)
          let pg = this.svg?.append('g').data([lineData])
            .attr('class', 'pointer')
            .style("fill", this.color)
            .attr('transform', 'translate(' + (r+2) + ',' + (r-15) + ')');


          this.svg
            .append('circle')
            .attr('cx', '49.6%')
            .attr('cy', '81%')
            .attr('r', 16 * this.proportion)
            .style("fill", this.color);

          this.svg
            .append('circle')
            .attr('cx', '49.6%')
            .attr('cy', '81%')
            .attr('r', 6 * this.proportion)
            .style("fill", this.secondary);

          this.svg.append("text")
            .attr("x", (this.positionText[0]))				
            .attr("y", (this.positionText[1]))
            .style("font-size", this.fontSize) 
            .style("font-weight", "600") 
            .style("font-family","sans-serif")
            .style("fill", this.colorLabel)
            .text(100 - (this._value * 10) + '%');

          
          this.svg.append("text")
            .attr("x", (this.positionText[2]))				
            .attr("y", (this.positionText[3]))
            .style("font-size", this.fontSize) 
            .style("font-weight", "600") 
            .style("font-family","sans-serif")
            .style("fill", this.colorLabel)
            .text((this._value * 10) + '%');

        pointer = pg.append('path')
          .attr('d', pointerLine)
          .attr('transform', 'rotate(' + config.minAngle + ')');
        
        update(newValue === undefined ? 0 : newValue);

      }
      self.gaugemap.render = render;

      function update(newValue, newConfiguration?) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        let ratio = scale(newValue);
        let newAngle = config.minAngle + (ratio * range);
        pointer.transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', 'rotate(' + newAngle + ')');
      }

      self.gaugemap.update = update;

      configure(configuration);

      return self.gaugemap;

    }

    this.powerGauge = gauge('#speed', {
      size: this.size,
      clipWidth: 300,
      clipHeight: 300,
      ringWidth: this.ringWidth,
      maxValue: 10,
      transitionMs: 4000,
    });

    this.powerGauge.render(this._value);
    
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  private update(){
    
    this.svg?.selectAll('text').remove();
    this.svg?.selectAll('defs').remove();
    this.svg?.selectAll('path').remove();
    this.svg?.selectAll('arc').remove();
    this.svg?.selectAll('circle').remove();
    this.svg?.selectAll('g').remove();

    this.svg?.selectAll('svg').remove();

    this.draw();
    
  }
  

}

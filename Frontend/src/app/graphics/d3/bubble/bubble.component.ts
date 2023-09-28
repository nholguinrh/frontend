import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import * as d3 from 'd3';
import d3Tip from "d3-tip";

@Component({
  selector: 'smc-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css']
})
export class BubbleComponent implements OnInit, AfterViewInit {

  @ViewChild('bubble') svgBubble: ElementRef;
  @Input() sizex: number = 500;
  @Input() sizey: number = 320;
  @Input() totalA: number=106;
  @Input() offsetLeft: number = 0;
  @Input() offsetBottom: number = 0;
  @Input() maxRadio: number = 100;
  @Input() dark: boolean = false;
  @Input() border: boolean = false;
  @Input() margin?: MarginConf = {
    top: 20,
    right: 0,
    bottom: 10,
    left: 20,
  };

  private svg;
  public g: any;
  public data : any = [
    { title: "Puntas inalcanzables", color: "#EEF1F8", border: "#5052FC", value: 44 }, 
    { title: "Puntas sin gestión", color: "#FFF9EE", border: "#FDAE86", value: 25 }, 
    { title: "Incremento de memoria", color: "#FFE9E4", border: "#F95A36", value: 22 }, 
    { title: "Incremento de voltaje", color: "#FFE4CE", border: "#FC8A2E", value: 12 },
  ];

  private width: number;
  private height: number;

  @Input() set valores(val: any) {    
    this.data = val;        
    //this.data?.pop(); // Se comenta para que no quite un elemento de la lista    
    //Hacer la sumatoria de los valores recibidos
    let sum = 0;    
    for (const element of this.data) {      
      sum += parseInt(element.value);        
    }        
    this.totalA=sum;    
    this.update();
  }

  constructor() { 
    //Aqui solo se inicializaria con el valor default
    
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {
    //Aqui ya no llega    
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.draw();
  }

  draw() {
    this.svg = d3
    .select(this.svgBubble.nativeElement)
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    let tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 6])
    .html((d)=> {
      if(this.dark){
        return " <div style='width: 120px; height: 40px; border-radius: 3px; line-height: 15px; text-align: center; padding-top: 5px; font-size: 12px; color: #D0D0CE; background-color: #4c4d5f; border: solid 1px #4c4d5f;'>"+ d.target.__data__.title +"</div>";
      }else{
        //Se cambia
        return " <div style='width: 120px; height: 40px; border-radius: 3px; line-height: 15px; text-align: center; padding-top: 5px; font-size: 12px; color: #0B112A; background-color:"+ d.target.__data__.border +"; border: solid 1px " + d.target.__data__.color + "'>"+ d.target.__data__.title +"</div>";
      }
    });

    this.svg.call(tip);

    const size = d3.scaleLinear()
    .domain([0, this.totalA])
    .range([7, this.maxRadio]);

    let node = this.svg.selectAll(".node")
      .data(this.data).enter().append('g').classed('node', true);

    node
    .append("circle")
    .attr("r", (d)=> {
      return this.getRadio(d.value)
    })
    .style("fill", (d)=> {
      if(this.dark){
        return '#4d4d5c'
      }else{
        //Se cambia
        return d.border
      }
    })
    .style("fill-opacity", 1)
    .attr("stroke", (d)=> {
      if(this.border){
        //Se cambia
        return d.color
      }else{
        //Se cambia
        return d.border
      }
    })
    .style("stroke-width", 2)
    .call(d3.drag() 
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))
    .attr("cursor", "pointer")
    .on('mouseover', tip.show )
    .on('mouseleave', tip.hide);

    node
    .append("text")
    .style("dominant-baseline", "central")
    .style("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("cursor", "pointer")
    .style("font-size", (d)=> {
      return size(d.value) / 1.5
    })
    .style("font-weight", "600")
    .text(function(d) {
      return d.value.toString();
    })
    .style("fill", (d)=> {
      //Se cambia
        return d.color
    })
    .on('mouseover', tip.show )
    .on('mouseleave', tip.hide);

    



    let simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x((this.width / 2) - this.offsetLeft).y((this.height / 2) - this.offsetBottom))
    .force("charge", d3.forceManyBody().strength(0.5))
    .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1));

    simulation
    .nodes(this.data)
    .on("tick", function(d){
      node.attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; })
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.x = event.x;
      d.y = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }     


  }

  private getRadio(value: number){

    let radio = (value * this.maxRadio) / this.totalA;
    console.log('('+value+'*'+this.maxRadio+')/'+this.totalA+'='+radio);          

    return radio;
  }

  update() {
    this.svg.selectAll('g').remove();
    console.log(this.totalA);
    this.draw();
  }

}

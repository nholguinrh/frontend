import { Component, Input, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-simple-bar',
  templateUrl: './simple-bar.component.html',
  styleUrls: ['./simple-bar.component.css']
})
export class SimpleBarComponent implements OnInit {

  @Input() color: string;
  @Input() titulo: string;
  @Input() value: number;
  @Input() max: number;

  constructor() { }
  

  ngOnInit(): void {
    let data= [
      {title: this.titulo, value: this.value}
    ];
    this.draw(data);
  }

  draw(data) {

    var margin = {top: 20, right: 5, bottom: 10, left: 0},
    width = 236 - margin.left - margin.right,
    height = 10;

    var svg = d3.select("#my_bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)    
    .style("margin-left", "-11px")
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
    .domain([0, this.max])
    .range([ 0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .call(d3.axisBottom(x))
    .select(".domain").remove();

    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.title; }))
    .padding(.1);
    svg.append("g")
    .call(d3.axisLeft(y))
    .select(".domain").remove();

    svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .style('opacity', 0.8)
    .style('fill', '#ededed')
    .style("box-shadow", "0px 4px 4px rgba(0, 0, 0, 0.25)");

    

    svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.title); })
    .transition()
    .duration(500)
    .attr("width", function(d) { return x(d.value); })
    .attr("height", y.bandwidth() )
    .attr("fill", this.color)
    .attr("rx", 3)


    svg.append("text")
    .attr("x", (0))				
    .attr("y", (-5) )
    .style("font-size", "11px") 
    .style("font-weight", "600") 
    .style("font-family","sans-serif")
    .style("fill", "#000000")
    .text(this.titulo);

    svg.append("text")
    .attr("x", (width - 35))				
    .attr("y", (-5) )
    .style("font-size", "11px") 
    .style("font-weight", "600") 
    .style("font-family","sans-serif")
    .style("fill", "#000000")
    .text(this.value + "/" + this.max);
  
  }


}

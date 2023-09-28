import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent implements AfterViewInit {
  @ViewChild('progress') svgProgressBar: ElementRef;

  private _data: any;
  tiposDispositivos: any = [];
  mostrar: boolean;
  @Input() set data(val: any) {
    this._data = val;
    console.log(this._data);
    this.update();
    
  }
  get data() {
    return this._data;
  }
  @Input() public width: number;
  @Input() public typeService: string;
  @Input() public icon: boolean = false;
  typeIcon: number = 2;
  public svg: any;
  iconoDispositivo: string  = 'assets/img/dash-punta-blue.svg';

  private isInitiated: boolean = false;

  @Output() private typeChanged: EventEmitter<string> = new EventEmitter();

  constructor(public reloadDataService: ReloadDataService,
    private auth: AdministratorService,
    private dashboardService: DashboardService) {
    localStorage.setItem('type-service', '3');
    }

  ngAfterViewInit(): void {
    this.consultaTiposDispositivos();
    this.draw();
  }

  draw() {
    if(this.typeService == 'Sitios'){
      this.iconoDispositivo = 'assets/img/dash-punta-blue.svg'
    }else{
      this.iconoDispositivo = 'assets/img/dash-interface-blue.svg'
    }
    let percent = this.data.porcentaje;
    let total1 = this.data.total;
    const w = this.width,
      h = w;
    let urlImage = this.data.icono;

    const outerRadius = w / 2 - 10;
    const innerRadius = w / 2;

    this.svg = d3
      .select(this.svgProgressBar.nativeElement)
      .attr('width', w + 7)
      .attr('height', h + 7)
      .append('g')
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')');

    const arc: d3.Arc<any, {}> = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    const arcLine = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(20)
      .startAngle(-0.05)
      .endAngle(function () {
        let totalCircunferencia = 2 * Math.PI;
        let porcentajes = percent / total1;
        let total = totalCircunferencia * porcentajes;
        return total;
      });

    const defs = this.svg.append('defs');

    let filter = defs.append('filter').attr('id', this.data.id);

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
      .attr('flood-color', this.data.color.colorFondo)
      .attr('flood-opacity', '1')
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

    this.svg
      .append('path')
      .attr('d', arc)
      .style('fill', this.data.color.colorCirculo)
      .style('filter', 'url(#' + this.data.id + ')');

    this.svg
      .append('path')
      .datum('endAngle', 0)
      .attr('d', arcLine)
      .attr('class', 'arcLine')
      .style('fill', this.data.color.colorPorcentaje);

    if (!urlImage) {
      this.svg
        .append('text')
        .datum(0)
        .text(function () {
          return percent;
        })
        .attr('class', 'middleText')
        .attr('text-anchor', 'middle')
        .attr('dy', w / 10)
        .style('font-size', w / 4 + 'px')
        .style('font-family', 'Montserrat')
        .style('font-weight', 'bold')
        .style(
          'fill',
          this.data.color.colorTotal ? '#7B8AA0' : this.data.color.colorTotal
        );
    } else {
      if (this.icon) {
        this.svg
          .append('svg:image')
          .attr('x', -(w / 10))
          .attr('y', -(w / 7))
          .attr('width', w / 4)
          .attr('height', w / 3.5)
          .attr('xlink:href', this.iconoDispositivo);
      } else {
        this.svg
          .append('svg:image')
          .attr('x', -(w / 10))
          .attr('y', -(w / 7))
          .attr('width', w / 4)
          .attr('transform', 'rotate')
          .attr('height', w / 3.5)
          .attr('xlink:href', urlImage)
          .attr('style', "transform: rotate(45deg)");
      }
    }

    this.isInitiated = true;
  }

  private update() {
    if (!this.isInitiated) {
      return;
    }
    d3.selectAll('.d3-tip').remove();

    this.svg.selectAll("g")
    .remove();

    this.svg.selectAll("line")
    .remove();

    this.svg.selectAll("path")
    .remove();

    this.svg.selectAll("circle")
    .remove();

    this.svg.selectAll('image').remove();
    

    
    this.draw();
    
  }

  changeType(tipo: number) {
    this.svg.selectAll('image').remove();
    if (tipo == 1) {
      this.svg
        .append('svg:image')
        .attr('x', -(this.width / 10))
        .attr('y', -(this.width / 7))
        .attr('width', this.width / 4)
        .attr('height', this.width / 3.5)
        .attr('xlink:href', 'assets/img/dash-enlace-blue.svg');
      this.reloadDataService.setType(1);
      this.iconoDispositivo = 'assets/img/dash-enlace-blue.svg';
    } else if (tipo == 3) {
      this.svg
        .append('svg:image')
        .attr('x', -(this.width / 10))
        .attr('y', -(this.width / 7))
        .attr('width', this.width / 4)
        .attr('height', this.width / 3.5)
        .attr('xlink:href', 'assets/img/dash-punta-blue.svg');
      this.reloadDataService.setType(3);
      this.iconoDispositivo = 'assets/img/dash-punta-blue.svg';
    } else {
      this.svg
        .append('svg:image')
        .attr('x', -(this.width / 10))
        .attr('y', -(this.width / 7))
        .attr('width', this.width / 4)
        .attr('height', this.width / 3.5)
        .attr('xlink:href', 'assets/img/dash-interface-blue.svg');
      this.reloadDataService.setType(2);
      this.iconoDispositivo = 'assets/img/dash-interface-blue.svg';
    }

    this.typeChanged.emit();
  }

  cambiarIcono(){
    this.svg.selectAll('image').remove();

      this.svg
        .append('svg:image')
        .attr('x', -(this.width / 10))
        .attr('y', -(this.width / 7))
        .attr('width', this.width / 4)
        .attr('height', this.width / 3.5)
        .attr('xlink:href', this.iconoDispositivo);


    this.typeChanged.emit();
  }

  consultaTiposDispositivos(){
    this.dashboardService.obtenerTiposDispositivos(this.auth.getIdCliente()).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          console.log("DataDispositivos",data)
          this.tiposDispositivos = data;
          if(this.tiposDispositivos.length > 1){
            this.mostrar = true;
          }else{
            this.mostrar = false;
          }
          console.log("NumeroDispositivos",this.mostrar)
        }
      },
      error: (error) => { 
        console.log("Error")
      }
    });
  }
}

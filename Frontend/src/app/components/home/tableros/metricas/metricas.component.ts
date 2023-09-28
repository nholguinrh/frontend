import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Estadistica } from 'src/app/shared/model/cliente.model';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';

@Component({
  selector: 'smc-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.css']
})
export class MetricasComponent implements OnInit {


  locate = moment.locale('es');
  //formatDay = d3.timeFormat('%d de %b');
  @Input('estadisticas') estadisticaList: Estadistica[];

  _periodo:any
  @Input() set periodo(val: string) {
    this._periodo = val;
    this._periodo = {
      fechaInicio: moment(this._periodo.fechaInicio).format('D [de] MMM') ,
      fechaFin: moment(this._periodo.fechaFin).format('D [de] MMM') 
    }
    this.locate = moment.locale('es'); 
  }

  @Input('spinner') spinnerLoading: boolean;

  isDarkTheme: Observable<boolean>;
  panelOpenState = false;
  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;

  }

}

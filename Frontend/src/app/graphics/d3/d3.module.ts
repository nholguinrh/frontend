import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { AlertModule } from 'src/app/shared/utils/alertas';
import { CustomSelectRoundedModule } from '../../shared/utils/custom-select-rounded';
import { AfectacionMapaSimpleBarComponent } from './afectacion-mapa-simple-bar/afectacion-mapa-simple-bar.component';
import { AfectacionesEnlacesDensityComponent } from './afectaciones-enlaces-density/afectaciones-enlaces-density.component';
import { AlarmasEnlacesBarrasComponent } from './alarmas-enlaces-barras/alarmas-enlaces-barras.component';
import { AlarmasEnlacesBurbujasComponent } from './alarmas-enlaces-burbujas/alarmas-enlaces-burbujas.component';
import { AlarmasEnlacesLineasComponent } from './alarmas-enlaces-lineas/alarmas-enlaces-lineas.component';
import { AreaComponent } from './area/area.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { BoxplotComponent } from './boxplot/boxplot.component';
import { BubbleComponent } from './bubble/bubble.component';
import { ComparativeTwolinearComponent } from './comparative-twolinear/comparative-twolinear.component';
import { DensityComponent } from './density/density.component';
import { DonutComponent } from './donut/donut.component';
import { InvertedHistogramComponent } from './inverted-histogram/inverted-histogram.component';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { LinesGroupFullSizeComponent } from './lines-group-full-size/lines-group-full-size.component';
import { LinesGroupComponent } from './lines-group/lines-group.component';
import { OneBarComponent } from './one-bar/one-bar.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PromediosIncidentesAreaComponent } from './promedios-incidentes-area/promedios-incidentes-area.component';
import { PromediosMapaBarrasComponent } from './promedios-mapa-barras/promedios-mapa-barras.component';
import { RendimientoDiarioEjecutivoComponent } from './rendimiento-diario-ejecutivo/rendimiento-diario-ejecutivo.component';
import { ServicesMapComponent } from './services-map/services-map.component';
import { ServiciosEnlacesBoxplotComponent } from './servicios-enlaces-boxplot/servicios-enlaces-boxplot.component';
import { SimpleBarComponent } from './simple-bar/simple-bar.component';
import { SpeedometerComponent } from './speedometer/speedometer.component';
import { TicketlineComponent } from './ticketline/ticketline.component';
import { TicketsEnlacesLineasComponent } from './tickets-enlaces-lineas/tickets-enlaces-lineas.component';
import { TicketsIncidentesAreaComponent } from './tickets-incidentes-area/tickets-incidentes-area.component';
import { TicketsMapaBarrasFullSizeComponent } from './tickets-mapa-barras-full-size/tickets-mapa-barras-full-size.component';
import { TicketsMapaBarrasComponent } from './tickets-mapa-barras/tickets-mapa-barras.component';
import { VistaGeneralEnlacesSpeedComponent } from './vista-general-enlaces-speed/vista-general-enlaces-speed.component';

import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { CustomDatepickerModule } from '../../shared/utils/custom-datepicker';
import { ServiceErrorDashboardModule } from 'src/app/shared/utils/service-error-dashboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AreaVozComponent } from './area-voz/area-voz.component';
import { DensityVozComponent } from './density-voz/density-voz.component';
import { MatCardModule } from '@angular/material/card';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatDividerModule } from '@angular/material/divider';
import { VozVistaLlamadasComponent } from './voz-vista-llamadas/voz-vista-llamadas.component';
import { VozRendimientoMetricasComponent } from './voz-rendimiento-metricas/voz-rendimiento-metricas.component';
import { VozDuracionLlamadaComponent } from './voz-duracion-llamada/voz-duracion-llamada.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

registerLocaleData(localeEsMx);

@NgModule({
  declarations: [
    AfectacionesEnlacesDensityComponent,
    AfectacionMapaSimpleBarComponent,
    AlarmasEnlacesLineasComponent,
    AreaComponent,
    BarChartComponent,
    BoxplotComponent,
    ComparativeTwolinearComponent,
    DensityComponent,
    DonutComponent,
    LineGraphComponent,
    LinesGroupComponent,
    LinesGroupFullSizeComponent,
    OneBarComponent,
    ProgressBarComponent,
    PromediosIncidentesAreaComponent,
    PromediosMapaBarrasComponent,
    RendimientoDiarioEjecutivoComponent,
    ServicesMapComponent,
    ServiciosEnlacesBoxplotComponent,
    SimpleBarComponent,
    SpeedometerComponent,
    TicketlineComponent,
    TicketsEnlacesLineasComponent,
    TicketsIncidentesAreaComponent,
    TicketsMapaBarrasComponent,
    VistaGeneralEnlacesSpeedComponent,
    AlarmasEnlacesBarrasComponent,
    AlarmasEnlacesBurbujasComponent,
    BubbleComponent,
    InvertedHistogramComponent,
    TicketsMapaBarrasFullSizeComponent,
    AreaVozComponent,
    DensityVozComponent,
    VozVistaLlamadasComponent,
    VozRendimientoMetricasComponent,
    VozDuracionLlamadaComponent,
    
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectRoundedModule,
    CustomDatepickerModule,
    ServiceErrorDashboardModule,
    MatTooltipModule,
    MatCardModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    MatDividerModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ],
  exports: [
    AfectacionesEnlacesDensityComponent,
    AfectacionMapaSimpleBarComponent,
    AlarmasEnlacesLineasComponent,
    AreaComponent,
    BarChartComponent,
    BoxplotComponent,
    ComparativeTwolinearComponent,
    DensityComponent,
    DonutComponent,
    LineGraphComponent,
    LinesGroupComponent,
    LinesGroupFullSizeComponent,
    OneBarComponent,
    ProgressBarComponent,
    PromediosIncidentesAreaComponent,
    PromediosMapaBarrasComponent,
    RendimientoDiarioEjecutivoComponent,
    ServicesMapComponent,
    ServiciosEnlacesBoxplotComponent,
    SimpleBarComponent,
    SpeedometerComponent,
    TicketlineComponent,
    TicketsEnlacesLineasComponent,
    TicketsIncidentesAreaComponent,
    TicketsMapaBarrasComponent,
    TicketsMapaBarrasFullSizeComponent,
    VistaGeneralEnlacesSpeedComponent,
    AlarmasEnlacesBarrasComponent,
    AlarmasEnlacesBurbujasComponent,
    BubbleComponent,
    InvertedHistogramComponent,
    AreaVozComponent,
    DensityVozComponent,
    VozVistaLlamadasComponent,
    VozRendimientoMetricasComponent,
    VozDuracionLlamadaComponent,
  ],

  providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }],
})
export class D3Module {}

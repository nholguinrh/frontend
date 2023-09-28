import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HomeComponent } from './home.component';
import { InicioComponent } from './inicio/inicio.component';
import { RouterModule } from '@angular/router';
import { TablerosComponent } from './tableros/tableros.component';
import { D3Module } from 'src/app/graphics/d3/d3.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderHomeModule } from 'src/app/shared/utils/header-home';
import { InicioClienteComponent } from './inicio-cliente/inicio-cliente.component';
import { HeaderClienteModule } from 'src/app/shared/utils/header-cliente';
import { MatCardModule } from '@angular/material/card';
import { MonitoreoEnlacesComponent } from './tableros/monitoreo-enlaces/monitoreo-enlaces.component';
import { MonitoreoMapaComponent } from './tableros/monitoreo-mapa/monitoreo-mapa.component';
import { MonitoreoEjecutivoComponent } from './tableros/monitoreo-ejecutivo/monitoreo-ejecutivo.component';
import { MetricasComponent } from './tableros/metricas/metricas.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TitleDashboardComponent } from './tableros/title-dashboard/title-dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { EditGraphComponent } from './tableros/edit-graph/edit-graph.component';
import { CarouselModule } from '../../shared/utils/carousel/carousel.module';
import { ProgressBarComponent } from '../../graphics/d3/progress-bar/progress-bar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableroFullComponent } from './tableros/tablero-full/tablero-full.component';
import { AfectacionesRecientesComponent } from './tableros/afectaciones-recientes/afectaciones-recientes.component';
import { PagerModule } from 'src/app/shared/utils/pager';
import { MatInputModule } from '@angular/material/input';
import { AlertModule } from 'src/app/shared/utils/alertas';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceErrorDashboardModule } from 'src/app/shared/utils/service-error-dashboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MonitoreoDatosVozComponent } from './tableros/monitoreo-datos-voz/monitoreo-datos-voz.component';
import { PaginatorModule } from 'src/app/shared/utils/paginator';
import { CarouselVozModule } from 'src/app/shared/utils/carousel-voz';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    HomeComponent,
    InicioComponent,
    TablerosComponent,
    InicioClienteComponent,
    MonitoreoEnlacesComponent,
    MonitoreoMapaComponent,
    MonitoreoEjecutivoComponent,
    MetricasComponent,
    TitleDashboardComponent,
    EditGraphComponent,
    TableroFullComponent,
    AfectacionesRecientesComponent,
    MonitoreoDatosVozComponent,
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    HeaderHomeModule,
    MatTabsModule,
    HeaderClienteModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSelectModule,
    MatDividerModule,
    FlexLayoutModule,
    D3Module,
    CarouselModule,
    PagerModule,
    AlertModule,
    MatInputModule,
    ServiceErrorDashboardModule,
    MatTooltipModule,
    PaginatorModule,
    CarouselVozModule,
    MatDatepickerModule,
    IvyCarouselModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  exports: [
    TablerosComponent,
    MetricasComponent,
    MonitoreoEnlacesComponent,
    MonitoreoMapaComponent,
    MonitoreoEjecutivoComponent,
    TitleDashboardComponent,
    ProgressBarComponent,
    TableroFullComponent,
    AfectacionesRecientesComponent,
    MonitoreoDatosVozComponent
  ]
})
export class HomeModule {}

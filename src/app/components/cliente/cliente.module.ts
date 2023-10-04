import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteContainerComponent } from './cliente-container/cliente-container.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { SimpleToolbarModule } from 'src/app/shared/utils/simple-toolbar';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PerfiladoComponent } from './perfilado/perfilado.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { BackButtonModule } from 'src/app/shared/utils/back-button';
import { OptionButtonModule } from 'src/app/shared/utils/option-button';
import { FooterModule } from 'src/app/shared/utils/footer';
import { D3Module } from 'src/app/graphics/d3/d3.module';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TablerosClienteComponent } from './tableros-cliente/tableros-cliente.component';
import { HomeModule } from '../home/home.module';
import { WorkspaceClienteComponent } from './workspace-cliente/workspace-cliente.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AlertModule } from 'src/app/shared/utils/alertas';
import { ServiciosClienteComponent } from './servicios-cliente/servicios-cliente.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { ServiciosDirectosComponent } from './servicios-cliente/servicios-directos/servicios-directos.component';
import { BusquedaPersonalizadaComponent } from './servicios-cliente/busqueda-personalizada/busqueda-personalizada.component';
import { PagerModule } from 'src/app/shared/utils/pager';
import { IncidentesClienteComponent } from './incidentes-cliente/incidentes-cliente.component';
import { EquipoClienteComponent } from './equipo-cliente/equipo-cliente.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { DetalleIncidenteComponent } from './incidentes-cliente/detalle-incidente/detalle-incidente.component';
import { DetalleServicioComponent } from './servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.component';
import { InvitarClienteComponent } from './equipo-cliente/invitar-cliente/invitar-cliente.component';
import { DetalleMetricaComponent } from './servicios-cliente/busqueda-personalizada/detalle-metrica/detalle-metrica.component';
import {MatRadioModule} from '@angular/material/radio';
import { HistoricoServicioComponent } from './servicios-cliente/busqueda-personalizada/historico-servicio/historico-servicio.component';
import { BandejaEntradaClienteComponent } from './bandeja-entrada/bandeja-entrada.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatBadgeModule} from '@angular/material/badge';
import { CheckboxMetricaDialogComponent } from './servicios-cliente/busqueda-personalizada/historico-servicio/checkbox-metrica-dialog/checkbox-metrica-dialog.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DetalleGraficaFullComponent } from './servicios-cliente/busqueda-personalizada/detalle-grafica-full/detalle-grafica-full.component';
import { ModuloAyudaClienteComponent } from './modulo-ayuda-cliente/modulo-ayuda-cliente.component';
import { ModuloAyudaClienteInformacionComponent } from './modulo-ayuda-cliente/modulo-ayuda-cliente-informacion/modulo-ayuda-cliente-informacion.component';
import { ModuloAyudaClienteDetalleComponent } from './modulo-ayuda-cliente/modulo-ayuda-cliente-informacion/modulo-ayuda-cliente-detalle/modulo-ayuda-cliente-detalle.component';
import { ServiceErrorDashboardModule } from 'src/app/shared/utils/service-error-dashboard';
import { PaginatorModule } from 'src/app/shared/utils/paginator';
import { FilterErrorModule } from 'src/app/shared/utils/filter-error';
import { ConfiguracionInactividadComponent } from './configuracion-inactividad/configuracion-inactividad.component';
import { ModuloAyudaClienteSolucionComponent } from './modulo-ayuda-cliente/modulo-ayuda-cliente-informacion/modulo-ayuda-cliente-solucion/modulo-ayuda-cliente-solucion.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@NgModule({
  declarations: [ClienteContainerComponent, BienvenidaComponent, PerfiladoComponent, DashboardsComponent, TablerosClienteComponent, WorkspaceClienteComponent, ServiciosClienteComponent, ServiciosDirectosComponent, BusquedaPersonalizadaComponent, IncidentesClienteComponent, EquipoClienteComponent, DetalleIncidenteComponent, DetalleServicioComponent, InvitarClienteComponent, DetalleMetricaComponent, HistoricoServicioComponent, BandejaEntradaClienteComponent, CheckboxMetricaDialogComponent, DetalleGraficaFullComponent, ModuloAyudaClienteComponent, ModuloAyudaClienteInformacionComponent, ModuloAyudaClienteDetalleComponent, ConfiguracionInactividadComponent, ModuloAyudaClienteSolucionComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FooterModule,
    CommonModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    SimpleToolbarModule,
    BackButtonModule,
    OptionButtonModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    D3Module,
    MatToolbarModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSelectModule,
    HomeModule,
    MatTabsModule,
    AlertModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatInputModule,
    MatDialogModule,
    MatStepperModule,
    PagerModule,
    MatExpansionModule,
    FormsModule, 
    ReactiveFormsModule,
    MatRadioModule,
    SharedModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatChipsModule,
    MatTooltipModule,
    ServiceErrorDashboardModule,
    PaginatorModule,
    FilterErrorModule,
    MatProgressSpinnerModule
    ]  
})
export class ClienteModule { }

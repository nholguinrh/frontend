import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccesosDirectosComponent } from './accesos-directos/accesos-directos.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesComponent } from './clientes/clientes.component';
import { StteperModule } from 'src/app/shared/utils/stteper';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EquiposComponent } from './equipos/equipos.component';
import { PagerModule } from 'src/app/shared/utils/pager';
import { AlertModule } from 'src/app/shared/utils/alertas';
import { InvitarPersonaComponent } from './equipos/invitar-persona/invitar-persona.component';
import { DescargaActividadesComponent } from './equipos/descarga-actividades/descarga-actividades.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import { OptionButtonModule } from 'src/app/shared/utils/option-button';
import { MatMenuModule } from '@angular/material/menu';
import { ConfiguracionSlaComponent } from './clientes/detalle-cliente/configuracion-sla/configuracion-sla.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DetalleClienteComponent } from './clientes/detalle-cliente/detalle-cliente.component';
import { InfomacionGeneralComponent } from './clientes/detalle-cliente/infomacion-general/infomacion-general.component';
import { ConfirmDialogModule } from 'src/app/shared/utils/confirm-dialog';
import { NotificationDialogModule } from 'src/app/shared/utils/notification-dialog';
import { PuntasComponent } from './clientes/detalle-cliente/puntas/puntas.component';
import { PuntasDialogModule } from 'src/app/shared/utils/puntas-dialog';
import { InformacionComponent } from './clientes/nuevo-cliente/informacion/informacion.component';
import { ActivacionComponent } from './clientes/nuevo-cliente/activacion/activacion.component';
import { ConfiguracionComponent } from './clientes/nuevo-cliente/configuracion/configuracion.component';
import { EquipoClienteComponent } from './clientes/detalle-cliente/equipo-cliente/equipo-cliente.component';
import { MiembroEquipoClienteComponent } from './clientes/detalle-cliente/equipo-cliente/miembro-equipo-cliente/miembro-equipo-cliente.component';
import { SlaComponent } from './clientes/detalle-cliente/sla/sla.component';
import { StteperAdminModule } from 'src/app/shared/utils/stteper-admin';
import { InterfacesDialogModule } from 'src/app/shared/utils/interfaces-dialog';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { PlantillaSlaComponent } from './configuraciones/plantilla-sla/plantilla-sla.component';
import { PaqueteComponent } from './configuraciones/paquete/paquete.component';
import { BandejaEntradaComponent } from './bandeja-entrada/bandeja-entrada.component';
import { ConfiguracionMasivaComponent } from './clientes/detalle-cliente/configuracion-masiva/configuracion-masiva.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MassiveNotificationDialogModule } from 'src/app/shared/utils/massive-notification-dialog';
import { FilterErrorModule } from 'src/app/shared/utils/filter-error';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ModuloAyudaAdminComponent } from './modulo-ayuda-admin/modulo-ayuda-admin.component';
import { ModuloAyudaAdminInformacionComponent } from './modulo-ayuda-admin/modulo-ayuda-admin-informacion/modulo-ayuda-admin-informacion.component';
import { ModuloAyudaAdminDetalleComponent } from './modulo-ayuda-admin/modulo-ayuda-admin-informacion/modulo-ayuda-admin-detalle/modulo-ayuda-admin-detalle.component';
import { ModuloAyudaAdminSolucionComponent } from './modulo-ayuda-admin/modulo-ayuda-admin-informacion/modulo-ayuda-admin-solucion/modulo-ayuda-admin-solucion.component';



@NgModule({
  declarations: [AccesosDirectosComponent, WorkspaceComponent, ClientesComponent, EquiposComponent, InvitarPersonaComponent, DescargaActividadesComponent, DetalleClienteComponent, InfomacionGeneralComponent, PuntasComponent, InformacionComponent, ActivacionComponent, ConfiguracionComponent, EquipoClienteComponent, MiembroEquipoClienteComponent, ConfiguracionSlaComponent, SlaComponent, ConfiguracionesComponent, PlantillaSlaComponent, PaqueteComponent, ConfiguracionMasivaComponent, BandejaEntradaComponent, ModuloAyudaAdminComponent, ModuloAyudaAdminInformacionComponent, ModuloAyudaAdminDetalleComponent, ModuloAyudaAdminSolucionComponent],
  imports: [
    MatIconModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    FormsModule,
    CommonModule,
    StteperModule,
    StteperAdminModule,
    RouterModule,
    MatCardModule,
    MatStepperModule,
    MatRadioModule,
    MatDialogModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    PagerModule,
    AlertModule,
    MatDividerModule,
    OptionButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ConfirmDialogModule,
    NotificationDialogModule,
    MassiveNotificationDialogModule,
    PuntasDialogModule,
    InterfacesDialogModule,
    MatButtonToggleModule,
    FilterErrorModule,
    MatProgressBarModule,
    SharedModule,
    MatTooltipModule
  ]
})
export class AdministratorModule { }


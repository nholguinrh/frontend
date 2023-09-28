import { Routes } from '@angular/router';
import { AutorizationContainterComponent } from 'src/app/components/autorization/autorization-containter/autorization-containter.component';
import { LoginComponent } from 'src/app/components/autorization/login/login.component';
import { BienvenidaComponent } from 'src/app/components/cliente/bienvenida/bienvenida.component';
import { ClienteContainerComponent } from 'src/app/components/cliente/cliente-container/cliente-container.component';
import { PerfiladoComponent } from 'src/app/components/cliente/perfilado/perfilado.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { InicioComponent } from 'src/app/components/home/inicio/inicio.component';
import { NAV } from './navegacion';
import { DashboardsComponent } from 'src/app/components/cliente/dashboards/dashboards.component';
import { FirststepComponent } from 'src/app/components/autorization/verification/firststep/firststep.component';
import { SecondstepComponent } from 'src/app/components/autorization/verification/secondstep/secondstep.component';
import { CodestepComponent } from 'src/app/components/autorization/verification/codestep/codestep.component';
import { CanDeactivateGuard } from '../helper/canDeactivateGuard.helper';
import { RegisterComponent } from 'src/app/components/autorization/register/register.component';
import { AccesosDirectosComponent } from 'src/app/components/administrator/accesos-directos/accesos-directos.component';
import { WorkspaceComponent } from 'src/app/components/administrator/workspace/workspace.component';
import { DescargaActividadesComponent } from 'src/app/components/administrator/equipos/descarga-actividades/descarga-actividades.component';
import { InvitarPersonaComponent } from 'src/app/components/administrator/equipos/invitar-persona/invitar-persona.component';
import { LoginAdminComponent } from 'src/app/components/autorization/login-admin/login-admin.component';
import { AuthGuardHelper } from '../helper/authGuard.helper';
import { ConfiguracionesComponent } from 'src/app/components/administrator/configuraciones/configuraciones.component';
import { DetalleClienteComponent } from 'src/app/components/administrator/clientes/detalle-cliente/detalle-cliente.component';
import { InformacionComponent } from 'src/app/components/administrator/clientes/nuevo-cliente/informacion/informacion.component';
import { ActivacionComponent } from 'src/app/components/administrator/clientes/nuevo-cliente/activacion/activacion.component';
import { ConfiguracionComponent } from 'src/app/components/administrator/clientes/nuevo-cliente/configuracion/configuracion.component';
import { MiembroEquipoClienteComponent } from 'src/app/components/administrator/clientes/detalle-cliente/equipo-cliente/miembro-equipo-cliente/miembro-equipo-cliente.component';
import { SlaComponent } from 'src/app/components/administrator/clientes/detalle-cliente/sla/sla.component';
import { TablerosClienteComponent } from 'src/app/components/cliente/tableros-cliente/tableros-cliente.component';
import { InicioClienteComponent } from 'src/app/components/home/inicio-cliente/inicio-cliente.component';
import { PaqueteComponent } from 'src/app/components/administrator/configuraciones/paquete/paquete.component';
import { PlantillaSlaComponent } from 'src/app/components/administrator/configuraciones/plantilla-sla/plantilla-sla.component';
import { BandejaEntradaComponent } from 'src/app/components/administrator/bandeja-entrada/bandeja-entrada.component';
import { WorkspaceClienteComponent } from 'src/app/components/cliente/workspace-cliente/workspace-cliente.component';
import { BusquedaPersonalizadaComponent } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/busqueda-personalizada.component';
import { InvitarClienteComponent } from 'src/app/components/cliente/equipo-cliente/invitar-cliente/invitar-cliente.component';
import { DetalleMetricaComponent } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-metrica/detalle-metrica.component';
import { HistoricoServicioComponent } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/historico-servicio/historico-servicio.component';
import { RegisterAdminComponent } from 'src/app/components/autorization/register-admin/register-admin.component';
import { RecoverContainerComponent } from 'src/app/components/autorization/recover-container/recover-container.component';
import { ChangePasswordComponent } from 'src/app/components/autorization/recover/change-password/change-password.component';
import { EnterCodeComponent } from 'src/app/components/autorization/recover/enter-code/enter-code.component';
import { NewPasswordComponent } from 'src/app/components/autorization/recover/new-password/new-password.component';
import { TableroFullComponent } from 'src/app/components/home/tableros/tablero-full/tablero-full.component';
import { BandejaEntradaClienteComponent } from 'src/app/components/cliente/bandeja-entrada/bandeja-entrada.component';
import { ROLE } from '../helper/role.helper';
import { ModuloAyudaAdminComponent } from 'src/app/components/administrator/modulo-ayuda-admin/modulo-ayuda-admin.component';
import { ModuloAyudaAdminInformacionComponent } from 'src/app/components/administrator/modulo-ayuda-admin/modulo-ayuda-admin-informacion/modulo-ayuda-admin-informacion.component';
import { ModuloAyudaAdminDetalleComponent } from 'src/app/components/administrator/modulo-ayuda-admin/modulo-ayuda-admin-informacion/modulo-ayuda-admin-detalle/modulo-ayuda-admin-detalle.component';
import { DetalleGraficaFullComponent } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-grafica-full/detalle-grafica-full.component';
import { ModuloAyudaClienteComponent } from 'src/app/components/cliente/modulo-ayuda-cliente/modulo-ayuda-cliente.component';
import { ModuloAyudaClienteInformacionComponent } from 'src/app/components/cliente/modulo-ayuda-cliente/modulo-ayuda-cliente-informacion/modulo-ayuda-cliente-informacion.component';
import { ModuloAyudaClienteDetalleComponent } from 'src/app/components/cliente/modulo-ayuda-cliente/modulo-ayuda-cliente-informacion/modulo-ayuda-cliente-detalle/modulo-ayuda-cliente-detalle.component';
import { ModuloAyudaAdminSolucionComponent } from 'src/app/components/administrator/modulo-ayuda-admin/modulo-ayuda-admin-informacion/modulo-ayuda-admin-solucion/modulo-ayuda-admin-solucion.component';
import { ConfiguracionInactividadComponent } from 'src/app/components/cliente/configuracion-inactividad/configuracion-inactividad.component';
import { ModuloAyudaClienteSolucionComponent } from 'src/app/components/cliente/modulo-ayuda-cliente/modulo-ayuda-cliente-informacion/modulo-ayuda-cliente-solucion/modulo-ayuda-cliente-solucion.component';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: NAV.login,
  },
  {
    path: NAV.login,
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: NAV.loginAdmin,
    pathMatch: 'full',
    component: LoginAdminComponent,
  },
  {
    path: NAV.register,
    pathMatch: 'full',
    component: RegisterComponent,
  },
  {
    path: NAV.registerUser,
    pathMatch: 'full',
    component: RegisterAdminComponent,
  },
  {
    path: NAV.registerAdmin,
    component: RegisterAdminComponent,
  },
  {
    path: NAV.cambiarContrasenia,
    pathMatch: 'prefix',
    component: RecoverContainerComponent,
    children: [
      {
        path: '',
        component: ChangePasswordComponent,
        outlet: 'auth',
      },
      {
        path: 'code',
        component: EnterCodeComponent,
        outlet: 'auth',
      },
      {
        path: 'pass',
        component: NewPasswordComponent,
        outlet: 'auth',
      },
    ],
  },
  {
    path: NAV.verification,
    pathMatch: 'prefix',
    component: AutorizationContainterComponent,
    children: [
      {
        path: '',
        component: FirststepComponent,
        outlet: 'auth',
      },
      {
        path: 'code',
        component: CodestepComponent,
        outlet: 'auth',
      },
      {
        path: 'pass',
        component: SecondstepComponent,
        outlet: 'auth',
      },
    ],
  },
  {
    path: NAV.verificationAdmin,
    pathMatch: 'prefix',
    component: AutorizationContainterComponent,
    children: [
      {
        path: '',
        component: CodestepComponent,
        outlet: 'auth',
      },
      {
        path: 'code',
        component: CodestepComponent,
        outlet: 'auth',
      },
    ],
  },
  {
    path: NAV.verificationUser,
    pathMatch: 'prefix',
    component: AutorizationContainterComponent,
    children: [
      {
        path: '',
        component: CodestepComponent,
        outlet: 'auth',
      },
      {
        path: 'code',
        component: CodestepComponent,
        outlet: 'auth',
      },
    ],
  },
  {
    path: NAV.cliente,
    pathMatch: 'prefix',
    component: ClienteContainerComponent,
    children: [
      {
        path: '',
        component: BienvenidaComponent,
        canDeactivate: [CanDeactivateGuard],
        outlet: 'cliente',
      },
      {
        path: NAV.perfil,
        component: PerfiladoComponent,
        outlet: 'cliente',
      },
      {
        path: NAV.dashboards,
        component: DashboardsComponent,
        outlet: 'cliente',
      }
    ],
  },
  {
    path: NAV.inicioCliente,
    pathMatch: 'prefix',
    component: InicioClienteComponent,
    data: {
      role: [ROLE.OPERADOR, ROLE.EJECUTIVO]
    },
    canActivate: [AuthGuardHelper],
    children: [
      {
        path: '',
        component: TablerosClienteComponent,
        outlet: 'tablero',
      },
      {
        path: 'full-size',
        component: TableroFullComponent,
        outlet: 'tablero',
      },
      {
        path: NAV.afectacionHistorico,
        component: HistoricoServicioComponent,
        outlet: 'tablero',
      },
      {
        path: NAV.afectacionMetrica,
        component: DetalleMetricaComponent,
        outlet: 'tablero',
      },
      {
        path: 'cliente-workspace',
        component: WorkspaceClienteComponent,
        outlet: 'tablero',
      },
      {
        path: NAV.busquedaPersonalizada,
        component: BusquedaPersonalizadaComponent,
        outlet: 'tablero',
      },
      {
        path: NAV.invitarCliente,
        component: InvitarClienteComponent,
        outlet: 'tablero',
      },
      {
        path: NAV.cambiarRolCliente,
        component: InvitarClienteComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.detalleMetrica,
        component: DetalleMetricaComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.historicoServicio,
        component: HistoricoServicioComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.detalleFullSize,
        component: DetalleGraficaFullComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.inbox,
        component: BandejaEntradaClienteComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.inbox,
        component: BandejaEntradaClienteComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.moduloAyudaAdmin,
        component: ModuloAyudaClienteComponent,
        outlet: 'tablero'
      },
      
      {
        path: NAV.moduloAyudaAdminInformacion,
        component: ModuloAyudaClienteInformacionComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.moduloAyudaAdminDetalle,
        component: ModuloAyudaClienteDetalleComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.moduloAyudaAdminSolucion,
        component: ModuloAyudaClienteSolucionComponent,
        outlet: 'tablero'
      },
      {
        path: NAV.configuracionInactividad,
        component: ConfiguracionInactividadComponent,
        outlet: 'tablero'
      },
    ]
  },
  {
    path: NAV.administrator,
    pathMatch: 'prefix',
    component: InicioComponent,
    data: {
      role: [ROLE.ADMINISTRADOR, ROLE.SUPER_ADMINISTRADOR, ROLE.BACK_OFFICE]
    },
    canActivate: [AuthGuardHelper],
    children: [
      {
        path: '',
        component: AccesosDirectosComponent,
        outlet: 'home',
      },
      {
        path: NAV.descargaActividades,
        component: DescargaActividadesComponent,
        outlet: 'home',
      },
      {
        path: 'administrator-workspace',
        component: WorkspaceComponent,
        outlet: 'home',
      },
      {
        path: 'detalle-cliente',
        component: DetalleClienteComponent,
        outlet: 'home',
      },
      {
        path: NAV.nuevoClienteInformacion,
        component: InformacionComponent,
        outlet: 'home',
      },
      {
        path: NAV.nuevoClienteActivacion,
        component: ActivacionComponent,
        outlet: 'home',
      },
      {
        path: NAV.nuevoClienteConfiguracion,
        component: ConfiguracionComponent,
        outlet: 'home',
      },
      {
        path: NAV.invitarPersona,
        component: InvitarPersonaComponent,
        outlet: 'home'
      },
      {
        path: NAV.miembroDetalleCliente,
        component: MiembroEquipoClienteComponent,
        outlet: 'home'
      },
      {
        path: NAV.sla,
        component: SlaComponent,
        outlet: 'home'
      },
      {
        path: NAV.cambiarRol,
        component: InvitarPersonaComponent,
        outlet: 'home'
      },
      {
        path: NAV.configuracionPaquete,
        component: PaqueteComponent,
        outlet: 'home'
      },
      {
        path: NAV.configuracionPlantillaSla,
        component: PlantillaSlaComponent,
        outlet: 'home'
      },
      {
        path: NAV.inbox,
        component: BandejaEntradaComponent,
        outlet: 'home'
      },
      {
        path: NAV.moduloAyudaAdmin,
        component: ModuloAyudaAdminComponent,
        outlet: 'home'
      },
      
      {
        path: NAV.moduloAyudaAdminInformacion,
        component: ModuloAyudaAdminInformacionComponent,
        outlet: 'home'
      },
      {
        path: NAV.moduloAyudaAdminDetalle,
        component: ModuloAyudaAdminDetalleComponent,
        outlet: 'home'
      },
      {
        path: NAV.moduloAyudaAdminSolucion,
        component: ModuloAyudaAdminSolucionComponent,
        outlet: 'home'
      },
    ],
  },
  {
    path: '**',
    redirectTo: NAV.login,
  },
];

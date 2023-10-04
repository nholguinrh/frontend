import { environment } from 'src/environments/environment';

export const API = {

    onboarding: {
        registro: environment.apiSMC + '/security/loginContrato',
        perfiles: environment.apiSMC + '/catalogos/perfiles',
        dashboards: environment.apiSMC + '/catalogos/dashboards',
        resumen: environment.apiSMC + '/cliente/resumen',
        actualizarPassword: environment.apiSMC + '/verificacion/actualizarPassword',
        enviarCodigo: environment.apiSMC + '/verificacion/enviarCodigo',
        verificarCodigo: environment.apiSMC + '/verificacion/validarCodigo',
        mssmc:{
          actualizarPassword: environment.apiLogin + '/actualizar-contrasenia',
          enviarCodigo: environment.apiLogin + '/generar-codigo-cte',
          registro: environment.apiLogin + '/loginContrato',
          loginAdmin: environment.apiLogin + '/login-invitacion-usr',
          verificarCodigo: environment.apiLogin + '/validar-codigo-cte',
          resumen: environment.apiClientes + '/consultar-resumen',
          dashboards: environment.apiCatalogo + '/dashboards',
        }
    },
    admin: {
        datosHeader: environment.apiSMC + '/clientes/datosInicio',
        accesosDirectos: environment.apiSMC + '/catalogos/accesosDirectos',
        consultaAccesosDirectos: environment.apiSMC + '/clientes/consultaAccesosDirectos',
        editaAccesosDirectos: environment.apiSMC + '/clientes/editarAccesosDirectos',
        login: environment.apiSMC + '/security/login',
        agregarCliente: environment.apiSMC + '/clientes/agregarCliente',
        sendOnboarding: environment.apiSMC + '/clientes/enviarEmail',
        mssmc:{
          login: environment.apiLogin + '/login',
          cliente: environment.apiClientes + '',
          consultaAccesosDirectos: environment.apiConfiguraciones + '/conf-accesos-directos',
          consultarClientes: environment.apiClientes + '/ordenar-antiguedad',
          consultarClientesFavoritos: environment.apiClientes + '/listar-favoritos',
          filtrarClientes: environment.apiClientes + '/filtrar-cadena',
          aplicarFiltros : environment.apiClientes + '/aplicar-filtros',
          enviarCodigoPassword: environment.apiLogin + '/generar-codigo-pwd',
          validarCodigoPassword: environment.apiLogin + '/validar-codigo-pwd',
          emailEquipoAdminTotalplay: environment.apiUsuarios + '/',
          emailEquipoAdminTotalplayReactivar: environment.apiUsuarios + '/registrar-actualiza',
          versionSistema: environment.apiLogin + '/version-sistema',
        },
        clientes: {
            filtrarPorCadena : environment.apiSMC + '/cliente/filtrarPorCadena',
            filtrarPorTipo : environment.apiSMC + '/cliente/filtrarPorTipo',
            listar : environment.apiSMC + '/cliente/listar',
            consultarDetalle: environment.apiSMC + '/cliente/consultarDetalle',
            favorito: environment.apiSMC + '/cliente/favorito',
            emailNuevoCLiente: environment.apiSMC +'/clientes/enviarEmail',
            enviarNotificacionAdmin: environment.apiSMC +'/cliente/enviarNotificacionAdmin',
            mssmc:{
              generarCodigo: environment.apiLogin + '/generar-codigo-usr',
              validarCodigo: environment.apiLogin + '/validar-codigo-usr',
              consultarDetalle: environment.apiClientes + '',
              favorito: environment.apiClientes + '/editar-favorito',
              consultarPuntas: environment.apiConfiguraciones + '/conf-puntas/listar-puntas-cliente',
              consultarPuntasPorTipo: environment.apiConfiguraciones + '/conf-puntas/listar-puntas-por-tipo',
              consultarPuntasPorTexto: environment.apiConfiguraciones + '/conf-puntas/filtrar-cadena',
              consultarDetallePuntas: environment.apiConfiguraciones + '/conf-puntas/detalle-punta',
              puntas: environment.apiConfiguraciones + '/conf-puntas',
              consultarDatosPunta: environment.apiConfiguraciones + '/conf-puntas/total-puntas-cliente',
              activacionMasivaPuntas: environment.apiConfiguraciones + '/conf-puntas/configuracion-masiva',
              emailNuevoCLiente: environment.apiClientes +'/envio-mail',
              configureSLA: environment.apiConfiguraciones + '/conf-sla',
              consultarConfiguracionesSLA: environment.apiConfiguraciones + '/conf-sla/listar-sla',
              consultarConfiguracionesSLAPorTexto: environment.apiConfiguraciones + '/conf-sla/filtrar-cadena',
              consultarDatosPuntaSLA: environment.apiConfiguraciones + '/conf-sla/listar-puntas-cliente-sla',
              configuracionMasivaPuntas: environment.apiConfiguraciones + '/conf-sla/aplicar-todo-sla',
              consultarContadorPuntaSLA: environment.apiConfiguraciones + '/conf-puntas/puntas-contador',
              consultarEquipoAdminTotalplay: environment.apiUsuarios + '/administradores',
              administradoresPorNombresEmail: environment.apiUsuarios + '/administradoresPorNombresEmail',
              emailEquipoCliente: environment.apiClientes + '/usuarios/',
              consultarEquipoCliente: environment.apiClientes + '/usuarios/',
              modificarEquipoCliente: environment.apiClientes + '/usuarios/',
              obtenerUsuarioPorId: environment.apiUsuarios + '/',
              eliminarUsuarioPorId: environment.apiUsuarios + '/',
              consultarPaquete: environment.apiConfiguraciones + '/paquetes',
              modificarPaquete: environment.apiConfiguraciones + '/paquetes/usuarios',
              consultarClientes: environment.apiClientes + '/listar-todos',
              consultarFavoritos: environment.apiClientes + '/listar-todos-favoritos',
              eliminarClientePorId: environment.apiClientes + '/usuarios',
              obtenerClientePorId: environment.apiClientes + '/usuarios/detalle',
              validarEmpresa: environment.apiClientes + '/validar-cliente',
              consultarAsignadasSLA: environment.apiConfiguraciones + '/conf-sla/total-puntas-asociados-sla',
              consultarConfiguradasSLA: environment.apiConfiguraciones + '/conf-sla/total-puntas-configuradas-sla',
              filtrarDispositivos: environment.apiConfiguraciones + '/conf-puntas/filtrar-busqueda-dispositivo',
              eliminarConfiguracionesSLA: environment.apiConfiguraciones + '/conf-sla/borra-configuracionSLA',
              filtrarDispositivosSLA: environment.apiConfiguraciones + '/conf-sla/filtrar-puntas-cliente-sla',
              descargarBitacora: environment.apiUsuarios + '/descargar-bitacora',
              registrarBitacora: environment.apiUsuarios + '/registrar-bitacora',
              filtrarClientePorCadena: environment.apiClientes + '/usuarios/filtrar-cadena',
              emailEquipoClienteActualizar: environment.apiClientes + '/usuarios/registrar-actualiza',
              permitirInvitar: environment.apiClientes + '/permitir-invitar',
            },
        },
        catalogos: {
            bandejaSD: environment.apiSMC + '/catalogos/bandejaSD',
            historicoPerformance: environment.apiSMC + '/catalogos/historicoPerformance',
            origenNombre: environment.apiSMC + '/catalogos/origenes-nombres',
            paquetes: environment.apiSMC + '/catalogos/paquetes',
            rolesTotalPlay: environment.apiSMC + '/catalogos/rolesTotalPlay',
            sector: environment.apiSMC + '/catalogos/sector',
            servicios: environment.apiSMC + '/catalogos/servicios',
            tipoTickets: environment.apiSMC + '/catalogos/tipoTickets',
            mssmc: {
              accesosDirectos: environment.apiCatalogo + '/accesos-directos/',
              bandejaSD: environment.apiCatalogo + '/bandejaSD',
              estatus: environment.apiCatalogo + '/estatus/',
              metricas: environment.apiCatalogo + '/metricas/',
              historicoPerformance: environment.apiCatalogo + '/historicos-performance/',
              origenNombre: environment.apiCatalogo + '/origenes-nombres/',
              paquetes: environment.apiCatalogo + '/paquetes',
              perfiles: environment.apiCatalogo + '/perfiles/',
              procesos: environment.apiCatalogo + '/procesos/',
              rolesTotalPlay: environment.apiCatalogo + '/roles',
              sector: environment.apiCatalogo + '/sectores/',
              servicios: environment.apiCatalogo + '/servicios/',
              tipoTickets: environment.apiCatalogo + '/tipos-ticket',
              listarPlantillasSLA: environment.apiConfiguraciones + '/conf-sla/listar-plantillas',
              detalleSLA: environment.apiConfiguraciones + '/conf-sla/detalle',
              empresas: environment.apiClientes + '/servicio-externo/empresas',
              empresasPorNombre: environment.apiClientes + '/servicio-externo/empresasPorNombre',
              puntas: environment.apiClientes + '/servicio-externo/puntas',
              actualizarPuntas: environment.apiClientes + '/servicio-externo/actualizarPuntas',
              metricasDispositivo: environment.apiDashboards + '/consultar-metricas',
              configuracion: environment.apiConfiguraciones + '/recuperar-parametro',
              paquetesAsociado: environment.apiCatalogo + '/paquetes/estatusActivoAsociado',
            }

        },
        personalizaAlias: environment.apiDashboards + '/personaliza-dispositivo',
    },
    notification:{
      mssmc:{
        consultarEstatus: environment.apiNotification + '/listar-por-usuario',
        crearNotificacion: environment.apiNotification + '/',
        crearNotificacionGeneral: environment.apiNotification + '/notificacion-recarga-general',
        borrarNotificacion: environment.apiNotification + '/',
        actualizarEstatusNotificacion: environment.apiNotification + '/',
        contarNoLeidas: environment.apiNotification + '/total-no-leidas',
        actualizarNotificacionesAccion: environment.apiNotification + '/marcar-leidas-por-cliente',
        crearNotificacionAutomatica: environment.apiNotification + '/notificacion-accion',
        buscarNotificaciones: environment.apiNotification + '/buscar-notificacion',
      }
    },
    dashboards:{
      monitoreoEnlaces:{
        vistaGeneral: environment.apiDashboards + '/monitoreo-global/vistaGeneral',
        //afectacionesRecientes: environment.apiDashboards + '/servicio-externo/afectaciones-recientes',
        promedioTickets: environment.apiDashboards + '/servicio-externo/promedio-tickets',
        promedioServicios: environment.apiDashboards + '/servicio-externo/promedio-servicios',
        historicoMetricas: environment.apiDashboards + '/servicio-externo/historicos-metricas',
        ticketsPunta: environment.apiDashboards + '/monitoreo-global/ticketsDeIncidentes',
        afectacionesRecientes:  environment.apiDashboards + '/monitoreo-global/afectacionesRecientes',
        detalleAfectacionesRecientes:  environment.apiDashboards + '/monitoreo-global/detalleAfectacion',
        obtenerEstadisticas:  environment.apiDashboards + '/monitoreo-global/encabezadoGeneral',
        obtenerMetricas:  environment.apiDashboards + '/monitoreo-global/metricas',
        obtenerHistorico:  environment.apiDashboards + '/monitoreo-global/historicoMetricas',
        alarmas: environment.apiDashboards + '/monitoreo-global/alarmas'
      },
      monitoreoMapa:{
        crearTicket: environment.apiDashboards + '/servicio-externo/agregar-ticket',
        crearTicketExterno: environment.apiDashboards + '/servicio-externo/agregar-ticket-externo',
        serviciosInalcanzables: environment.apiDashboards + '/monitoreo-mapa/serviciosInalcazables',
        afectacionesRecientes:  environment.apiDashboards + '/monitoreo-mapa/afectacionesRecientes',
      },
      monitoreoEjecutivo:{
        rendimiento: environment.apiDashboards + '/monitoreo-ejecutivo/rendimientoServicioDiario',
        afectacionesInalcanzables: environment.apiDashboards + '/monitoreo-ejecutivo/serviciosConMasAfectaciones',
        promedioDeMetricas: environment.apiDashboards + '/monitoreo-ejecutivo/promedioDeMetricas',
        promedioResolucion: environment.apiDashboards + '/monitoreo-ejecutivo/promedioResolucion'
      },
      workspace:{
        ticketsCliente: environment.apiDashboards + '/servicio-externo/ticketsCliente',
        ticketsPunta: environment.apiDashboards + '/servicio-externo/ticketsPunta',
        obtenerTickets:  environment.apiDashboards + '/espacioTrabajo-tickets',
        obtenerTicket:  environment.apiDashboards + '/espacioTrabajo-buscarPorTicket',
        busquedaPersonalizada:  environment.apiDashboards + '/espacioTrabajo-busqueda',
      },
      obtenerDashboard: environment.apiDashboards + '/recuperar-dashbords',
      personalizarDashboard: environment.apiDashboards + '/personalizar-dashbords',
      recuperarDashboardPaquete: environment.apiDashboards + '/recuperar-dashbords-paquete',
      recuperarCuadranteDashboard: environment.apiDashboards + '/recuperar-cuadrantes-dashbords',
      actualizarCuadranteDashboard: environment.apiDashboards + '/actualiza-grafica-usr',
      metricasCliente: environment.apiConfiguraciones + '/conf-metricas/filtrar-por-cliente',
      tiposDispositivos: environment.apiDashboards + '/recuperarTiposDispositivos',
      metricasVozCliente: environment.apiConfiguraciones + '/conf-metricas/filtrar-por-clienteVoz',
      monitoreoVoz:{
        llamadas: environment.apiDashboards + '/monitoreo-voz/llamadas',
        rendimiento: environment.apiDashboards + '/monitoreo-voz/rendimiento',
        voz: environment.apiDashboards + '/monitoreo-voz/voz',
        dispositivos: environment.apiDashboards + '/monitoreo-voz/dispositivos'
      },
      personalizaTicket: environment.apiDashboards + '/personaliza-ticket',

    },
    auth: {
      loginApp: environment.apiAuth + '/auth'
    }
}
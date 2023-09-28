import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-modulo-ayuda-cliente-detalle',
  templateUrl: './modulo-ayuda-cliente-detalle.component.html',
  styleUrls: ['./modulo-ayuda-cliente-detalle.component.css']
})
export class ModuloAyudaClienteDetalleComponent implements OnInit {

  moduloInformacion: number;
  moduloDetalle: number;

  informacionPantalla: any;
  detallePantalla: any;

  informacionMenu: any[] = [
    {titulo: 'Dashboards'},
    {titulo: 'Personalización de Dashboards'},
    {titulo: 'Búsqueda Avanzada de Dispositivos'},
    {titulo: 'Incidentes'},
    {titulo: 'Notificaciones'},
    {titulo: 'Equipos de trabajo'}
  ]
  informacionMenuDetalle: any[] = [
    {titulo: '¿A qué tipos de Dashboads tengo acceso?'},
    {titulo: 'Tipos de Dashboards'},
    {titulo: 'Tipos de Dispositivos'},
    {titulo: 'Especificaciones técnicas de visualización de Dashboards'},
    {titulo: 'Dashboards Modo Oscuro'},
    {titulo: 'Selección de Dashboards'},
    {titulo: 'Personalización de Gráficos'},
    {titulo: 'Fullsize'},
    {titulo: 'Filtros de búsqueda'},
    {titulo: 'Previsualizaciones '},
    {titulo: 'Accesos directos'},
    {titulo: 'Dispositivos y su Detalles de Métricas'},
    {titulo: 'Dispositivos y su Histórico'},
    {titulo: 'Tickets de incidentes'},
    {titulo: 'Visualizar notificaciones y Bandeja de entrada'},
    {titulo: 'Crear equipo (Agregar o eliminar personas)'},
    {titulo: 'Cambio de roles y permisos'},
    {titulo: 'Opciones de Monitoreo'},
    
  ]

  constructor(public router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.moduloAyudaAdminDetalle);
    let moduloSelecionado = localStorage.getItem('modulo-ayuda-informacion');
    if(moduloSelecionado != null){
      this.moduloInformacion = Number(moduloSelecionado);
    } else {
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdmin+")");
    }
    let moduloDetalleSelecionado = localStorage.getItem('modulo-ayuda-detalle');
    if(moduloDetalleSelecionado != null){
      this.moduloDetalle = Number(moduloDetalleSelecionado);
    }else{
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdminDetalle+")");
    }
    this.informacionPantalla = this.informacionMenu[this.moduloInformacion-1]
    this.detallePantalla = this.informacionMenuDetalle[this.moduloDetalle-1]
  }

  returnPage(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-informacion');
    localStorage.removeItem('modulo-ayuda-detalle');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdmin+")");
  }

  returnPageInformacion(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-detalle');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdminInformacion+")");
  }

  redireccion(pantalla, page, subpage?){

    localStorage.removeItem('navigation');
    if(pantalla == 'menu'){
      localStorage.setItem('modulo-ayuda-informacion', String(page));
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdminInformacion+")");
    }
    if(pantalla == 'submenu'){
      localStorage.setItem('modulo-ayuda-informacion', String(page));
      localStorage.setItem('modulo-ayuda-detalle', String(subpage));
      localStorage.setItem('navigation', NAV.moduloAyudaAdminDetalle);
      window.location.reload();
    }
  }

}

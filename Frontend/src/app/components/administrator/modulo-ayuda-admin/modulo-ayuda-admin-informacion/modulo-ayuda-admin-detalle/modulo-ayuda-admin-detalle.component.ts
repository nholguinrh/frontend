import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-modulo-ayuda-admin-detalle',
  templateUrl: './modulo-ayuda-admin-detalle.component.html',
  styleUrls: ['./modulo-ayuda-admin-detalle.component.css']
})
export class ModuloAyudaAdminDetalleComponent implements OnInit {

  moduloInformacion: number;
  moduloDetalle: number;

  informacionPantalla: any;
  detallePantalla: any;

  informacionMenu: any[] = [
    {titulo: 'Accesos directos'},
    {titulo: 'Alta de nuevo cliente'},
    {titulo: 'Equipos de trabajo'},
    {titulo: 'Descarga de bitácora'},
    {titulo: 'Envío de notificaciones'},
    {titulo: 'Creación y edición de paquetes'},
    {titulo: 'Plantillas de SLA'},
    {titulo: 'Detalles y edición de clientes'}    
  ]
  informacionMenuDetalle: any[] = [
    {titulo: 'Crear y configurar un nuevo cliente'},
    {titulo: 'Configuración masiva'},
    {titulo: 'Configuración de SLA y plantillas'},
    {titulo: 'Geolocalización de Sitios'},
    {titulo: 'Funcionalidad de Continuar más tarde'},
    {titulo: 'Filtros de búsqueda avanzada'},
    {titulo: 'Crear equipo (Agregar o eliminar personas)'},
    {titulo: 'Cambio de roles y permisos'},
    {titulo: 'Consulta de bitácora'},
    {titulo: 'Crear notificaciones uno a uno'},
    {titulo: 'Crear notificaciones masivas'},
    {titulo: 'Notificaciones automáticas equipo Totalplay'},
    {titulo: 'Visualizar notificaciones y Bandeja de entrada'},
    {titulo: 'Crear un nuevo paquete'},
    {titulo: 'Editar y eliminar mis paquetes'},
    {titulo: 'Crear un nueva plantilla de SLA'},
    {titulo: 'Editar y eliminar mis plantillas'},
    {titulo: 'Edita y administra un cliente'},
    {titulo: 'Edición de métricas y SLAs'},
    {titulo: 'Cambio de estatus de un Sitio'},
    {titulo: 'Eliminar un cliente'},   
  ]

  constructor(public router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.moduloAyudaAdminDetalle);
    let moduloSelecionado = localStorage.getItem('modulo-ayuda-informacion');
    if(moduloSelecionado != null){
      this.moduloInformacion = Number(moduloSelecionado);
    } else {
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdmin+")");
    }
    let moduloDetalleSelecionado = localStorage.getItem('modulo-ayuda-detalle');
    if(moduloDetalleSelecionado != null){
      this.moduloDetalle = Number(moduloDetalleSelecionado);
    }else{
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdminDetalle+")");
    }
    this.informacionPantalla = this.informacionMenu[this.moduloInformacion-1]
    this.detallePantalla = this.informacionMenuDetalle[this.moduloDetalle-1]
  }

  returnPage(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-informacion');
    localStorage.removeItem('modulo-ayuda-detalle');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdmin+")");
  }

  returnPageInformacion(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-detalle');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdminInformacion+")");
  }

  redireccion(pantalla, page, subpage?){

    localStorage.removeItem('navigation');
    if(pantalla == 'menu'){
      localStorage.setItem('modulo-ayuda-informacion', String(page));
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdminInformacion+")");
    }
    if(pantalla == 'submenu'){
      localStorage.setItem('modulo-ayuda-informacion', String(page));
      localStorage.setItem('modulo-ayuda-detalle', String(subpage));
      localStorage.setItem('navigation', NAV.moduloAyudaAdminDetalle);
      window.location.reload();
    }
  }

}

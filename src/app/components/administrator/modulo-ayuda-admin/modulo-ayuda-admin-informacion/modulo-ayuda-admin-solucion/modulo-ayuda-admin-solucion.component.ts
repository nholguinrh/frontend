import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-modulo-ayuda-admin-solucion',
  templateUrl: './modulo-ayuda-admin-solucion.component.html',
  styleUrls: ['./modulo-ayuda-admin-solucion.component.css']
})
export class ModuloAyudaAdminSolucionComponent implements OnInit {

  moduloInformacion: number;
  moduloSolucion: number;

  informacionPantalla: any;
  solucionPantalla: any;

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
  informacionMenuSolucion: any[] = [
    {titulo: 'No encuentro un cliente'},
    {titulo: 'Tengo problemas para configurar o activar dispositivos'},
    {titulo: 'Tengo problemas para configurar los SLA de un cliente'},
    {titulo: 'El cliente no ha recibido el email de invitación'},
    {titulo: 'Quiero recuperar a integrantes del equipo '},
    {titulo: 'Mi equipo no ha recibido la invitación para colaborar'},
    {titulo: 'No encuentro datos en la consulta'},
    {titulo: 'La notificación no fue recibida por el cliente'},
    {titulo: 'No puedo visualizar la notificación'},
    {titulo: '¿Puedo tener un cliente sin un paquete asociado?'},
    {titulo: 'Mis clientes se quedaron sin configuración de SLA'},
    {titulo: 'No encuentro un cliente'},
    {titulo: 'Tengo problemas para configurar o activar dispositivos'},
    {titulo: 'Tengo problemas para configurar los SLA de un cliente'},
    {titulo: 'No se han guardado las configuraciones de un cliente'},
    
  ]

  constructor(public router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.moduloAyudaAdminSolucion);
    let moduloSelecionado = localStorage.getItem('modulo-ayuda-informacion');
    if(moduloSelecionado != null){
      this.moduloInformacion = Number(moduloSelecionado);
    } else {
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdmin+")");
    }
    let moduloSolucionSelecionado = localStorage.getItem('modulo-ayuda-solucion');
    if(moduloSolucionSelecionado != null){
      this.moduloSolucion = Number(moduloSolucionSelecionado);
    }else{
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdminSolucion+")");
    }
    this.informacionPantalla = this.informacionMenu[this.moduloInformacion-1]
    this.solucionPantalla = this.informacionMenuSolucion[this.moduloSolucion-1]
  }

  returnPage(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-informacion');
    localStorage.removeItem('modulo-ayuda-solucion');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdmin+")");
  }

  returnPageInformacion(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-solucion');
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

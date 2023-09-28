import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-modulo-ayuda-cliente-informacion',
  templateUrl: './modulo-ayuda-cliente-informacion.component.html',
  styleUrls: ['./modulo-ayuda-cliente-informacion.component.css']
})
export class ModuloAyudaClienteInformacionComponent implements OnInit {

  moduloInformacion: number;
  informacionPantalla: any;
  informacionMenu: any[] = [
    {
      titulo: 'Dashboards',
      descripcion: 'Incluye la información general de todos los tipos de Dashboard y sus distintas funcionalidades',
      icono: 'img-modulo-dashboards',
    },{
      titulo: 'Personalización de Dashboards',
      descripcion: 'Incluye cómo cambiar el aspecto y los diferentes Dashboards',
      icono: 'img-modulo-personalizacion',
    },{
      titulo: 'Búsqueda Avanzada de Dispositivos',
      descripcion: 'Incluye cómo realizar búsquedas personalizadas de tus dispositivos',
      icono: 'img-modulo-busqueda',
    },{
      titulo: 'Incidentes',
      descripcion: 'Incluye temas como crear, editar y visualizar tickets de incidentes asociados a tus dispositivos',
      icono: 'img-modulo-incidentes',
    },{
      titulo: 'Notificaciones',
      descripcion: 'Incluye cómo visualizar y eliminar notificaciones dentro del SMC',
      icono: 'img-modulo-notificaciones',
    },{
      titulo: 'Equipos de trabajo',
      descripcion: 'Incluye cómo crear, administrar y eliminar equipos de trabajo, así como la asignación de permisos dentro de la plataforma',
      icono: 'img-modulo-equipos',
    }   
  ]

  constructor(public router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.moduloAyudaAdminInformacion);
    let moduloSelecionado = localStorage.getItem('modulo-ayuda-informacion');
    if(moduloSelecionado != null){
      this.moduloInformacion = Number(moduloSelecionado);
    }

    this.informacionPantalla = this.informacionMenu[this.moduloInformacion-1]
  }

  returnPage(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-informacion');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdmin+")");
  }

  moduloDetalle(page: number){
    localStorage.removeItem('navigation');
    localStorage.setItem('modulo-ayuda-detalle', String(page));
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdminDetalle+")");
  }

  moduloSolucion(page: number){
    localStorage.removeItem('navigation');
    localStorage.setItem('modulo-ayuda-solucion', String(page));
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdminSolucion+")");
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-modulo-ayuda-cliente',
  templateUrl: './modulo-ayuda-cliente.component.html',
  styleUrls: ['./modulo-ayuda-cliente.component.css']
})
export class ModuloAyudaClienteComponent implements OnInit {

  listadoAccesos: any[] = [
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
    localStorage.setItem('navigation', NAV.moduloAyudaAdmin);
  }

  moduloInformacion(page: number){
    localStorage.removeItem('navigation');
    localStorage.setItem('modulo-ayuda-informacion', String(page));
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdminInformacion+")");
  }

}

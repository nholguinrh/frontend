import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-modulo-ayuda-admin',
  templateUrl: './modulo-ayuda-admin.component.html',
  styleUrls: ['./modulo-ayuda-admin.component.css']
})
export class ModuloAyudaAdminComponent implements OnInit {

  listadoAccesos: any[] = [
    {
      titulo: 'Accesos directos',
      descripcion: 'Incluye cómo cambiar tus accesos directos dentro del menú inicial',
      icono: 'img-modulo-accesos',
    },{
      titulo: 'Alta de nuevo cliente ',
      descripcion: 'Incluye cómo crear un nuevo cliente, activar sus dispositivos y configurarles un SLA para que inicie su proceso de registro',
      icono: 'img-modulo-alta',
    },{
      titulo: 'Equipos de trabajo',
      descripcion: 'Incluye cómo crear, administrar y eliminar equipos de trabajo, así como la asignación de permisos dentro de la plataforma',
      icono: 'img-modulo-equipo',
    },{
      titulo: 'Descarga de bitácora',
      descripcion: 'Incluye cómo seleccionar rangos de fecha y  descargar la bitácora de actividades',
      icono: 'img-modulo-descarga',
    },{
      titulo: 'Envío de notificaciones',
      descripcion: 'Incluye cómo crear y enviar notificaciones a uno o varios clientes del SMC',
      icono: 'img-modulo-envio',
    },{
      titulo: 'Creación y edición de paquetes',
      descripcion: 'Incluye temas como crear, editar y eliminar paquetes asociados a la configuración de los clientes',
      icono: 'img-modulo-creacion',
    },{
      titulo: 'Plantillas de SLA',
      descripcion: 'Incluye temas como crear, editar y eliminar una plantilla de SLA',
      icono: 'img-modulo-plantillas',
    },{
      titulo: 'Detalles y edición de clientes',
      descripcion: 'Incluye cómo editar la información, configuración y cómo administrar clientes dentro del SMC',
      icono: 'img-modulo-detalles',
    }    
  ]

  constructor(public router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.moduloAyudaAdmin);
  }

  moduloInformacion(page: number){
    localStorage.removeItem('navigation');
    localStorage.setItem('modulo-ayuda-informacion', String(page));
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdminInformacion+")");
  }

}

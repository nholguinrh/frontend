import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-modulo-ayuda-admin-informacion',
  templateUrl: './modulo-ayuda-admin-informacion.component.html',
  styleUrls: ['./modulo-ayuda-admin-informacion.component.css']
})
export class ModuloAyudaAdminInformacionComponent implements OnInit {

  moduloInformacion: number;
  informacionPantalla: any;
  informacionMenu: any[] = [
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
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdmin+")");
  }

  moduloDetalle(page: number){
    localStorage.removeItem('navigation');
    localStorage.setItem('modulo-ayuda-detalle', String(page));
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdminDetalle+")");
  }

  moduloSolucion(page: number){
    localStorage.removeItem('navigation');
    localStorage.setItem('modulo-ayuda-solucion', String(page));
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdminSolucion+")");
  }


}

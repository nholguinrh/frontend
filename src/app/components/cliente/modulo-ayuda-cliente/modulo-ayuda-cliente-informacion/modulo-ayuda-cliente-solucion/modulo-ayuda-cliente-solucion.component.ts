import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';

@Component({
  selector: 'app-modulo-ayuda-cliente-solucion',
  templateUrl: './modulo-ayuda-cliente-solucion.component.html',
  styleUrls: ['./modulo-ayuda-cliente-solucion.component.css']
})
export class ModuloAyudaClienteSolucionComponent implements OnInit {

  moduloInformacion: number;
  moduloSolucion: number;

  informacionPantalla: any;
  solucionPantalla: any;

  informacionMenu: any[] = [
    {titulo: 'Dashboards'},
    {titulo: 'Personalización de Dashboards'},
    {titulo: 'Búsqueda Avanzada de Dispositivos'},
    {titulo: 'Incidentes'},
    {titulo: 'Notificaciones'},
    {titulo: 'Equipos de trabajo'}
  ]
  informacionMenuSolucion: any[] = [
    {titulo: 'No puedo visualizar información en mi Dashboard'},
    {titulo: 'Tengo problemas para visualizar mis métricas'},
    {titulo: 'No puedo visualizar todos los tipos de Dashboard'},
    {titulo: 'No encuentro resultados en mi búsqueda '},
    {titulo: 'No puedo visualizar mis tickets de incidentes'},
    {titulo: 'No puedo recibir notificaciones'},
    {titulo: 'No puedo visualizar una notificación '},
    {titulo: 'Quiero incrementar mi número de integrantes'},
    {titulo: 'Quiero recuperar integrantes del equipo'},
    {titulo: 'Mi equipo no ha recibido invitación para colaborar'},
  ]

  emailstring= "mailto:helpdesk@totalplay.com?Subject=Soporte SMC&body=Buen día, estoy buscando ayuda…(déjanos saber en que podemos ayudarte)";

  constructor(public router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.moduloAyudaAdminSolucion);
    let moduloSelecionado = localStorage.getItem('modulo-ayuda-informacion');
    if(moduloSelecionado != null){
      this.moduloInformacion = Number(moduloSelecionado);
    } else {
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdmin+")");
    }
    let moduloSolucionSelecionado = localStorage.getItem('modulo-ayuda-solucion');
    if(moduloSolucionSelecionado != null){
      this.moduloSolucion = Number(moduloSolucionSelecionado);
    }else{
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdminSolucion+")");
    }
    this.informacionPantalla = this.informacionMenu[this.moduloInformacion-1]
    this.solucionPantalla = this.informacionMenuSolucion[this.moduloSolucion-1]
  }

  returnPage(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-informacion');
    localStorage.removeItem('modulo-ayuda-solucion');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdmin+")");
  }

  returnPageInformacion(){
    localStorage.removeItem('navigation');
    localStorage.removeItem('modulo-ayuda-solucion');
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
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdminDetalle+")");
      //window.location.reload();
    }
    if(pantalla == 'ayuda'){
      window.location.href = this.emailstring;
    }
  }

}

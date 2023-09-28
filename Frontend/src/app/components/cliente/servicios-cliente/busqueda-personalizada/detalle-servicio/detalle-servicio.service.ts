import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class DetalleServicioService {
    private dialogConfig = new MatDialogConfig();
    private metrica = [
      {
          idMetrica: 1,
          dispositivo: 'sitio',
          alias: 'Anillo Perif. 2767',
          nombreSitio:'CSP10901410-SSA - CENATRA - Periférico',
          tipo: 'servicio de WIFI',
          ipDispositivo: '48575443A82FF93A',
          ip: '48575443A82FF93A',
          dark: false,
          showCancelMessage: false
      },
      {
          idMetrica: 2,
          dispositivo: 'sitio',
          alias: 'Av. Marina Nacional #60',
          nombreSitio:'CSP10901417-Sécretaria de Salud SSA Marina',
          tipo: 'servicio de WIFI',
          ipDispositivo: '485754436774519A',
          ip: '0.113.985',
          dark: false,
          showCancelMessage: false
      },
      {
          idMetrica: 3,
          dispositivo: 'sitio',
          alias: 'Oklahoma # 14',
          nombreSitio:'CSP10901423-SSA - COFEPRIS - Oklahoma',
          tipo: 'servicio de WIFI',
          ipDispositivo: '485754439561B8A5',
          ip: '485754439561B8A5',
          dark: false,
          showCancelMessage: false
      },
      {
          idMetrica: 4,
          dispositivo: 'sitio',
          alias: 'Av. Othón de Mendizábal #195',
          nombreSitio:'CSP10901429-SSA - CNTS - Othon de Mendizabal',
          tipo: 'servicio de WIFI',
          ipDispositivo: '48575443A377F79C',
          ip: '0.113.985',
          dark: false,
          showCancelMessage: false
      },
      {
          idMetrica: 5,
          dispositivo: 'sitio',
          alias: 'Periférico Sur 2905',
          nombreSitio:'CSP10901438-SSA - CISAME - Periférico Sur 2905',
          tipo: 'servicio de WIFI',
          ipDispositivo: '485754430EF6F69C',
          ip: '0.113.985',
          dark: false,
          showCancelMessage: false
      }]

    detalle(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "Hola",
        }
        return this.dialogConfig;
    }

  metricaSitio(darkBackground?: boolean){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.data = {
        dispositivo: 'sitio',
        alias: 'Gran Patio Pachuca',
        tipo: 'CPE',
        ipDispositivo: '1209-AB780-13P',
        ip: '192.168.1.0.15',
        dark: darkBackground,
        showCancelMessage: false
    }
    return this.dialogConfig;
  }

  metricaServicio(darkBackground?: boolean){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;

    this.dialogConfig.data = {
        dispositivo: 'servicio',
        alias: 'Sala de juntas Santa Fé',
        tipo: 'servicio de WIFI',
        ipDispositivo: '10.113.9855.0001.32',
        ip: '0.113.985',
        dark: darkBackground,
        showCancelMessage: false
    }
    return this.dialogConfig;
  }

  metricaEnlace(darkBackground?: boolean){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.data = {
        dispositivo: 'enlace',
        alias: 'México - Morelos',
        tipo: 'Interface',
        ipDispositivo: '10.113.9855.0001.32',
        ip: '192.168.1.0.15',
        dark: darkBackground,
        showCancelMessage: false
    }
    /* this.dialogConfig.backdropClass = "backdropBackground" */
    return this.dialogConfig;
  }
  

  metricaSucursal(){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.data = {
        title: "Selecciona una métrica",
        servicio: false,
        alias: 'Sala de juntas Santa Fé',
        dark: false,
        lista: [{
            name: 'Disponibilidad',
            id: 1
          },{
            name: 'Alcanzabilidad',
            id: 2
          },{
            name: 'Perdida de paquetes',
            id: 3
          },{
            name: 'Latencia',
            id: 4
          },{
            name: 'Consumo',
            id: 5
          }],
        showCancelMessage: false
    }
    /* this.dialogConfig.backdropClass = "backdropBackground" */
    return this.dialogConfig;
  }

  metricaSucursalDark(){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.data = {
        title: "Selecciona una métrica",
        servicio: false,
        alias: 'Sala de juntas Santa Fé',
        dark: true,
        lista: [{
            name: 'Disponibilidad',
            id: 1
          },{
            name: 'Alcanzabilidad',
            id: 2
          },{
            name: 'Perdida de paquetes',
            id: 3
          },{
            name: 'Latencia',
            id: 4
          },{
            name: 'Consumo',
            id: 5
          }],
        showCancelMessage: false
    }
    /* this.dialogConfig.backdropClass = "backdropBackground" */
    return this.dialogConfig;
  }
  metricaServicioDark(){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.data = {
        title: "Selecciona una métrica",
        servicio: true,
        alias: 'Gran Patio Pachuca',
        dark: true,
        lista: [{
            name: 'Disponibilidad',
            id: 1
          },{
            name: 'Alcanzabilidad',
            id: 2
          },{
            name: 'Perdida de paquetes',
            id: 3
          },{
            name: 'Latencia',
            id: 4
          },{
            name: 'Consumo',
            id: 5
          }],
        showCancelMessage: false
    }
    /* this.dialogConfig.backdropClass = "backdropBackground" */
    return this.dialogConfig;
  }

  metricaDummy(id?:number){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.metrica.forEach( ele => {
      if(id == ele.idMetrica){
        this.dialogConfig.data = ele;
      }
    });
    return this.dialogConfig;
  }

  detalleDispositivo(darkBackground?: boolean, data?: any){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.data = {
        dispositivo: data,
        dark: darkBackground,
        showCancelMessage: false
    }
    /* this.dialogConfig.backdropClass = "backdropBackground" */
    return this.dialogConfig;
  }

  detalleDispositivoModal(darkBackground?: boolean, ipNs?: any, idDispositivo?: any){
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.data = {
        dispositivo: {},
        idDispositivo: idDispositivo,
        ipNs: ipNs,
        dark: darkBackground,
        showCancelMessage: false
    }
    /* this.dialogConfig.backdropClass = "backdropBackground" */
    return this.dialogConfig;
  }

  public get width() {
    console.log("width:",window.innerWidth);
    return window.innerWidth;
  }

}

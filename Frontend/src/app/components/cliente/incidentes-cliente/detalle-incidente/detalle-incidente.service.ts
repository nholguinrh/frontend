import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class DetalleIncidenteService {
    private dialogConfig = new MatDialogConfig();
    private metrica = [
        {
            idMetrica: 1,
            dispositivo: 'sitio',
            alias: 'Anillo Perif. 2767',
            nombreSitio:'CSP10901410-SSA - CENATRA - Periférico',
        },
        {
            idMetrica: 2,
            dispositivo: 'sitio',
            alias: 'Av. Marina Nacional #60',
            nombreSitio:'CSP10901417-Sécretaria de Salud SSA Marina',
        },
        {
            idMetrica: 3,
            dispositivo: 'sitio',
            alias: 'Oklahoma # 14',
            nombreSitio:'CSP10901423-SSA - COFEPRIS - Oklahoma',
        },
        {
            idMetrica: 4,
            dispositivo: 'sitio',
            alias: 'Av. Othón de Mendizábal #195',
            nombreSitio:'CSP10901429-SSA - CNTS - Othon de Mendizabal',
        },
        {
            idMetrica: 5,
            dispositivo: 'sitio',
            alias: 'Periférico Sur 2905',
            nombreSitio:'CSP10901438-SSA - CISAME - Periférico Sur 2905',
        }]

    detalle(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "Hola",
            dispositivoNombre: 'ejemplo'
        }
        return this.dialogConfig;
    }

    detalleDummy(){
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        let id = 1
        this.metrica.forEach( ele => {
          if(id == ele.idMetrica){
            this.dialogConfig.data = ele;
          }
        });
        return this.dialogConfig;
      }
      

    detalleSitio(dispositivo: string): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            sitio: "Hola",
            dispositivoNombre: dispositivo
        }
        return this.dialogConfig;
    }

    detalleTicket(ticket: any, dispositivoNombre: any): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            ticket: ticket,
            dispositivoNombre: dispositivoNombre
        }
        return this.dialogConfig;
    }

}

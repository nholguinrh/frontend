import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { Estatus, Paquete, PlantillaSLA } from 'src/app/shared/model/cliente.model';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-administrator-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit {

  mensajeAlerta: string;
  paquetes: Paquete[];
  plantillasSla: any[];
  public form: FormGroup;
  isBackOffice:  boolean = false;
  mostrarDataPlantillas: boolean = true;

  constructor(public spinner: NgxSpinnerService,
    public router: Router,
    private dialog: MatDialog,
    private dialogService: ConfirmDialogService,
    private administratorService: AdministratorService,
    private formBuilder: FormBuilder,
    private workspaceService: WorkspaceService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadPlantillas();
    this.cargaDeDatos();
    this.form = this.formBuilder.group({      
      busqueda: ['']
    });

    let perfil = this.administratorService.getPerfi();
    if(perfil?.descripcion == 'Back Office'){
      this.isBackOffice = true;
    }
  }

  agregarPaquete(event?: any){
    if(event){
      event.stopPropagation();
    }
    localStorage.removeItem('paquete');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.configuracionPaquete+")");
  }
  detallePaquete(id: any){
    localStorage.setItem('paquete', id.toString());
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.configuracionPaquete+")");
  }

  agregarPlantilla(event?: any){
    if(event){
      event.stopPropagation();
    }
    localStorage.removeItem('plantilla');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.configuracionPlantillaSla+")");
  }
  detallePlantilla(id: any){
    localStorage.setItem('plantilla', id.toString());
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.configuracionPlantillaSla+")");
  }

  eliminarPlantilla(sla: any){
    this.spinner.show();
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.dialogService.eliminarPlantilla()
    );
    dialogRef.afterClosed().subscribe(
      _data => {
        if(_data == true){
          this.spinner.show();
          const idUsuario = this.administratorService.getIdUsuarios();
          let estatus = new Estatus();
          estatus.idCatEstatus = 17;
          sla.configuracionSLA.tbCatEstatus = estatus;
          this.administratorService.actualizacionSLA(idUsuario, sla).subscribe({
            next: ({data, httpStatus, message}) => {
              if (httpStatus === 200) {
                this.registrarBitacora(sla.configuracionSLA.idConfiguracionSLA)
                this.loadPlantillas();
                this.spinner.hide();
                this.alertService.info('<b>SLA eliminado correctamente</b>');
              } else if (httpStatus === 201) {
                this.alertService.error('Para eliminar la configuración de SLA debes asegurarte que no tenga clientes asociados');
                this.spinner.hide();
              }
            },
            error: (_) => {
              this.spinner.hide();
              this.alertService.error('Error al eliminar plantilla');
            }
          });
        }
      }
    );
    this.spinner.hide();
  }

  inputClick(event?: any){
    if(event){
      event.stopPropagation();
    }
  }

  loadPlantillas(){
    this.spinner.show();
    this.plantillasSla = [];
    this.mostrarDataPlantillas = true;
    this.administratorService.catalogoPlantillasSLA().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.spinner.hide();
          this.plantillasSla = data;
        }
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('Error al obtener la información de la plantilla');
        this.openDialog();
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: 0},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((_) => {
    });
  }

  arregloMetricas(metricas: any) {
    let _metricas = []
    metricas.forEach(element => {
      if(element.tbMetrica.metrica != 'Alcanzabilidad'){
        _metricas.push(element);
      }
    });
    return _metricas;
  }

  cargaDeDatos(){
    this.spinner.show();
    this.administratorService.catalogoPaquetesActivos().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.paquetes = data;
          this.spinner.hide();
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.alertService.error('No se pudo obtener la información de los paquetes');
      }
    });
  }

  buscarSLATexto(){
    this.spinner.show();
    this.mostrarDataPlantillas = true;
    let body = {
      cadena: this.form.controls['busqueda'].value
    }
    if(this.form.controls['busqueda'].value != null && this.form.controls['busqueda'].value != ''){
      this.workspaceService.consultarConfiguracionesSLAPorTexto(body).subscribe({
        next: ({ data, httpStatus }) => {
          if (httpStatus === 200) {
            this.plantillasSla = [];
            if(data.length == 0){
              this.alertService.info('No se encontraron resultados para la busqueda');
              this.spinner.hide();
              this.mostrarDataPlantillas = false;
            }else{
              this.plantillasSla = data;
              this.spinner.hide();
            }
          }
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
          this.openDialog();
        }
      });
    }else{
      this.loadPlantillas()
    }
  }

  ultimosClientes(clientes: any){
    let textoClientes = '' 
    let index = 0
    clientes.forEach((elem, index) => {
      if(index == 0){
        textoClientes = elem.nombreCliente + ' - ' + elem.puntasConfiguradas + ' sitios'  
      }else{
        textoClientes = textoClientes + ', ' + elem.nombreCliente + ' - ' + elem.puntasConfiguradas + ' sitios' 
      }
    });

    return textoClientes
  }

  registrarBitacora(idSLA?: number){
    let body = {
      "funcionalidad": 'Eliminar paquete',
      "tipoOperacion": 'Baja',
      "datos": "El usuario "+ this.administratorService.getIdUsuarios() + " elimino la plantilla " + idSLA,
      "creadoPor": {
        "idUsuario": this.administratorService.getIdUsuarios()
      }
    }
    this.workspaceService.registrarBitacora(body).subscribe({
      next: ({httpStatus, message}) => {
      },
      error: (_) => {
        console.log('No se registro en bitacora');
      }
    });
  }

  returnFilter(){
    this.form.reset();
    this.loadPlantillas();
  }
}

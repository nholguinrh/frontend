import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-plantilla-sla',
  templateUrl: './plantilla-sla.component.html',
  styleUrls: ['./plantilla-sla.component.css']
})
export class PlantillaSlaComponent implements OnInit {

  tituloPlantilla: string = 'NUEVA PLANTILLA SLA';
  subtituloPlantilla: string = 'DETALLES DE LA PLANTILLA';
  form: FormGroup;
  data: any;
  mensajeAlerta: string;
  plantillaSeleccionada: number;
  idPlantilla: number;

  constructor(private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService, 
    private router: Router,
    private dialog: MatDialog,
    private dialogService: ConfirmDialogService,
    private administratorService: AdministratorService,
    private workspaceService: WorkspaceService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.configuracionPlantillaSla);
    this.createForm();
    let plantillaSeleccionada = localStorage.getItem('plantilla');
    if(plantillaSeleccionada != null){
      this.tituloPlantilla = 'DETALLE DE LA PLANTILLA';
      this.detallePlantilla(Number(plantillaSeleccionada));
    }
    console.log(0 == null)
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
        tituloSLA : ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        basicasAlcanzabilidad: [null, [Validators.minLength(1)]],
        basicasDisponibilidad: [null, [Validators.minLength(1)]],
        basicasLatencia: [null, [Validators.minLength(1)]],
        basicasBanda: [null, [Validators.minLength(1)]],
        basicasPaquetes: [null, [Validators.minLength(1)]],
        valorMetricas: [null, [Validators.required]],
      }
    );
  }

  goBack(){
    let home = localStorage.getItem('back-return')
    if(home === 'home'){
      localStorage.setItem('menu', '1');
      localStorage.removeItem('back-return');
      localStorage.removeItem('navigation');
      this.router.navigateByUrl(NAV.administrator);
    }else{
      if(localStorage.getItem('plantilla') != null){
        this.registrarBitacora(3, this.idPlantilla)
      }
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
    }
  }

  altaPlantilla(){
    let body = {
      configuracionSLA: {
        tituloSLA: this.form.get('tituloSLA').value, 
        descripcion: this.form.get('descripcion').value,
        indicaPlantilla: 1
      },
      metricasSLA:[
        {
          tbMetrica: {
            idMetrica: 1, 
          },
          valor: this.form.get('basicasAlcanzabilidad').value
        },
        {
          tbMetrica: {
            idMetrica: 2, 
          },
          valor: this.form.get('basicasDisponibilidad').value
        },
        {
          tbMetrica: {
            idMetrica: 3, 
          },
          valor: this.form.get('basicasLatencia').value
        },
        {
          tbMetrica: {
            idMetrica: 4, 
          },
          valor: this.form.get('basicasBanda').value
        },
        {
          tbMetrica: {
            idMetrica: 5, 
          },
          valor: this.form.get('basicasPaquetes').value
        }]
      }

      let metricasValidadas = false;
      body.metricasSLA.forEach(ele => {
        if(ele.valor != null && ele.valor != ''){
          metricasValidadas = true;
          return metricasValidadas;
        }
      });

      if(metricasValidadas){
        const idUsuario = this.administratorService.getIdUsuarios();
        this.spinner.show();
        this.administratorService.configureSLA(idUsuario, body).subscribe({
          next: ({data, httpStatus, message}) => {
            if (httpStatus === 200) {
              this.registrarBitacora(1, data.idConfiguracionSLA)
              this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
              this.spinner.hide();
            } else {
              this.spinner.hide();
              this.alertService.error('Error al crear plantilla');
            }
          },
          error: (e) => {
            this.spinner.hide();
            console.log(e);
            this.alertService.error('Error al crear plantilla');
          }
        });
      }else{
        this.spinner.hide();
        this.alertService.error("¡Debes agregar por lo menos una metrica a la configuración!");
      }
    
      
  }

  editarPlantilla(){
    this.data.configuracionSLA.idConfiguracionSLA = this.idPlantilla;
    this.data.configuracionSLA.tituloSLA = this.form.get('tituloSLA').value;
    this.data.configuracionSLA.descripcion = this.form.get('descripcion').value;
    this.data.configuracionSLA.indicaPlantilla = 1;
    this.data.metricasSLA[0].valor = this.form.get('basicasAlcanzabilidad').value;
    this.data.metricasSLA[1].valor = this.form.get('basicasDisponibilidad').value;
    this.data.metricasSLA[2].valor = this.form.get('basicasLatencia').value;
    this.data.metricasSLA[3].valor = this.form.get('basicasBanda').value;
    this.data.metricasSLA[4].valor = this.form.get('basicasPaquetes').value;
    const idUsuario = this.administratorService.getIdUsuarios();
    this.spinner.show();
    this.administratorService.actualizacionSLA(idUsuario, this.data).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.registrarBitacora(2, data?.idConfiguracionSLA)
          localStorage.removeItem('plantilla');
          this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.alertService.error('Error al modificar plantilla');
        }
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('Error al modificar plantilla');
      }
    });
  }

  validarPlantilla(operacion: string){
    let valorMetrica = false;
    let valorMetricaResulto = true;
    
    [this.form.controls['basicasAlcanzabilidad'],this.form.controls['basicasDisponibilidad'],this.form.controls['basicasLatencia'],this.form.controls['basicasBanda'],this.form.controls['basicasPaquetes']].forEach((element, i) => {
      if(String(element.value) == 'null' || String(element.value) == ''){
      }else{
        if(element.value > 0){
          console.log('true')
          console.log(element.value)
          valorMetrica = true;
          if(i == 0 || i == 1 || i == 4){
            if(!(element.value <= 100)){
              valorMetricaResulto = false
              element?.setErrors({ incorrect: true });
            }
          }
        }else{
          element?.setErrors({ incorrect: true });
        }
      }
    });

    if(!valorMetricaResulto){ valorMetrica = false }
    if(valorMetrica == false){
      this.alertService.error("¡Debes agregar por lo menos una metrica a la configuración!");
      this.form.get('valorMetricas').setValue(null);
    }else{
      this.form.get('valorMetricas').setValue(1);
    }
    console.log()
    if(this.form.invalid){
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        if (control.valid == false) {
            control.markAsTouched({ onlySelf: true });
        }
      });
    }
    if(this.form.valid){
      let body = {
        tituloSLA: this.form.controls['tituloSLA'].value
      }
      this.administratorService.validarSLAPost(body).subscribe({
        next: ({data, httpStatus, message}) => {
          if(data === "TituloSLA Valido"){
            switch(operacion){
              case 'crear':
                this.altaPlantilla()
                break;
              case 'editar':
                this.editarPlantilla()
                break;
            }
          }
          if(data === "TituloSLA ya registrado"){
            if(this.subtituloPlantilla == this.form.controls['tituloSLA'].value){
              this.editarPlantilla()
            }else{
              this.form.get('tituloSLA')?.setErrors({ incorrect: true });
              this.getError('tituloSLA');
              this.spinner.hide();
            }
          }
        },
        error: (_) => {
          this.spinner.hide();
          this.alertService.error('Error al validar plantilla');
        }
      });
    }
  }

  public onlyNumbers(event) {
    let k;
    k = event.charCode;
    return (!(k > 31 && (k < 48 || k > 57)));
  }

  public keyShowAutocomplete(form: string, event: any) {
    if(event.target.value > 0 || event.target.value == ''){
    }else{
      if(Number(event.target.value) == 0){
        this.form.get(form)?.setErrors({ incorrect: true });
      }else{
        this.form.get(form)?.setErrors({ incorrectText: true });
      }
    }
  }

  detallePlantilla(id: number){
    this.administratorService.detalleSLA(id).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.data = data;
          this.idPlantilla = data.configuracionSLA.idConfiguracionSLA;
          this.subtituloPlantilla = data.configuracionSLA.tituloSLA;
          this.form.get('tituloSLA').setValue(data.configuracionSLA.tituloSLA);
          this.form.get('descripcion').setValue(data.configuracionSLA.descripcion);
          this.form.get('basicasAlcanzabilidad').setValue(data.metricasSLA[0].valor);
          this.form.get('basicasDisponibilidad').setValue(data.metricasSLA[1].valor);
          this.form.get('basicasLatencia').setValue(data.metricasSLA[2].valor);
          this.form.get('basicasBanda').setValue(data.metricasSLA[3].valor);
          this.form.get('basicasPaquetes').setValue(data.metricasSLA[4].valor);
        }
      },
      error: (_) => {
        this.alertService.error('Error al obtener la información de la plantilla');
      }
    });

  }


  getError(value: string){
    if (value == 'tituloSLA') {
      return this.form.get('tituloSLA').errors?.required
      ? 'Este campo es requerido'
      : this.form.get('tituloSLA').hasError('incorrect')
      ? 'El titulo de la plantilla ya existe'
      : ''
    } else if (value == 'basicasAlcanzabilidad') {
      return this.form.get('basicasAlcanzabilidad').hasError('required')
      ? 'Debes llenar al menos una metrica'
      :  ''
    }
  }

  registrarBitacora(flujo?: number, idSLA?: number){
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    if(flujo == 1){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", acaba de agregar la nueva plantilla SLA: " + idSLA;
      funcionalidad = 'Agregar una nueva plantilla'
      tipoOperacion = 'Alta'
    }else if(flujo == 2){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", guardo nuevos cambios a la plantilla: " + idSLA;
      funcionalidad = 'Guardar cambios de la plantilla'
      tipoOperacion = 'Cambios'
    }else if(flujo == 3){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", cancelo los cambios de la plantilla: " + idSLA;
      funcionalidad = 'Cancelar cambios de la plantilla'
      tipoOperacion = 'Cancelar'
    }else{
      return
    }
    let body = {
      "funcionalidad": funcionalidad,
      "tipoOperacion": tipoOperacion,
      "datos": comentario,
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


}

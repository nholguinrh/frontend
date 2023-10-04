import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-descarga-actividades',
  templateUrl: './descarga-actividades.component.html',
  styleUrls: ['./descarga-actividades.component.css'],
})
export class DescargaActividadesComponent implements OnInit {
  public form: FormGroup;
  fecha = new Date();
  fechaActual = new Date(
    this.fecha.getFullYear(),
    this.fecha.getMonth(),
    this.fecha.getDate()
  );
  fecInicio = new Date();
  fecFin = new Date();
  validDateError: boolean;
  constructor(
    public spinner: NgxSpinnerService,
    private alertService: AlertService,
    public router: Router,
    private administratorService: AdministratorService,
    public workspaceService: WorkspaceService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.descargaActividades);
    this.form = this.formBuilder.group({
      inicial: ['', [Validators.required]],
      final: ['', [Validators.required]],
    });
  }

  goToEquipos() {
    let home = localStorage.getItem('back-return');
    if (home === 'home') {
      localStorage.setItem('menu', '1');
      localStorage.removeItem('back-return');
      localStorage.removeItem('navigation');
      this.router.navigateByUrl(NAV.administrator);
    } else {
      this.router.navigateByUrl(
        NAV.administrator +
          '/(' +
          'home' +
          ':' +
          NAV.administratorWorspace +
          ')'
      );
    }
  }

  sendAlert() {
    if (!this.validDateError) {
      if (!this.form.invalid) {
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
          this.form.reset();
          this.form.get('inicial').clearValidators();
          this.form.get('final').clearValidators();
          this.form.get('inicial').updateValueAndValidity();
          this.form.get('final').updateValueAndValidity();
          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.openFile();
        }, 500);
      }
    }
  }

  requiredTrue() {
    this.form.get('inicial').setValidators([Validators.required]);
    this.form.get('final').setValidators([Validators.required]);
    this.form.get('inicial').updateValueAndValidity();
    this.form.get('final').updateValueAndValidity();
  }

  validDate() {
    this.fecFin = new Date(this.form.get('final').value);
    let fechaFin = String(
      this.fecFin.getMonth() +
        1 +
        '/' +
        this.fecFin.getDate() +
        '/' +
        this.fecFin.getFullYear()
    );
    this.fecFin = new Date(fechaFin);
    this.fecInicio = new Date(this.form.get('inicial').value);
    let fechaInicio = String(
      this.fecInicio.getMonth() +
        1 +
        '/' +
        this.fecInicio.getDate() +
        '/' +
        this.fecInicio.getFullYear()
    );
    this.fecInicio = new Date(fechaInicio);
    if (this.fecInicio > this.fecFin) {
      this.validDateError = true;
    } else {
      this.validDateError = false;
    }
  }

  openFile(): void {
    let body = {
      /* fechaInicio: this.fecInicio.getFullYear() + '-' + (this.fecInicio.getMonth() + 1) + '-' + this.fecInicio.getDate() +' 00:00:00',
      fechaFin: this.fecFin.getFullYear() + '-' + (this.fecFin.getMonth() + 1) + '-' + this.fecFin.getDate() +' 00:00:00', */
      fechaInicio: moment(this.fecInicio).set({'hour': 0}).format('YYYY-MM-DD HH:mm:ss'),
      fechaFin: moment(this.fecFin).set({'hour': 0}).format('YYYY-MM-DD HH:mm:ss')
    };
    this.workspaceService.obtenerBitacora(body).subscribe({
      next: (response) => {

        if(response.type != 'application/json'){
          const timeStamp = moment().format('YYYYMMDDHHmmss');
          const linkDescarga = document.createElement('a');
          const url = window.URL.createObjectURL(response);
          document.body.appendChild(linkDescarga);
          linkDescarga.setAttribute('style', 'display: none');
          linkDescarga.href = url;
          linkDescarga.download = 'Bitácora' + timeStamp;
          linkDescarga.click();
          window.URL.revokeObjectURL(url);
          linkDescarga.remove();
          this.alertService.info('<b>!Descarga realizada correctamente! </b>');
        }else{
          this.alertService.error('No hay informacion para poder descargar la bitacora en las fechas señaladas')
        }
      },
      error: (_) => {
        console.log('No se pudo descargar la  bitacora');
      },
    });
  }

  registrarBitacora() {
    let body = {
      funcionalidad: 'Descarga de bitácora',
      tipoOperacion: 'Descarga',
      datos:
        'El usuario: ' +
        this.administratorService.getIdUsuarios() +
        ', descargo un historico de la bitácora',
      creadoPor: {
        idUsuario: this.administratorService.getIdUsuarios(),
      },
    };

    this.workspaceService.registrarBitacora(body).subscribe({
      next: ({ httpStatus, message }) => {},
      error: (_) => {
        console.log('No se registro en bitacora');
      },
    });
  }
}

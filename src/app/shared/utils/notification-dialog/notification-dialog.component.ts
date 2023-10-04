import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationModel } from '../../model/confirm-dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministratorService } from '../../services/administrator.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from '../../configuration/navegacion';
import { AlertService } from '../alertas';
import { NotificationService } from '../../services/notification.service';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.css']
})
export class NotificationDialogComponent implements OnInit {

  public form: FormGroup;
  idCliente: number;
  constructor(
    private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService, 
    private alertService: AlertService, 
    private router: Router,
    private administratorService: AdministratorService,
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationModel,
    public notificationService : NotificationService,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    console.log(this.data.favorito);
    this.form = this.formBuilder.group({
      titulo: [null, [Validators.required]],
      mensaje: [null, [Validators.required]]
  });
    this.idCliente = Number(localStorage.getItem('cliente'));


    this.dialogRef.disableClose = true;
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  confirmDialog() {
    let body = {
      notificacion: {
        titulo: this.form.get('titulo').value,
        descripcion: this.form.get('mensaje').value,
        tipoNotificacion: 'I'
      },
      destinatarios:[{
          idCliente : this.idCliente
      }]
    }
    this.notificationService.crearNotificacion(this.administratorService.getIdUsuarios(),'USUARIO_CLIENTE',body, this.idCliente).subscribe({
      next: (result) => {
        this.spinner.hide();
        if(result.httpStatus == 200){
          this.registrarBitacora()
          this.alertService.success(result.message);
        }else{
          this.alertService.error("No se pudo crear la notificacion");
        }
      },
      error: () => {
        console.log('error')
        this.spinner.hide();
        this.alertService.error("No se pudo crear la notificacion");
      }
    });
    this.dialogRef.close(true);
  }

  registrarBitacora(){
    let body = {
      "funcionalidad": 'Envió de notificación',
      "tipoOperacion": 'Envió',
      "datos": "El usuario " + this.administratorService.getIdUsuarios() + " realizo un envió de notificación al cliente " + + '',
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

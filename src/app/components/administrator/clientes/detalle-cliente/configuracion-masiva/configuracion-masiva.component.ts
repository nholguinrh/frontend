import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Punta } from 'src/app/shared/model/cliente.model';
import { GenericDialogModel, MasivaDialogModel } from 'src/app/shared/model/confirm-dialog';

@Component({
  selector: 'app-configuracion-masiva',
  templateUrl: './configuracion-masiva.component.html',
  styleUrls: ['./configuracion-masiva.component.css']
})
export class ConfiguracionMasivaComponent implements OnInit {

  configuracion: boolean = true;
  estatus:any = [];

  constructor(
    public dialogRef: MatDialogRef<ConfiguracionMasivaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MasivaDialogModel
  ) {}

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  confirmDialog() {
    this.estatus = [
      true,
      this.configuracion
    ]
    this.dialogRef.close(this.estatus);
    
  }

  configuracionMasiva(opcion: boolean){
    opcion ? this.configuracion = true : this.configuracion = false;
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Step } from 'src/app/shared/model/stteper.model';

@Component({
  selector: 'app-activacion',
  templateUrl: './activacion.component.html',
  styleUrls: ['./activacion.component.css']
})
export class ActivacionComponent implements OnInit {

  initialStep: Step; 
  steps: Step[] = [];
  constructor(private router: Router,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.nuevoClienteActivacion);
    this.initialStep = new Step('Información', true, true);
    this.steps.push(new Step('Activación', true, false));
    this.steps.push(new Step('Configuración', false, false));
  }

  activacion(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteConfiguracion+")");
  }

  continueLater(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
  }

  goBack(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteInformacion+")");
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '900px',
      height: '615px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
    });
}

}

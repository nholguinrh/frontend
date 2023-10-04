import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { EditGraphComponent } from '../edit-graph/edit-graph.component';

@Component({
  selector: 'smc-title-dashboard',
  templateUrl: './title-dashboard.component.html',
  styleUrls: ['./title-dashboard.component.css'],
})
export class TitleDashboardComponent implements OnInit {
  @Input() title: string = '';
  @Input() editable: boolean = true;
  @Input() expandible: boolean = true;
  @Input() menu: boolean = true;
  @Input() options: '';
  @Input() typeGraph: number;
  @Input() buttonMenu: boolean = true;
  @Input() fullType: string;
  @Input() viewGraph: number;
  dark: boolean;
  isDarkTheme: Observable<boolean>;

  themeDialog: string;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private changeGraphService: ChangeGraphService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => {
      this.dark = val;
      this.themeDialog = this.dark ? 'dark-modalbox' : 'ligth-modalbox';
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditGraphComponent, {
      width: '900px',
      height: '625px',
      data: {
        typeGraph: this.typeGraph,
        viewGraph: this.viewGraph,
        dark: this.dark,
      },
      panelClass: this.themeDialog,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.changeGraphService.sendOrder(this.viewGraph, this.typeGraph);
      console.log(result)
    });
  }

  fullSize() {
    localStorage.setItem('full-type', this.fullType);
    if(this.typeGraph == 20 || this.typeGraph == 11){
      localStorage.setItem('full-type-title', 'Promedio de resolución');
    }else if(this.typeGraph == 19){
      localStorage.setItem('full-type-title', 'Metricas por Sitios');
    }else if(this.fullType == 'ENLACES_METRICAS'){
      localStorage.setItem('full-type-title', 'Metricas por Sitios');
    }else{
      localStorage.setItem('full-type-title', this.title);
    }
    if (
      this.fullType === 'ENLACES_METRICAS' ||
      this.fullType === 'ENLACES_VISTA_GENERAL' ||
      this.fullType === 'ENLACES_ALARMAS' ||
      this.fullType === 'ENLACES_TICKETS' ||
      this.fullType == 'RESOLUCION_INTERFACES' ||
      this.fullType == 'RESOLUCION_METRICAS'
    ) {
      localStorage.setItem('full-type-child', this.viewGraph.toString());
    } else {
      localStorage.removeItem('full-type-child');
    }
    this.router.navigateByUrl(
      NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.fullSize + ')'
    );
  }
}

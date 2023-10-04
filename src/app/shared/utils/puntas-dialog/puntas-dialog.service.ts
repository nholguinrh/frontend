import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { DetallePunta } from '../../model/cliente.model';

@Injectable({ providedIn: 'root' })
export class PuntasDialogService {
    private dialogConfig = new MatDialogConfig();

    detallePunta(detallePunta: DetallePunta): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = detallePunta;
        return this.dialogConfig;
    }

}

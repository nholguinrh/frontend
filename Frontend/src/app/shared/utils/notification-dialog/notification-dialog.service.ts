import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class NotificationDialogService {
    private dialogConfig = new MatDialogConfig();

    sendNotification(tittle: string, icon: string, favorito: boolean, cancelable: true): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: tittle,
            icon: icon,
            favorito: favorito,
            cancelable: false
        }
        return this.dialogConfig;
    }

}

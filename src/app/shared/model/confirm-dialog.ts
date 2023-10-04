export interface GenericDialogModel {
    title: string;
    subtitle: string;
    message: string;
    cancelMessage: string;
    confirmMessage: string;
    type?: string;
    showCancelMessage: boolean;
}

export interface NotificationModel {
    title: string;
    icon: string;
    favorito: boolean;
    cancelable: boolean
}

export interface MasivaDialogModel {
    title: string;
    subtitle: string;
    comment?: string;
    negativeComment?: string;
    message: string;
    active?: string;
    deactivate?: string;
    action?: string;
    cancelMessage: string;
    confirmMessage: string;
    negativeConfirmMessage: string;
    type?: string;
    showCancelMessage: boolean;
}

export interface ServicioDialogModel {
    title: string;
    lista?: any;
    listadoItems?: any;
    showCancelMessage: boolean;
}
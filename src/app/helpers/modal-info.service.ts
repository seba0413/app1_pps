import { Injectable } from '@angular/core';
import { ModalComponent } from '../componentes/modal/modal.component';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModalInfoService {

  constructor( private modalInfo: ModalController ) { }

  abrirModalInfo( mensaje: string, tipo: string ) {
    this.modalInfo.create({
      component: ModalComponent,
      componentProps: {
        tipoInfo: tipo,
        mensajeAMostrar: mensaje
      }
    }).then( (modal) => modal.present());
  }
}

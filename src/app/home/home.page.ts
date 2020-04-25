import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CameraService } from '../servicios/camera.service';
import { ModalInfoService } from '../helpers/modal-info.service';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  imagen: any;

  constructor( public actionSheetController: ActionSheetController,
               private router: Router,
               private cameraService: CameraService,
               private modalInfoService: ModalInfoService,
               private  AFauth: AuthService) {}

  sacarFoto( categoria: number ) {
    this.cameraService.sacarFoto()
    .then( datosImagen => {
      if (datosImagen !== 'No Image Selected') {
        this.subirFoto(datosImagen, categoria);
      }
    });
  }

  subirFoto( datosImagen, categoria ) {
    this.cameraService.guardarFoto( datosImagen, categoria )
    .then(() => {
      this.modalInfoService.abrirModalInfo('Foto guardada', 'success');
    })
    .catch( error => {
      this.modalInfoService.abrirModalInfo('Error al guardar la foto', 'error');
    });
  }

  OnLogOut() {
    this.AFauth.logout();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Galería',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/galeria']);
          }
        },
        {
          text: 'Desconectarse',
          role: 'destructive',
          icon: 'log-out',
          handler: () => {
            this.OnLogOut();
          }
        }
      ]
    });
    await actionSheet.present();
  }

}

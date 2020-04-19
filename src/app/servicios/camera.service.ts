import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };

  constructor( private camera: Camera,
               private dataService: DataService  ) { }

  sacarFoto() {
    return this.camera.getPicture(this.options)
    .then(res => {
       return res;
    })
    .catch(error => {
      console.error(error);
      return error;
    });
  }

  guardarFoto( datosImagen, categoria ) {
    return this.dataService.guardarEnStorage( datosImagen )
    .then( respuesta => {
      respuesta.ref.getDownloadURL()
      .then( url => {
        this.dataService.guardarEnBaseDeDatos( respuesta.metadata, url, categoria );
      })
      .catch( error => {
        console.log( error );
      });
    });
  }
}

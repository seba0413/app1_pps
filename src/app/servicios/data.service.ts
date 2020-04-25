import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../servicios/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { Imagen } from '../modelos/imagen';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  nombreImagen: string;
  dbRef: AngularFirestoreCollection<any>;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private db2: AngularFireDatabase,
    private fStorage: AngularFireStorage ) {

      this.dbRef = this.db.collection('files');
  }

  guardarEnStorage( datosImagen ): AngularFireUploadTask {
    this.nombreImagen = this.generarNombreFoto( this.obtenerNombreUsuario() );
    const imagen = `data:image/jpeg;base64,${datosImagen}`;
    return this.fStorage.ref(`files/${this.nombreImagen}`).putString(imagen, 'data_url');
  }

  guardarEnBaseDeDatos( metaData, urlImagen, categoria ) {
    console.log('metaData', metaData);
    console.log('url', urlImagen);
    console.log('tipo', categoria);
    return this.dbRef.doc( this.nombreImagen ).set({
      votos: new Array(),
      url: urlImagen,
      creada: metaData.timeCreated,
      fullPath: metaData.fullPath,
      contentType: metaData.contentType,
      usuario: this.authService.getCurrentUserId(),
      mail: this.authService.getCurrentUserMail(),
      tipo: categoria === 0 ? 'linda' : 'fea',
    });
  }

  getImages() {
    return this.dbRef.snapshotChanges().pipe(
      map(files => {
        return files.map(c => {
          const data = c.payload.doc.data() as Imagen;
          data.id = c.payload.doc.id;
          return data;
        }).sort((a, b) => {
          return new Date(b.creada).getTime() - new Date(a.creada).getTime();
        });
      })
    );
  }

  getByTipo( tipo: number ) {
    return this.dbRef.snapshotChanges().pipe(
      map(files => {
        return files.map(c => {
          const data = c.payload.doc.data() as Imagen;
          data.id = c.payload.doc.id;
          return data;
        })
        .filter(f => {
          if (tipo === 1) {
            return f.tipo === 'linda';
          }
          if (tipo === 2) {
            return f.tipo === 'fea';
          } else {
            return f;
          }
        })
        .sort((a, b) => {
          return new Date(b.creada).getTime() - new Date(a.creada).getTime();
        });
      })
    );
  }

  updateDatabase(id, votosParam) {
    console.log('update id: ', id, 'votos: ', votosParam);
    return this.dbRef.doc(id).update({
      votos: votosParam
    });
  }

  generarNombreFoto( usuario: string ) {
    const arrayFechaCompleta =  new Date().toISOString().split('T');
    // Fecha sin año
    const arrayFecha = arrayFechaCompleta[0].split('-');
    const fechaSinAnio = arrayFecha[2] + '-' + arrayFecha[1];
    // Hora con minutos y segundos
    const arrayHoraCompleta = arrayFechaCompleta[1].split('.');
    const nombreFinal = usuario + ' ' + fechaSinAnio + ' ' + arrayHoraCompleta[0];
    return nombreFinal;
  }

 obtenerNombreUsuario() {
    const usuario = this.authService.getCurrentUserMail().split('@');
    return usuario[0];
  }
}

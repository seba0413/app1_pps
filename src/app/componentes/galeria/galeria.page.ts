import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/servicios/data.service';
import { ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  public files: any = [];
  email: string;
  todas = true;
  lindas = false;
  feas = false;
  graficos = false;
  categorias = [{ id: 0, tipo: 'Todas' }, { id: 1, tipo: 'Lindas' }, { id: 2, tipo: 'Feas' }, { id: 3, tipo: 'Graficos' }];
  categoriaActual;

  // Graficos
  fotosLindas: any = [];
  fotosFeas: any = [];
  arrayLabelsFotosLindas: string[] = [];
  arrayDataFotosLindas: number[] = [];
  arrayColoresFotosLindas: string[] = [];
  arrayLabelsFotosFeas: string[] = [];
  arrayDataFotosFeas: number[] = [];
  arrayColoresFotosFeas: string[] = [];
  contador = 0;

  constructor(
    private authService: AuthService,
    private dataServ: DataService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private rutaActiva: ActivatedRoute) {}

  ngOnInit() {

    this.dataServ.getByTipo(0).subscribe(files => {
      this.setTipoVoto(files);
      this.files = files;
    });
  }

  setTipoVoto(files) {
    files.forEach(file => {
      if ( file.votos ) {
        file.votos.forEach( voto => {
          if (voto === this.authService.getCurrentUserMail()) {
            file.votado = true;
          }
        });
      }
    });
  }

  votar( id ) {
    const fileId = this.files.find(x => x.id === id);
    const userEmail = this.authService.getCurrentUserMail();
    console.log('user email', userEmail);
    if (fileId.votado) {
      const position = fileId.votos.indexOf(userEmail);
      if ( position >= 0 ) {
        fileId.votos.splice(position, 1);
      }
    }
    else {
      fileId.votos.push(userEmail);
    }
    this.dataServ.updateDatabase(id, fileId.votos)
    .then(res => {
      if ( fileId.votado ) {
        fileId.votado = false;
      }
    })
    .catch(err => {
      console.log('Error al registrar los votos');
    });
  }

  OnLogOut() {
    this.authService.logout();
  }

  traer( event ) {
    switch ( parseInt(event.detail.value, 10 )) {
      case 0:
        this.graficos = false;
        this.dataServ.getByTipo(0).subscribe(files => {
          console.log('files: ', files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break;
      case 1:
        this.graficos = false;
        this.fotosLindas = [];
        this.fotosFeas = [];
        this.dataServ.getByTipo(1).subscribe(files => {
          console.log('files: ', files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break;
      case 2:
        this.graficos = false;
        this.fotosLindas = [];
        this.fotosFeas = [];
        this.dataServ.getByTipo(2).subscribe(files => {
          console.log('files: ', files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break;
      case 3:
        this.limpiarGraficos();
        this.graficos = true;
        this.dataServ.getByTipo(0).subscribe(files => {
          console.log('files: ', files);
          this.setTipoVoto(files);
          this.files = files;
          for ( const foto of this.files ) {
            if ( foto.tipo === 'linda' ) {
              this.fotosLindas.push( foto );
            } else {
              this.fotosFeas.push( foto );
            }
          }
          this.armarDatosGraficoFotosLindas();
          this.armarDatosGraficoFotosFeas();
        });
        break;
    }
  }

  armarDatosGraficoFotosLindas() {
    for ( const foto of this.fotosLindas ) {
      this.arrayLabelsFotosLindas.push( foto.id );
      this.arrayDataFotosLindas.push( foto.votos.length );
      const color = this.generarColor();
      foto.color = color;
      this.arrayColoresFotosLindas.push( color );
    }
    this.showChartLindas();
  }

  armarDatosGraficoFotosFeas() {
    for ( const foto of this.fotosFeas ) {
      this.arrayLabelsFotosFeas.push( foto.id );
      this.arrayDataFotosFeas.push( foto.votos.length );
      const color = this.generarColor();
      this.arrayColoresFotosFeas.push( color );
      foto.color = color;
    }
    this.showChartFeas();
  }

  showChartLindas() {
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const ctx = ( <any> document.getElementById('fotos-lindas')).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.arrayLabelsFotosLindas,
          datasets: [{
              backgroundColor: this.arrayColoresFotosLindas,
              data: this.arrayDataFotosLindas,
              borderWidth: 1
          }]
       }
    });
  }

  showChartFeas() {
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const ctx = ( <any> document.getElementById('fotos-feas')).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.arrayLabelsFotosFeas,
          datasets: [{
              label: '',
              backgroundColor: this.arrayColoresFotosFeas,
              data: this.arrayDataFotosFeas,
              borderWidth: 1,
              yAxisID : 0
          }]
       }
    });
  }

  generarColor(): string {
    const color1 = Math.floor(Math.random() * 256);
    const color2 = Math.floor(Math.random() * 256);
    const color3 = Math.floor(Math.random() * 256);
    return 'rgb(' + color1 + ', ' + color2 + ', ' + color3 + ')';
  }

  limpiarGraficos() {
    this.fotosFeas = [];
    this.fotosLindas = [];
    this.arrayLabelsFotosFeas = [];
    this.arrayLabelsFotosLindas = [];
    this.arrayDataFotosFeas = [];
    this.arrayDataFotosLindas = [];
    this.arrayColoresFotosFeas = [];
    this.arrayColoresFotosLindas = [];
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Home',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/home']);
          }
        },
        {
          text: 'Desconectarse',
          role: 'destructive',
          icon: 'log-out',
          handler: () => {
            this.OnLogOut();
          },
        }
      ]
    });
    await actionSheet.present();
  }
}

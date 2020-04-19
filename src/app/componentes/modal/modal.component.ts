
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() mensajeAMostrar: string;
  @Input() tipoInfo: string;

  constructor(private modalCtrl: ModalController) { }

  salir() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}

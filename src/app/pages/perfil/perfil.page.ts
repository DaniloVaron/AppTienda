/**
 * Página de perfil del usuario autenticado.
 *
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonIcon, IonButton,
  IonCard, IonCardContent, IonText, IonNote,
  IonAvatar, IonGrid, IonRow, IonCol,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logOutOutline, mailOutline, personOutline,
  cartOutline, walletOutline, shieldCheckmarkOutline,
  informationCircleOutline, storefrontOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonIcon, IonButton,
    IonCard, IonCardContent, IonText, IonNote,
    IonAvatar, IonGrid, IonRow, IonCol
  ]
})
export class PerfilPage implements OnInit, OnDestroy {

  /** Usuario actual */
  usuario: Usuario | null = null;

  /** Cantidad de items en el carrito */
  cantidadItems = 0;

  /** Total del carrito */
  totalCarrito = 0;

  /** Suscripciones */
  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    addIcons({
      logOutOutline, mailOutline, personOutline,
      cartOutline, walletOutline, shieldCheckmarkOutline,
      informationCircleOutline, storefrontOutline
    });
  }

  ngOnInit(): void {
    // Suscribimos al usuario
    this.subs.push(
      this.authService.usuario$.subscribe(usuario => {
        this.usuario = usuario;
      })
    );

    // Suscribimos al carrito para estadísticas
    this.subs.push(
      this.carritoService.carrito$.subscribe(items => {
        this.cantidadItems = items.reduce((t, i) => t + i.cantidad, 0);
        this.totalCarrito = this.carritoService.obtenerTotal();
      })
    );
  }

  ngOnDestroy(): void {
    // Limpiamos TODAS las suscripciones
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Obtiene la inicial del nombre del usuario para el avatar.
   * Ejemplo: "Juan Pérez" → "J"
   */
  getInicial(): string {
    if (this.usuario?.nombre) {
      return this.usuario.nombre.charAt(0).toUpperCase();
    }
    return '?';
  }

  /**
   * Cierra la sesión del usuario con confirmación.
   * Redirige al login después de cerrar sesión.
   */
  async cerrarSesion(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }
}
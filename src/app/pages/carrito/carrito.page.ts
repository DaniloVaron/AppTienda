/**
 * Página del carrito de compras.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonThumbnail,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline,
  addOutline,
  removeOutline,
  cartOutline,
  bagCheckOutline,
  sadOutline,
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItem } from '../../models/carrito.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonButton,
    IonIcon,
    IonText,
    IonThumbnail,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
  ],
})
export class CarritoPage implements OnInit, OnDestroy {
  /** Items del carrito */
  items: CarritoItem[] = [];

  /** Total del carrito */
  total = 0;

  /** Suscripción al carrito (para limpiar en OnDestroy) */
  private carritoSub!: Subscription;

  constructor(
    private carritoService: CarritoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {
    addIcons({
      trashOutline,
      addOutline,
      removeOutline,
      cartOutline,
      bagCheckOutline,
      sadOutline,
    });
  }

  /**
   * Nos suscribimos al carrito para recibir actualizaciones en tiempo real.
   */
  ngOnInit(): void {
    this.carritoSub = this.carritoService.carrito$.subscribe((items) => {
      this.items = items;
      this.total = this.carritoService.obtenerTotal();
    });
  }

  /**
   * Limpiamos la suscripción para evitar memory leaks.
   */
  ngOnDestroy(): void {
    if (this.carritoSub) {
      this.carritoSub.unsubscribe();
    }
  }

  /**
   * Incrementa la cantidad de un item.
   * @param item - El item del carrito a incrementar
   */
  async incrementar(item: CarritoItem): Promise<void> {
    await this.carritoService.actualizarCantidad(
      item.producto.id,
      item.cantidad + 1,
    );
  }

  /**
   * Decrementa la cantidad de un item.
   * Si llega a 0, se elimina automáticamente.
   * @param item - El item del carrito a decrementar
   */
  async decrementar(item: CarritoItem): Promise<void> {
    await this.carritoService.actualizarCantidad(
      item.producto.id,
      item.cantidad - 1,
    );
  }

  /**
   * Elimina un producto del carrito con confirmación.
   * @param item - El item a eliminar
   */
  async eliminar(item: CarritoItem): Promise<void> {
    await this.carritoService.eliminar(item.producto.id);

    const toast = await this.toastCtrl.create({
      message: 'Producto eliminado del carrito',
      duration: 2000,
      position: 'bottom',
      color: 'warning',
      icon: 'trash-outline',
    });
    await toast.present();
  }

  /**
   * Finaliza la compra (simulación).
   * Muestra una alerta de confirmación y vacía el carrito.
   */
  async finalizarCompra(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Finalizar Compra',
      message: `Total a pagar: $${this.total.toFixed(2)}\n\n¿Confirmar compra?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            // Vaciamos el carrito
            await this.carritoService.vaciar();

            // Mostramos confirmación
            const toast = await this.toastCtrl.create({
              message: '¡Compra realizada con éxito! 🎉',
              duration: 3000,
              position: 'bottom',
              color: 'success',
              icon: 'bag-check-outline',
            });
            await toast.present();
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Vacía completamente el carrito con confirmación.
   */
  async vaciarCarrito(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Vaciar Carrito',
      message: '¿Estás seguro de que quieres vaciar todo el carrito?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Vaciar',
          role: 'destructive',
          handler: async () => {
            await this.carritoService.vaciar();
          },
        },
      ],
    });
    await alert.present();
  }
}

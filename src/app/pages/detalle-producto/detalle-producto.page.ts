/**
 * Página que muestra el detalle completo de un producto.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonText, IonBadge,
  IonBackButton, IonButtons, IonSpinner,
  IonChip, IonLabel, IonGrid, IonRow, IonCol,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline, starOutline, star, starHalfOutline,
  addOutline, removeOutline, arrowBackOutline
} from 'ionicons/icons';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonText, IonBadge,
    IonBackButton, IonButtons, IonSpinner,
    IonChip, IonLabel, IonGrid, IonRow, IonCol
  ]
})
export class DetalleProductoPage implements OnInit {

  /** Producto actual */
  producto: Producto | null = null;

  /** Cantidad seleccionada para agregar al carrito */
  cantidad = 1;

  /** Indica si los datos se están cargando */
  cargando = true;

  constructor(
    private route: ActivatedRoute,        // Para obtener el parámetro :id de la URL
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private toastCtrl: ToastController
  ) {
    addIcons({ cartOutline, starOutline, star, starHalfOutline, addOutline, removeOutline, arrowBackOutline });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.obtenerProducto(id).subscribe({
        next: (producto) => {
          this.producto = producto;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar producto:', err);
          this.cargando = false;
        }
      });
    }
  }

  /**
   * Incrementa la cantidad seleccionada.
   */
  incrementar(): void {
    if (this.cantidad < 10) {
      this.cantidad++;
    }
  }

  /**
   * Decrementa la cantidad seleccionada.
   */
  decrementar(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  /**
   * Agrega el producto al carrito con la cantidad seleccionada.
   */
  async agregarAlCarrito(): Promise<void> {
    if (!this.producto) return;

    // Agregamos la cantidad seleccionada
    for (let i = 0; i < this.cantidad; i++) {
      await this.carritoService.agregar(this.producto);
    }

    // Toast de confirmación
    const toast = await this.toastCtrl.create({
      message: `${this.cantidad}x ${this.producto.title.substring(0, 25)}... agregado al carrito`,
      duration: 2500,
      position: 'bottom',
      color: 'success',
      icon: 'cart-outline'
    });
    await toast.present();

    // Resetear cantidad
    this.cantidad = 1;
  }

  /**
   * Genera las estrellas para el rating visual.
   */
  getEstrellas(rate: number): string[] {
    const estrellas: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rate >= i) estrellas.push('star');
      else if (rate >= i - 0.5) estrellas.push('star-half-outline');
      else estrellas.push('star-outline');
    }
    return estrellas;
  }

  /**
   * Mapa de traducción de categorías del inglés al español.
   */
  private categoriasTraducidas: { [key: string]: string } = {
    'electronics': 'Electrónica',
    'jewelery': 'Joyería',
    "men's clothing": 'Ropa Hombre',
    "women's clothing": 'Ropa Mujer'
  };

  /**
   * Traduce el nombre de una categoría al español.
   */
  traducirCategoria(texto: string): string {
    return this.categoriasTraducidas[texto] || texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
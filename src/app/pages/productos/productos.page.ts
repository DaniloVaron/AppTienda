/**
 * Página principal de la tienda que muestra el catálogo de productos.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonImg,
  IonButton,
  IonIcon,
  IonText,
  IonBadge,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
  IonChip,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  starOutline,
  star,
  starHalfOutline,
  searchOutline,
  refreshOutline,
} from 'ionicons/icons';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonImg,
    IonButton,
    IonIcon,
    IonText,
    IonBadge,
    IonSkeletonText,
    IonRefresher,
    IonRefresherContent,
    IonChip,
    IonSpinner,
  ],
})
export class ProductosPage implements OnInit {
  /** Lista completa de productos (sin filtrar) */
  productos: Producto[] = [];

  /** Lista filtrada que se muestra en el template */
  productosFiltrados: Producto[] = [];

  /** Categorías disponibles */
  categorias: string[] = [];

  /** Categoría actualmente seleccionada ('all' = todas) */
  categoriaSeleccionada = 'all';

  /** Texto de búsqueda */
  textoBusqueda = '';

  /** Indica si los datos se están cargando */
  cargando = true;

  /** Indica si hubo un error al cargar */
  error = false;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private toastCtrl: ToastController,
    private router: Router,
  ) {
    addIcons({
      cartOutline,
      starOutline,
      star,
      starHalfOutline,
      searchOutline,
      refreshOutline,
    });
  }

  /**
   * Cargamos productos y categorías en paralelo.
   */
  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Carga productos y categorías desde la API.
   */
  cargarDatos(): void {
    this.cargando = true;
    this.error = false;

    // Cargar productos
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = true;
        this.cargando = false;
      },
    });

    // Cargar categorías (en paralelo)
    this.productoService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      },
    });
  }

  /**
   * Filtra productos por categoría y texto de búsqueda.
   */
  aplicarFiltros(): void {
    let resultado = [...this.productos];

    // Filtro por categoría
    if (this.categoriaSeleccionada !== 'all') {
      resultado = resultado.filter(
        (p) => p.category === this.categoriaSeleccionada,
      );
    }

    // Filtro por texto de búsqueda (case insensitive)
    if (this.textoBusqueda.trim()) {
      const busqueda = this.textoBusqueda.toLowerCase().trim();
      resultado = resultado.filter((p) =>
        p.title.toLowerCase().includes(busqueda),
      );
    }

    this.productosFiltrados = resultado;
  }

  /**
   * Maneja el cambio de categoría en el ion-segment.
   */
  onCategoriaChange(event: any): void {
    this.categoriaSeleccionada = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Maneja el cambio en la barra de búsqueda.
   */
  onBusqueda(event: any): void {
    this.textoBusqueda = event.detail.value || '';
    this.aplicarFiltros();
  }

  /**
   * Navega a la página de detalle del producto.
   */
  verDetalle(producto: Producto): void {
    this.router.navigate(['/detalle-producto', producto.id]);
  }

  /**
   * Agrega un producto directamente al carrito (sin ir al detalle).
   */
  async agregarAlCarrito(event: Event, producto: Producto): Promise<void> {
    event.stopPropagation(); // Evita que se navegue al detalle

    await this.carritoService.agregar(producto);

    // Mostramos un toast de confirmación
    const toast = await this.toastCtrl.create({
      message: `${producto.title.substring(0, 30)}... agregado al carrito`,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'cart-outline',
    });
    await toast.present();
  }

  /**
   * Recarga los datos al arrastrar hacia abajo.
   */
  doRefresh(event: any): void {
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.aplicarFiltros();
        event.target.complete(); // ← Importante: cierra el spinner del refresh
      },
      error: () => {
        event.target.complete();
      },
    });
  }

  /**
   * Genera las estrellas para el rating visual.
   */
  getEstrellas(rate: number): string[] {
    const estrellas: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rate >= i) {
        estrellas.push('star'); // Estrella completa
      } else if (rate >= i - 0.5) {
        estrellas.push('star-half-outline'); // Media estrella
      } else {
        estrellas.push('star-outline'); // Estrella vacía
      }
    }
    return estrellas;
  }

  /**
   * Mapa de traducción de categorías del inglés al español.
   */
  private categoriasTraducidas: { [key: string]: string } = {
    electronics: 'Electrónica',
    jewelery: 'Joyería',
    "men's clothing": 'Ropa Hombre',
    "women's clothing": 'Ropa Mujer',
  };

  /**
   * Traduce el nombre de una categoría al español.
   */
  traducirCategoria(texto: string): string {
    return (
      this.categoriasTraducidas[texto] ||
      texto.charAt(0).toUpperCase() + texto.slice(1)
    );
  }
}

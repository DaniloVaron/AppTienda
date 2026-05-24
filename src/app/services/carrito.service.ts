/**
 * Servicio que gestiona el carrito de compras de la aplicación.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { CarritoItem } from '../models/carrito.model';
import { Producto } from '../models/producto.model';

/** Clave para guardar el carrito en Preferences */
const CARRITO_KEY = 'carrito_items';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  /**
   * Valor inicial: array vacío (carrito sin productos).
   */
  private carritoSubject = new BehaviorSubject<CarritoItem[]>([]);

  carrito$ = this.carritoSubject.asObservable();

  constructor(private storageService: StorageService) {
    // Al iniciar, cargamos el carrito guardado en Preferences
    this.cargarCarrito();
  }

  /**
   * Carga el carrito desde Preferences al iniciar la app.
   * Si no hay carrito guardado, se mantiene el array vacío.
   */
  private async cargarCarrito(): Promise<void> {
    const guardado = await this.storageService.get(CARRITO_KEY);
    if (guardado) {
      this.carritoSubject.next(guardado);
    }
  }

  /**
   * Guarda el estado actual del carrito en Preferences.
   */
  private async guardarCarrito(): Promise<void> {
    await this.storageService.set(CARRITO_KEY, this.carritoSubject.value);
  }

  /**
   * Agrega un producto al carrito.
   */
  async agregar(producto: Producto): Promise<void> {
    const items = [...this.carritoSubject.value]; // Copia para inmutabilidad

    // Buscamos si el producto ya está en el carrito (por ID)
    const indice = items.findIndex((item) => item.producto.id === producto.id);

    if (indice > -1) {
      // Ya existe: incrementamos la cantidad
      items[indice] = {
        ...items[indice],
        cantidad: items[indice].cantidad + 1,
      };
    } else {
      // Nuevo producto: lo agregamos con cantidad 1
      items.push({ producto, cantidad: 1 });
    }

    // Actualizamos el estado y persistimos
    this.carritoSubject.next(items);
    await this.guardarCarrito();
  }

  /**
   * Elimina un producto completamente del carrito.
   */
  async eliminar(productoId: number): Promise<void> {
    const items = this.carritoSubject.value.filter(
      (item) => item.producto.id !== productoId,
    );
    this.carritoSubject.next(items);
    await this.guardarCarrito();
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   */
  async actualizarCantidad(
    productoId: number,
    cantidad: number,
  ): Promise<void> {
    if (cantidad <= 0) {
      // Si la cantidad es 0 o negativa, eliminamos el producto
      await this.eliminar(productoId);
      return;
    }

    const items = this.carritoSubject.value.map((item) => {
      if (item.producto.id === productoId) {
        return { ...item, cantidad }; // Actualizamos solo la cantidad
      }
      return item;
    });

    this.carritoSubject.next(items);
    await this.guardarCarrito();
  }

  /**
   * Vacía completamente el carrito.
   */
  async vaciar(): Promise<void> {
    this.carritoSubject.next([]);
    await this.guardarCarrito();
  }

  /**
   * Calcula el total del carrito (precio × cantidad de cada item).
   */
  obtenerTotal(): number {
    return this.carritoSubject.value.reduce(
      (total, item) => total + item.producto.price * item.cantidad,
      0, // Valor inicial del acumulador
    );
  }

  /**
   * Obtiene el número total de items en el carrito.
   */
  obtenerCantidadTotal(): number {
    return this.carritoSubject.value.reduce(
      (total, item) => total + item.cantidad,
      0,
    );
  }

  /**
   * Obtiene los items actuales de forma síncrona.
   */
  obtenerItems(): CarritoItem[] {
    return this.carritoSubject.value;
  }
}

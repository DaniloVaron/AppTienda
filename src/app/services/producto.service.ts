// * Servicio que consume la FakeStoreAPI para obtener datos de productos.*

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  //URL base de la API.
  private readonly API_URL = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/products`);
  }

  /**
   * Obtiene un producto específico por su ID.
   */
  obtenerProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/products/${id}`);
  }

  /**
   * Obtiene todas las categorías disponibles.
   */
  obtenerCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/products/categories`);
  }

  /**
   * Obtiene productos filtrados por categoría.
   */
  obtenerPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${this.API_URL}/products/category/${categoria}`,
    );
  }
}

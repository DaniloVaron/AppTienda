/**
 * Interface que representa un item dentro del carrito de compras.
 */
import { Producto } from './producto.model';

export interface CarritoItem {
  /** El producto agregado al carrito */
  producto: Producto;

  /** Cantidad de unidades seleccionadas (mínimo 1) */
  cantidad: number;
}

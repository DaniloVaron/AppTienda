/**
 * Interface que representa un producto de la FakeStoreAPI.
 */
export interface Producto {
  /** Identificador único del producto */
  id: number;

  /** Nombre/título del producto */
  title: string;

  /** Precio en dólares (USD) */
  price: number;

  /** Descripción detallada del producto */
  description: string;

  /** Categoría a la que pertenece (ej: "electronics", "jewelery") */
  category: string;

  /** URL de la imagen del producto */
  image: string;

  /** Calificación del producto */
  rating: {
    /** Promedio de calificación (0-5) */
    rate: number;
    /** Número total de reseñas */
    count: number;
  };
}

/**
 * Interface que representa un usuario autenticado en la aplicación.
 */
export interface Usuario {
  /** Correo electrónico del usuario (usado como identificador único) */
  email: string;

  /** Nombre para mostrar del usuario */
  nombre: string;

  /**
   * Token de sesión.
   */
  token: string;
}
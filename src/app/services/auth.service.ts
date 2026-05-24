/**
 * Servicio de autenticación de la aplicación.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { Usuario } from '../models/usuario.model';

/** Claves de almacenamiento (constantes para evitar errores de tipeo) */
const STORAGE_KEYS = {
  SESION: 'usuario_sesion', // Sesión activa del usuario
  USUARIOS: 'usuarios_registrados', // Lista de todos los usuarios registrados
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * BehaviorSubject mantiene el estado del usuario actual.
   */
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private storageService: StorageService) {
    // Al iniciar el servicio, intentamos recuperar la sesión guardada
    this.cargarSesion();
  }

  /**
   * Carga la sesión guardada en Preferences (si existe).
   */
  async cargarSesion(): Promise<void> {
    const sesionGuardada = await this.storageService.get(STORAGE_KEYS.SESION);
    if (sesionGuardada) {
      this.usuarioSubject.next(sesionGuardada); // Emitimos el usuario a todos los suscriptores
    }
  }

  /**
   * Registra un nuevo usuario en el sistema.
   */
  async registrar(
    nombre: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    // Obtenemos los usuarios registrados (o array vacío si es el primero)
    const usuarios =
      (await this.storageService.get(STORAGE_KEYS.USUARIOS)) || [];

    // Verificamos que el email no esté ya registrado
    const existe = usuarios.find((u: any) => u.email === email);
    if (existe) {
      throw new Error('Este correo electrónico ya está registrado');
    }

    // Agregamos el nuevo usuario
    usuarios.push({
      nombre,
      email,
      password,
    });

    // Guardamos la lista actualizada
    await this.storageService.set(STORAGE_KEYS.USUARIOS, usuarios);

    return true;
  }

  /**
   * Inicia sesión con las credenciales proporcionadas.
   */
  async login(email: string, password: string): Promise<Usuario> {
    const usuarios =
      (await this.storageService.get(STORAGE_KEYS.USUARIOS)) || [];

    // Buscamos el usuario con ese email y contraseña
    const encontrado = usuarios.find(
      (u: any) => u.email === email && u.password === password,
    );

    if (!encontrado) {
      throw new Error('Correo o contraseña incorrectos');
    }

    // Creamos el objeto de sesión (sin la contraseña, por seguridad)
    const usuario: Usuario = {
      email: encontrado.email,
      nombre: encontrado.nombre,
      token: this.generarToken(),
    };

    // Guardamos la sesión para persistencia
    await this.storageService.set(STORAGE_KEYS.SESION, usuario);

    // Notificamos a todos los suscriptores del cambio de estado
    this.usuarioSubject.next(usuario);

    return usuario;
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  async logout(): Promise<void> {
    await this.storageService.remove(STORAGE_KEYS.SESION);
    this.usuarioSubject.next(null); // Notificamos que no hay sesión
  }

  /**
   * Verifica si hay un usuario autenticado actualmente.
   */
  isAuthenticated(): boolean {
    return this.usuarioSubject.value !== null;
  }

  /**
   * Obtiene el usuario actual de forma síncrona.
   */
  getUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  /**
   * Genera un token de sesión simulado.
   */
  private generarToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

/**
 * Página de inicio de sesión / registro de la aplicación.
 *
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonItem, IonInput, IonButton, IonText,
  IonIcon,
  AlertController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, personAddOutline, mailOutline, lockClosedOutline, storefrontOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,             // *ngIf, *ngFor, pipes
    ReactiveFormsModule,      // formGroup, formControlName
    IonContent,
    IonItem, IonInput, IonButton, IonText,
    IonIcon
  ]
})
export class LoginPage {

  /** Formulario reactivo de login/registro */
  formulario: FormGroup;

  /** Controla si estamos en modo registro o login */
  modoRegistro = false;

  /** Controla la visibilidad de la contraseña */
  mostrarPassword = false;

  /** Indica si se está procesando una petición */
  cargando = false;

  constructor(
    private fb: FormBuilder,           // Helper para crear formularios
    private authService: AuthService,   // Servicio de autenticación
    private router: Router,             // Para navegar después del login
    private alertCtrl: AlertController, // Para mostrar alertas de Ionic
    private loadingCtrl: LoadingController // Para mostrar loading spinner
  ) {
    // Registramos los iconos que usaremos en el template
    addIcons({ logInOutline, personAddOutline, mailOutline, lockClosedOutline, storefrontOutline, eyeOutline, eyeOffOutline });

    /**
     * Creamos el formulario con validaciones
     */
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: [''] // Solo requerido en modo registro (se valida manualmente)
    });
  }

  /**
   * Alterna entre modo login y modo registro.
   * Limpia el formulario al cambiar de modo.
   */
  toggleModo(): void {
    this.modoRegistro = !this.modoRegistro;
    this.formulario.reset(); // Limpiamos los campos
  }

  /**
   * Maneja el envío del formulario.
   */
  async onSubmit(): Promise<void> {
    // Validamos el formulario
    if (!this.formulario.valid) {
      // Marcamos todos los campos como "tocados" para mostrar errores
      this.formulario.markAllAsTouched();
      return;
    }

    // Validación extra para modo registro
    if (this.modoRegistro && !this.formulario.get('nombre')?.value) {
      this.mostrarAlerta('Error', 'El nombre es obligatorio para registrarse');
      return;
    }

    // Mostramos el loading
    const loading = await this.loadingCtrl.create({
      message: this.modoRegistro ? 'Creando cuenta...' : 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const { email, password, nombre } = this.formulario.value;

      if (this.modoRegistro) {
        // FLUJO DE REGISTRO
        await this.authService.registrar(nombre, email, password);
        // Después de registrar, hacemos login automáticamente
        await this.authService.login(email, password);
      } else {
        // FLUJO DE LOGIN
        await this.authService.login(email, password);
      }

      // ✅ Éxito: navegamos a la página principal
      await loading.dismiss();
      this.router.navigate(['/tabs'], { replaceUrl: true });
      // replaceUrl: true → no se puede volver al login con el botón "atrás"

    } catch (error: any) {
      // ❌ Error: mostramos el mensaje al usuario
      await loading.dismiss();
      this.mostrarAlerta('Error', error.message || 'Ocurrió un error inesperado');
    }
  }

  /**
   * Muestra una alerta de Ionic con el título y mensaje dados.
   */
  private async mostrarAlerta(titulo: string, mensaje: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Alterna la visibilidad de la contraseña.
   */
  togglePasswordVisibility(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
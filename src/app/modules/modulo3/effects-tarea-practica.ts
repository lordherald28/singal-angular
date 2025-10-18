import { Component, signal, effect, WritableSignal, OnInit, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mod3-tarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './effects.html',
  styles: [`
    .tarea-container { max-width: 500px; margin: 0 auto; padding: 2rem; }
    .advertencia { color: #e53e3e; font-weight: bold; }
    .controles { margin: 1rem 0; }
    button { margin: 0 5px; padding: 8px 16px; }
    .historial ul { padding-left: 20px; }
  `]
})
export class EffectsTarea implements OnInit {

  // Variables internas
  private mensajeEstadoGuardado: string = 'Sin guardar.';
  private anteriorVolumen: number = 0;
  private ultimoAnteriorVolumen: number = 0;
  private mensajeAdvertencia: string = ' Volumen muy alto - riesgo auditivo';
  // Signals base
  public volumen: WritableSignal<number> = signal(50);
  public historial: WritableSignal<string[]> = signal([]);
  public ultimoGuardado: WritableSignal<string> = signal('Nunca');
  public advertencia: WritableSignal<string> = signal('');
  public estadoGuardado = signal(this.mensajeEstadoGuardado);

  constructor() {
    this.anteriorVolumen = this.volumen();
    // ✅ TAREA 1: Effect para auto-guardado en localStorage
    // PISTA: Usa setTimeout y onCleanup
    // PISTA: Guarda con localStorage.setItem('volumen-tarea', valor)
    this.autoGuardadoLocalStorage();
    // ✅ TAREA 2: Effect para advertencias  
    // PISTA: Muestra advertencia si volumen > 85
    // PISTA: Limpia advertencia si volumen <= 85
    this.mostrarAdvertencia();

    // ✅ TAREA 3: Effect para historial básico
    // PISTA: Guarda cada cambio con formato: "Volumen: 50% → 60% (HH:MM:SS)"
    // PISTA: Usa new Date().toLocaleTimeString() para la hora

    this.historialBasico();
  }

  ngOnInit(): void {
    // this.anteriorVolumen = this.volumen();
  }

  public aumentar(): void {
    this.volumen.update(v => Math.min(v + 10, 100));
  }

  public disminuir(): void {
    this.volumen.update(v => Math.max(v - 10, 0));
  }

  public silenciar(): void {
    this.volumen.set(0);
  }

  public volumenMaximo(): void {
    this.volumen.set(100);
  }

  // Metodos privados para los effects
  /**
   * @description "Quiero que cuando cambie el volumen, se guarde automáticamente en el localStorage después de 500ms. 
      Mientras espera para guardar, debe mostrar '🔄 Guardando...'. 
      Una vez guardado, debe mostrar '✅ Guardado' y la hora actual.

      Si el usuario cambia el volumen nuevamente antes de que pasen los 500ms, 
      debe cancelar el guardado anterior y empezar uno nuevo."
   */
  private autoGuardadoLocalStorage(): void {
    effect((onCleanup) => {
      const volumen: number = this.volumen();

      // Solo procesar si realmente cambió
      if (this.anteriorVolumen === volumen) return;

      //Solo guardamos el anterior para otros effects
      this.ultimoAnteriorVolumen = this.anteriorVolumen;

      // Guardar el volumen anterior ANTES de cualquier async
      this.anteriorVolumen = volumen;


      // Marcar como guardando (con untracked para seguridad)
      untracked(() => {
        this.estadoGuardado.set('⏳ Guardando...');
      });

      const timeoutId = setTimeout(() => {
        localStorage.setItem('volumen-tarea', volumen.toString());

        untracked(() => {
          this.estadoGuardado.set('✅ Guardado');
          this.ultimoGuardado.set(new Date().toLocaleTimeString());
        });
      }, 500);

      onCleanup(() => {
        clearTimeout(timeoutId);

        // Solo marcar como cancelado si todavía estaba guardando
        untracked(() => {
          if (this.estadoGuardado() === '⏳ Guardando...') {
            this.estadoGuardado.set('❌ Cancelado');
          }
        });
      });
    }, { allowSignalWrites: true });
  }

  /**
   * @description "Quiero que cuando el volumen supere el 85%, muestre una advertencia que diga '⚠️ Volumen muy alto - riesgo auditivo'.
    // Cuando el volumen baje a 85% o menos, la advertencia debe desaparecer completamente."
    // @criterios
    // - Advertencia aparece SOLO cuando volumen > 85%
    // - Advertencia desaparece cuando volumen ≤ 85%
    // - Texto exacto: '⚠️ Volumen muy alto - riesgo auditivo'
    // - No mostrar advertencia en volumen 85% o menos
   */
  private mostrarAdvertencia(): void {
    // PISTA: Muestra advertencia si volumen > 85
    // PISTA: Limpia advertencia si volumen <= 85
    effect(() => {
      const volumen: number = this.volumen();
      if (volumen > 85) {
        this.advertencia.set(this.mensajeAdvertencia);
      } else {
        this.advertencia.set('');
      }
    }, { allowSignalWrites: true });
  }

  /**
  * @description "Quiero un historial que registre cada cambio de volumen con este formato exacto:
  // 'Volumen: 50% → 60% (12:34:56)'
  // 
  // El historial debe:
  // - Mostrar máximo 5 elementos
  // - Los más recientes primero
  // - Incluir la hora exacta del cambio
  // - Mostrar tanto el valor anterior como el nuevo"
   @criterios
  // - Formato exacto: 'Volumen: X% → Y% (HH:MM:SS)'
  // - Máximo 5 elementos en el historial
  // - Orden: más reciente primero
  // - Usar new Date().toLocaleTimeString() para la hora
  // - Incluir todos los cambios, no solo los significativos
   */
  private historialBasico(): void {
    let volumenAnterior: number = this.volumen(); // porque afuerra del effects?

    effect(() => {
      const volumenActual: number = this.volumen();

      // Si no hay cambios no se ejecuto el untracked, en otras palabras el effects no termina la ejecucion.
      if (volumenActual === volumenAnterior) return;
      let track: string = `Volumen: ${volumenAnterior}% →  ${volumenActual}% (${new Date().toLocaleTimeString()})`; // esto porque afuera del untracked?

      // Evitar dependencias circulares.
      untracked(() => {
        this.historial.update((historialActual:Array<string>) => {
          return [track, ...historialActual].slice(0, 5);
        });
      });

      // Actualizar variable local
      volumenAnterior = volumenActual;
    }, { allowSignalWrites: true });

  }
}
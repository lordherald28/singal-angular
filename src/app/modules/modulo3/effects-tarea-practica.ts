import { Component, signal, effect, WritableSignal, OnInit, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mod3-tarea',
    standalone: true,
    imports: [CommonModule],
    template: `
      <div class="effects-container">
      <h2>Módulo 3 - Effects Avanzados</h2>
      
      <!-- Estado del volumen -->
      <div class="volumen-display">
        <div class="volumen-bar">
          <div 
            class="volumen-fill" 
            [style.width.%]="volumen()"
            [class.peligroso]="volumen() > 80"
          ></div>
        </div>
        <p>Volumen: <strong>{{ volumen() }}%</strong></p>
      </div>

      <!-- Estado del sistema -->
      <div class="sistema-estados">
        <div class="estado-item">
          <span>🔄 Estado:</span>
          <span [class.guardando]="estadoGuardado() === 'Guardando...'">
            {{ estadoGuardado() }}
          </span>
        </div>
        <div class="estado-item">
          <span>⏰ Último guardado:</span>
          <span>{{ ultimoGuardado() }}</span>
        </div>
        <div class="estado-item" *ngIf="advertencia()">
          <span>⚠️ Advertencia:</span>
          <span class="advertencia-texto">{{ advertencia() }}</span>
        </div>
      </div>

      <!-- Controles -->
      <div class="controles">
        <button (click)="aumentar()" class="btn btn-primary">▲ +10</button>
        <button (click)="disminuir()" class="btn btn-secondary">▼ -10</button>
        <button (click)="silenciar()" class="btn btn-warning">🔇 Silenciar</button>
        <button (click)="volumenMaximo()" class="btn btn-danger">🔊 Máximo</button>
      </div>

      <!-- Historial -->
      <div class="historial" *ngIf="historial().length > 0">
        <h3>📊 Historial de cambios</h3>
        <ul>
          <li *ngFor="let item of historial(); let i = index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
`,
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

    // Signals base
    volumen = signal(50);
    historial: WritableSignal<string[]> = signal([]);
    ultimoGuardado = signal('Nunca');
    advertencia = signal('');
    estadoGuardado = signal(this.mensajeEstadoGuardado);
    constructor() {
        this.anteriorVolumen = this.volumen();
        console.log('anterior volumen: ', this.anteriorVolumen);
        console.log('actual volumen: ', this.volumen());
        // ✅ TAREA 1: Effect para auto-guardado en localStorage
        // PISTA: Usa setTimeout y onCleanup
        // PISTA: Guarda con localStorage.setItem('volumen-tarea', valor)
        this.autoGuardadoLocalStorage();
        // ✅ TAREA 2: Effect para advertencias  
        // PISTA: Muestra advertencia si volumen > 85
        // PISTA: Limpia advertencia si volumen <= 85

        // ✅ TAREA 3: Effect para historial básico
        // PISTA: Guarda cada cambio con formato: "Volumen: 50% → 60% (HH:MM:SS)"
        // PISTA: Usa new Date().toLocaleTimeString() para la hora
    }

    ngOnInit(): void {
        // this.anteriorVolumen = this.volumen();
    }

    aumentar() {
        this.volumen.update(v => Math.min(v + 10, 100));
    }

    disminuir() {
        this.volumen.update(v => Math.max(v - 10, 0));
    }

    silenciar() {
        this.volumen.set(0);
    }

    volumenMaximo() {
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

            // Guardar el volumen anterior ANTES de cualquier async
            const volumenAnterior = this.anteriorVolumen;
            this.anteriorVolumen = volumen;

            console.log(`🔄 Cambio detectado: ${volumenAnterior}% → ${volumen}%`);

            // Marcar como guardando (con untracked para seguridad)
            untracked(() => {
                this.estadoGuardado.set('⏳ Guardando...');
            });

            const timeoutId = setTimeout(() => {
                console.log('💾 Guardando en localStorage...');
                localStorage.setItem('volumen-tarea', volumen.toString());

                untracked(() => {
                    this.estadoGuardado.set('✅ Guardado');
                    this.ultimoGuardado.set(new Date().toLocaleTimeString());
                });
            }, 500);

            onCleanup(() => {
                console.log('🧹 Cleanup ejecutado');
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
}
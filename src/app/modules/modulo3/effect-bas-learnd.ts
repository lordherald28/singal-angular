import { Component, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-volumen-effects',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div>
      <h3>Módulo 3 - Effects Básicos</h3>
      
      <p>Volumen: {{ volumen() }}%</p>
      <p>Último guardado: {{ ultimoGuardado() }}</p>
      <p *ngIf="advertencia()" class="advertencia">{{ advertencia() }}</p>
      
      <button (click)="aumentar()">▲ +10</button>
      <button (click)="disminuir()">▼ -10</button>
      <button (click)="silenciar()">🔇 0%</button>
      <button (click)="volumenMaximo()">🔊 100%</button>
    </div>
  `,
    styleUrls: ['./style.effects.scss']
})
export class VolumenEffectsComponent {
    // Signals base (de módulos anteriores)
    volumen = signal<number>(this.obtenerVolumenInicial());

    // Nuevos signals para effects
    ultimoGuardado = signal<string>('Nunca');
    advertencia = signal<string>('');

    constructor() {
        // EFFECT 1: Persistencia automática en localStorage
        effect(() => {
            const vol = this.volumen();
            localStorage.setItem('volumen-app', vol.toString());
            this.ultimoGuardado.set(new Date().toLocaleTimeString());
        });

        // EFFECT 2: Alertas visuales
        effect(() => {
            const vol = this.volumen();

            if (vol > 90) {
                this.advertencia.set('⚠️ VOLUMEN PELIGROSAMENTE ALTO');
            } else if (vol < 10 && vol > 0) {
                this.advertencia.set('🔈 Volumen muy bajo');
            } else {
                this.advertencia.set('');
            }
        });

        // EFFECT 3: Logging para desarrollo
        effect(() => {
            console.log('📊 Volumen cambiado a:', this.volumen(), '%');
        });
    }

    private obtenerVolumenInicial(): number {
        // Recuperar de localStorage al iniciar
        const guardado = localStorage.getItem('volumen-app');
        return guardado ? parseInt(guardado) : 50;
    }

    // Métodos existentes (los mantienes)
    aumentar(): void {
        this.volumen.update(v => Math.min(v + 10, 100));
    }

    disminuir(): void {
        this.volumen.update(v => Math.max(v - 10, 0));
    }

    silenciar(): void {
        this.volumen.set(0);
    }

    volumenMaximo(): void {
        this.volumen.set(100);
    }
}
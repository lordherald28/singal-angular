import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-signal-basico',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="demo-container">
      <h2>Módulo 1: Signals Básicos</h2>
      
      <!-- Mostrar valor del signal -->
      <p>Contador: {{ contador() }}</p>
      
      <!-- Botones para actualizar -->
      <button (click)="incrementar()">+1</button>
      <button (click)="decrementar()">-1</button>
      <button (click)="reset()">Reset</button>
      <button (click)="setValor(5)">Poner en 5</button>
    </div>
  `,
    styles: [`
    .demo-container { padding: 20px; border: 2px solid #007acc; margin: 10px; }
    button { margin: 5px; padding: 8px 12px; }
  `]
})
export class SignalBasicoComponent {
    // 1. DECLARAR signal
    contador = signal(0);

    // 2. ACTUALIZAR signals
    incrementar() {
        // FORMA 1: update (deriva del valor actual)
        // this.contador.update(valorActual => valorActual + 1);
        this.contador.update((v) => Math.min(v + 1, 100))
    }

    decrementar() {
        // this.contador.update((v) => v > 0 ? v - 1 : v)
        this.contador.update((v) => Math.max(v - 1, 0))
    }

    reset() {
        // FORMA 2: set (valor directo)
        this.contador.set(0);
    }

    setValor(nuevoValor: number) {
        this.contador.set(nuevoValor);
    }
}
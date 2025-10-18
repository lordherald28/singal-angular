// ESQUELETO INICIAL - Completa los métodos
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-volumen-control',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div>
      <h3>Control de Volumen</h3>
      <p>Volumen: {{ volumen() }}%</p>
      
      <button (click)="aumentar()">▲ Aumentar</button>
      <button (click)="disminuir()">▼ Disminuir</button>
      <button (click)="silenciar()">🔇 Silenciar</button>
      <button (click)="volumenMaximo()">🔊 Máximo</button>
    </div>
  `
})
export class VolumenControlComponent {
    // 1. Declara un signal para el volumen (0-100)
    volumen = signal(0);

    // 2. Implementa estos métodos:
    aumentar() {
        // TODO: Aumentar volumen en 10, máximo 100
        // this.volumen.update((valorActual) => {
        //     let nuevoValor = valorActual + 10;
        //     return nuevoValor > 100 ? 100 : nuevoValor;
        // });
        //  codigo mas limpio y profesional
        this.volumen.update(valorActual => Math.min(valorActual + 10, 100));
    }

    disminuir() {
        // TODO: Disminuir volumen en 10, mínimo 0
        // this.volumen.update((valorActual) => {
        //     let nuevoValor = valorActual - 10;
        //     return nuevoValor <= 0 ? 0 : nuevoValor;
        // });
        // codigo mas limpio y profesional
        this.volumen.update(valorActual => Math.max(valorActual - 10, 0));
    }

    silenciar() {
        // TODO: Poner volumen en 0
        this.volumen.set(0);
    }

    volumenMaximo() {
        // TODO: Poner volumen en 100
        this.volumen.set(100);
    }
}
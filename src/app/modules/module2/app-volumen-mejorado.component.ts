import { Component, signal, computed, ChangeDetectionStrategy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalNode } from '@angular/core/primitives/signals';


@Component({
    selector: 'app-volumen-avanzado',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div>
      <h3>Control de Volumen Avanzado</h3>
      
      <p>Volumen: {{ volumen() }}%</p>
      
      <!-- Muestra estas computed signals -->
      <p>Estado: {{ estado() }}</p>
      <p>Es volumen peligroso: {{ esPeligroso() }}</p>
      <p>Recomendación: {{ recomendacion() }}</p>
      
      <button (click)="aumentar()">▲ +10</button>
      <button (click)="disminuir()">▼ -10</button>
      <button (click)="silenciar()">🔇 0%</button>
      <button (click)="volumenMaximo()">🔊 100%</button>
    </div>
  `,
    styleUrls: ['./style.module2.scss']
})
export class VolumenAvanzadoComponent {

    private readonly SIL_VOL: number = 0;
    private readonly BAJO_VOL: number = 33;
    private readonly MEDIO_VOL: number = 66;
    private readonly ALTO_PELIGRO_VOL: number = 80;

    volumen = signal(50);

    // TODO: Crear estas computed signals:

    // 1. estado(): string - Devuelve: 🆗 Terminado.
    //    "Silenciado" si volumen = 0
    //    "Bajo" si volumen <= 33
    //    "Medio" si volumen <= 66  
    //    "Alto" si volumen > 66

    // 2. esPeligroso(): boolean - Devuelve true si volumen > 80 🆗 Terminado.

    // 3. recomendacion(): string - Devuelve: 🆗 Terminado.
    //    "Sube el volumen" si estado es "Silenciado" o "Bajo"
    //    "Volumen adecuado" si estado es "Medio"
    //    "Baja el volumen" si estado es "Alto" o esPeligroso es true

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

    public estado: Signal<string> = computed(() => {
        const vol: number = this.volumen();
        if (vol === this.SIL_VOL) return '🔇 Silenciado';
        if (vol <= this.BAJO_VOL) return '🔈 Bajo';
        if (vol <= this.MEDIO_VOL) return '🔉 Medio';
        return '🔊 Alto';
    })

    public esPeligroso: Signal<boolean> = computed(() => {
        const vol: number = this.volumen();
        return (vol > this.ALTO_PELIGRO_VOL);
    });

    public recomendacion: Signal<string> = computed(() => {
        const vol: number = this.volumen();
        const esPeligroso: boolean = this.esPeligroso();
        // "Sube el volumen" si estado es "Silenciado" o "Bajo" 
        if (vol === this.SIL_VOL || vol < this.BAJO_VOL) return 'Sube el volumen.';

        // "Volumen adecuado" si estado es "Medio"
        if (vol <= this.MEDIO_VOL) return "Volumen adecuado";

        // "Baja el volumen" si estado es "Alto" o esPeligroso es true
        if (vol > this.MEDIO_VOL || esPeligroso) return "🛑 Baja el volumen";

        return '';
    })
}
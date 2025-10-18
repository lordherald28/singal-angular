import { Component, signal, WritableSignal, effect } from "@angular/core";

@Component({
    selector: 'app-mod3-effects-basico',
    standalone: true,
    template: `
        <div>
            <h1>Contador</h1>

            <p>{{ contador() }}
            <button (click)="incrementar()">Incrementar + 1</button>
        </div>
    `,
    styleUrls: ['./style.effects.scss']
})
export class EffectsBasico {

    public contador: WritableSignal<number> = signal<number>(0);

    constructor() {
        // PATRÓN BÁSICO
        effect(() => {
            // Código que se ejecuta automáticamente
            // cuando LOS SIGNALS DENTRO cambian
            console.log('El contador esta cambiando:', this.contador());
        });
    }

    incrementar(): void {
        this.contador.update((c: number) => c + 1);
    }


}
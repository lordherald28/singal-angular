import { Component, signal, effect } from '@angular/core';

@Component({
    selector: 'app-editor-texto',
    standalone: true,
    template: `
    <div>
      <h2>Editor de Texto - Auto-guardado</h2>
      <textarea 
        [value]="texto()" 
        (input)="actualizarTexto($event)"
        placeholder="Escribe aquí...">
      </textarea>
      
      <div class="estado">
        <span>🔵 {{ estadoGuardado() }}</span>
        <span>Último guardado: {{ ultimoGuardado() }}</span>
      </div>
    </div>
  `,
    styles: [`
    textarea {
      width: 100%;
      height: 200px;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-family: inherit;
    }
    .estado {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      color: #666;
    }
  `]
})
export class EditorTextoComponent {
    // Signal para el contenido del texto
    texto = signal<string>('');

    // Signals para el estado de guardado
    estadoGuardado = signal<string>('Guardado');
    ultimoGuardado = signal<string>('Nunca');

    constructor() {
        // EFFECT 1: Auto-guardado después de 2 segundos de inactividad
        effect((onCleanup) => {
            const contenido = this.texto();

            // Solo guardar si hay contenido
            if (contenido.trim()) {
                this.estadoGuardado.set('🔄 Guardando...');

                // Simular guardado después de 2 segundos
                const timeoutId = setTimeout(() => {
                    this.guardarEnBD(contenido);
                    this.estadoGuardado.set('✅ Guardado');
                    this.ultimoGuardado.set(new Date().toLocaleTimeString());
                }, 10000);

                // CLEANUP: Cancelar el guardado si el texto cambia antes de 2 segundos
                onCleanup(() => {
                    clearTimeout(timeoutId);
                });
            }
        }, { allowSignalWrites: true });

        // EFFECT 2: Logging para desarrollo
        effect(() => {
            console.log('📝 Texto cambiado:', {
                caracteres: this.texto().length,
                palabras: this.texto().split(' ').filter(w => w.length > 0).length,
                timestamp: new Date().toISOString()
            });
        });

        // EFFECT 3: Validación de contenido
        effect(() => {
            const contenido = this.texto();

            if (contenido.length > 1000) {
                console.warn('⚠️ Texto muy largo:', contenido.length, 'caracteres');
            }

            if (contenido.includes('contraseña') || contenido.includes('password')) {
                console.warn('🔒 Posible contraseña detectada en el texto');
            }
        });
    }

    actualizarTexto(event: Event) {
        const target = event.target as HTMLTextAreaElement;
        this.texto.set(target.value);
    }

    private guardarEnBD(contenido: string) {
        // Simular guardado en base de datos
        console.log('💾 Guardando en base de datos:', contenido.substring(0, 50) + '...');
        localStorage.setItem('documento-autoguardado', contenido);
    }
}
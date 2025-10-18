import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'module1/contador',
        loadComponent: () => import('./modules/module1/signal-basico.component').then(m => m.SignalBasicoComponent),
        title: 'Módulo 1: Contador'
    },
    {
        path: 'module1/volumen',
        loadComponent: () => import('./modules/module1/singal-basico-volumen.component').then(m => m.VolumenControlComponent),
        title: 'Módulo 1: Control de Volumen'
    },
    {
        path: 'module2/volumen-mejorado',
        loadComponent: () => import('./modules/module2/app-volumen-mejorado.component').then(m => m.VolumenAvanzadoComponent),
        title: 'Módulo 2: Volumen Mejorado'
    }
];

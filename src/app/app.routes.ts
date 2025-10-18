import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'modulo1-signals', pathMatch: 'full' },
    { path: 'modulo1-signals', loadComponent: () => import('./modules/module1/signal-basico.component').then(c => c.SignalBasicoComponent) },
    { path: 'modulo1-contador', loadComponent: () => import('./modules/module1/singal-basico-volumen.component').then(c => c.VolumenControlComponent) },
    { path: 'modulo2-volumen', loadComponent: () => import('./modules/module2/app-volumen-mejorado.component').then(c => c.VolumenAvanzadoComponent) },
    { path: 'modulo3-effects-basico', loadComponent: () => import('./modules/modulo3/effects-basico').then(c => c.EffectsBasico) },
    { path: 'modulo3-effects-case-real', loadComponent: () => import('./modules/modulo3/effect-bas-case-real').then(c => c.EditorTextoComponent) },
    // { path: 'modulo3-effects', loadComponent: () => import('./modules/modulo3/effect-bas-learnd').then(c => c.VolumenEffectsComponent) },
    { path: 'modulo3-effects-tarea', loadComponent: () => import('./modules/modulo3/effects-tarea-practica').then(c => c.EffectsTarea) },
    { path: '**', redirectTo: 'modulo1-signals' }
];
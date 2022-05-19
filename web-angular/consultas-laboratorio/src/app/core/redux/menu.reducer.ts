import { createReducer, on } from '@ngrx/store';
import { mostrarMenu, ocultarMenu } from './menu.actions';

export const estadoInicialMenu: boolean = false;

const _reducerMenu = createReducer(
    estadoInicialMenu,
    on(mostrarMenu, (state) => (state = true)),
    on(ocultarMenu, (state) => (state = false))
);

export function reducerMenu(action, state) {
    return _reducerMenu(action, state);
}

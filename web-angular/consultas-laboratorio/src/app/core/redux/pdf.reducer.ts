import { createReducer, on } from '@ngrx/store';
import { descargarPdf, visualizarPdf } from './pdf.actions';

export interface StatePdf {
    descargar: boolean;
    visualizar: boolean;
}

export const estadoInicialPdf: StatePdf = {
    descargar: false,
    visualizar: false,
};

const _reducerPdf = createReducer(
    estadoInicialPdf,
    on(descargarPdf, (state, { descargando }) => ({
        ...state,
        descargar: descargando,
    })),
    on(visualizarPdf, (state, { visualizando }) => ({
        ...state,
        visualizar: visualizando,
    }))
);

export function reducerPdf(state, action) {
    return _reducerPdf(state, action);
}

import { createSelector } from '@ngrx/store';

export const selectPdfDescargar = (state) => state.pdf.descargar;
export const selectPdfVisualizar = (state) => state.pdf.visualizar;

export const selectPdfDescargarState = createSelector(
    selectPdfDescargar,
    (state) => state
);

export const selectPdfVisualizarState = createSelector(
    selectPdfVisualizar,
    (state) => state
);

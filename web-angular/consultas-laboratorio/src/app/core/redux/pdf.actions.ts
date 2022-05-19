import { createAction, props } from '@ngrx/store';

export const descargarPdf = createAction(
    '[PDF] descargar',
    props<{ descargando }>()
);
export const visualizarPdf = createAction(
    '[PDF] visualizar',
    props<{ visualizando }>()
);

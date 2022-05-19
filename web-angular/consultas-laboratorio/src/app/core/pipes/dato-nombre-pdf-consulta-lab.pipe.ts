import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datoNombrePdfConsultaLab',
})
export class DatoNombrePdfConsultaLabPipe implements PipeTransform {
    transform(nombreArchivo: string, datoAExtraer: string) {
        const arrDatos = this.arrDatos(nombreArchivo);
        const idxDato = this.indxDato(datoAExtraer);
        return arrDatos[idxDato];
    }

    arrDatos(nombreArchivo) {
        const nombreArchivoSinExt = nombreArchivo.split('.')[0];
        return nombreArchivoSinExt.split('_');
    }

    indxDato(datoAExtraer): number {
        if (datoAExtraer == 'dni') {
            return 0;
        } else if (datoAExtraer == 'fecha') {
            return 1;
        } else if (datoAExtraer == 'oa') {
            return 2;
        }

        return 0;
    }
}

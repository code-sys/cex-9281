import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatoFechaPdfConsultaLab',
})
export class FormatoFechaPdfConsultaLabPipe implements PipeTransform {
    transform(fecha: string, separador: string = '/', tipo = 'es') {
        const a = fecha.substring(0, 4);
        const m = fecha.substring(4, 6);
        const d = fecha.substring(6);

        if (tipo == 'es') {
            return `${d}${separador}${m}${separador}${a}`;
        } else if (tipo == 'en') {
            return `${a}${separador}${m}${separador}${d}`;
        }

        return `${d}${separador}${m}${separador}${a}`;
    }
}

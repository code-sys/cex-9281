import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoOaPdfConsultaLab',
})
export class FormatoOaPdfConsultaLab implements PipeTransform {
  transform(oa: string) {
    return parseInt(oa);
  }
}

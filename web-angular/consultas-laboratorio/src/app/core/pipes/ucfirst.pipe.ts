import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ucfirst',
})
export class UcfirstPipe implements PipeTransform {
    transform(str: string): string {
        return (
            str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase()
        );
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LaboratorioService {
    constructor(private http: HttpClient) {}

    getTodosLosPdfsPorCliente(dni: string) {
        return this.http
            .get(
                environment.api_url +
                    `ftp/consultas/laboratorio/pdf/paciente/${dni}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .toPromise();
    }

    descargarPdf(pdf: string) {
        return this.http
            .get(environment.api_url + `ftp/consultas/laboratorio/pdf/${pdf}`, {
                headers: {
                    'Content-Type': 'application/pdf',
                },
                responseType: 'blob',
            })
            .toPromise();
    }
}

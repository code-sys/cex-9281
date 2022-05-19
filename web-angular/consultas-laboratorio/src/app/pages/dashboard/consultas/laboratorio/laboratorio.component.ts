import { Component, OnInit } from '@angular/core';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { MessageService } from 'primeng/api';
import { FileSaverService } from 'ngx-filesaver';
import { descargarPdf, visualizarPdf } from 'src/app/core/redux/pdf.actions';
import { StatePdf } from 'src/app/core/redux/pdf.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    selectPdfDescargarState,
    selectPdfVisualizarState,
} from 'src/app/core/redux/pdf.selectors';

@Component({
    selector: 'app-laboratorio',
    templateUrl: './laboratorio.component.html',
    styleUrls: ['./laboratorio.component.css'],
})
export class LaboratorioComponent implements OnInit {
    public pdfSrc: string = null;
    public accionPdf: string;
    public pdfRenderizado: boolean = false;
    public descargandoPdf$: Observable<boolean>;
    public visualizandoPdf$: Observable<boolean>;
    public pdfVisualizado: string = '';

    constructor(
        public laboratorioService: LaboratorioService,
        private messageService: MessageService,
        private fileSaverService: FileSaverService,
        private store: Store<any>
    ) {
        this.descargandoPdf$ = store.select(selectPdfDescargarState);
        this.visualizandoPdf$ = store.select(selectPdfVisualizarState);
    }

    ngOnInit(): void {}

    obtenerPdf(event) {
        this.accionPdf = event.accion;
        this.store.dispatch(descargarPdf({ descargando: true }));
        if (event.accion == 'visualizar') {
            this.pdfRenderizado = false;
            this.pdfVisualizado = event.archivo;
            this.store.dispatch(visualizarPdf({ visualizando: false }));
        }

        this.laboratorioService.descargarPdf(event.archivo).then(
            (response: any) => {
                this.ejecutarAccionAlPdf(response, event);
                this.store.dispatch(descargarPdf({ descargando: false }));
            },
            (error) => {
                console.error(error);

                this.store.dispatch(descargarPdf({ descargando: false }));
                this.store.dispatch(visualizarPdf({ visualizando: false }));

                this.messageService.add({
                    severity: 'error',
                    detail: 'Ocurrió un error al obtener el archivo PDF',
                    life: 6000,
                });
            }
        );
    }

    ejecutarAccionAlPdf(pdf, { accion, archivo }) {
        if (accion == 'visualizar') {
            this.store.dispatch(visualizarPdf({ visualizando: true }));
            let reader = new FileReader();

            reader.onload = (e: any) => {
                this.pdfSrc = e.target.result;
            };

            reader.readAsArrayBuffer(pdf);
        } else {
            this.fileSaverService.save(pdf, archivo);
        }
    }

    finalizadoRenderizadoPdf(event) {
        this.pdfRenderizado = true;
    }

    iniciarDescargaPdfVisualizado(event) {
        const archivo = this.pdfVisualizado;

        if (event && archivo.length > 0) {
            this.obtenerPdf({
                archivo: archivo,
                accion: 'descargar',
            });
        }
    }
}

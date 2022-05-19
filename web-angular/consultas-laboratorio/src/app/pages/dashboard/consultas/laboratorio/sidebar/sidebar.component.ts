import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PdfExamenLaboratorio } from 'src/app/core/interfaces/pdfExamenLaboratorio';
import { ocultarMenu } from 'src/app/core/redux/menu.actions';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { DatoNombrePdfConsultaLabPipe } from 'src/app/core/pipes/dato-nombre-pdf-consulta-lab.pipe';
import { FormatoFechaPdfConsultaLabPipe } from 'src/app/core/pipes/formato-fecha-pdf-consulta-lab.pipe';
import { format, isAfter, isBefore, isEqual } from 'date-fns';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
    @Output() pdfPorObtener: EventEmitter<{
        archivo: string;
        accion: string;
    }> = new EventEmitter<{ archivo: string; accion: string }>();
    public display$: Observable<boolean>;
    public visible: boolean;
    public _pdfs: PdfExamenLaboratorio[] = [];
    public _pdfsFiltrados: PdfExamenLaboratorio[];
    public mostrarPdfsPorFiltro: boolean = false;

    constructor(
        public laboratorioService: LaboratorioService,
        public store: Store<{ menu: boolean }>,
        private nombrePdfConsultaLabPipe: DatoNombrePdfConsultaLabPipe,
        private formatoFechaPdfConsultaLabPipe: FormatoFechaPdfConsultaLabPipe,
        private messageService: MessageService
    ) {
        this.display$ = store.select('menu');
    }

    ngOnInit(): void {
        const dni = localStorage.getItem('nroDocumento');

        this.laboratorioService.getTodosLosPdfsPorCliente(dni).then(
            (response: any) => {
                const archivos = response.data;

                for (let idx in response.data) {
                    this._pdfs.push(archivos[idx]);
                }
            },
            (error) => {
                console.error(error);

                this.messageService.add({
                    severity: 'error',
                    detail: 'Ocurrió un error al obtener los archivos PDF',
                    life: 6000,
                });
            }
        );
    }

    ocultar(value) {
        if (!this.visible) {
            this.store.dispatch(ocultarMenu());
        }
    }

    filtrarPorRangoFecha(event) {
        const desde: Date = new Date(format(event.desde, 'yyyy-MM-dd'));
        const hasta: Date = new Date(format(event.hasta, 'yyyy-MM-dd'));

        this._pdfsFiltrados = this._pdfs.filter((pdf) => {
            const fechaPdf = this.nombrePdfConsultaLabPipe.transform(
                pdf.archivo,
                'fecha'
            );
            const fechaPdfConFormato: Date = new Date(
                this.formatoFechaPdfConsultaLabPipe.transform(
                    fechaPdf,
                    '-',
                    'en'
                )
            );

            const rangoFechaInicio =
                isEqual(fechaPdfConFormato, desde) ||
                isAfter(fechaPdfConFormato, desde);

            const rangoFechaFin =
                isEqual(fechaPdfConFormato, hasta) ||
                isBefore(fechaPdfConFormato, hasta);

            return rangoFechaInicio && rangoFechaFin;
        });
    }

    configurarFiltro(event) {
        this.mostrarPdfsPorFiltro = event;
    }

    pdfAObtener(event) {
        this.pdfPorObtener.emit(event);
        this.store.dispatch(ocultarMenu());
    }

    get pdfs(): PdfExamenLaboratorio[] {
        if (this.mostrarPdfsPorFiltro) {
            return this._pdfsFiltrados;
        }

        return this._pdfs;
    }

    get mostrar(): boolean {
        return true;
    }
}

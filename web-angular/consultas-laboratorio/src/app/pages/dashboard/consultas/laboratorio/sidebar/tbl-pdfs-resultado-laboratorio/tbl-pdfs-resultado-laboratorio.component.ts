import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PdfExamenLaboratorio } from 'src/app/core/interfaces/pdfExamenLaboratorio';

@Component({
    selector: 'app-tbl-pdfs-resultado-laboratorio',
    templateUrl: './tbl-pdfs-resultado-laboratorio.component.html',
    styleUrls: ['./tbl-pdfs-resultado-laboratorio.component.css'],
})
export class TblPdfsResultadoLaboratorioComponent implements OnInit {
    @Output() pdfSeleccionado: EventEmitter<{
        archivo: string;
        accion: string;
    }> = new EventEmitter<{ archivo: string; accion: string }>();
    @Input() pdfs: PdfExamenLaboratorio[];

    constructor() {}

    ngOnInit(): void {}

    visualizarPdf(archivo) {
        this.pdfSeleccionado.emit({ archivo, accion: 'visualizar' });
    }

    descargarPdf(archivo) {
        this.pdfSeleccionado.emit({ archivo, accion: 'descargar' });
    }
}

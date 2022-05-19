import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    selectPdfDescargarState,
    selectPdfVisualizarState,
} from 'src/app/core/redux/pdf.selectors';

@Component({
    selector: 'app-visualizador-pdf',
    templateUrl: './visualizador-pdf.component.html',
    styleUrls: ['./visualizador-pdf.component.css'],
})
export class VisualizadorPdfComponent implements OnInit {
    @Input() pdfSrc: string;
    @Input() accionPdf: string;
    @Input() pdfRenderizado: boolean;
    @Output() finalizadoRenderizadoPdf: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() descargarPdfVisualizado: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    public visualizandoPdf$: Observable<any>;
    public descargandoPdf$: Observable<any>;
    public _zoom: number = 0.8;
    public minZoom: number = 0.5;
    public maxZoom: number = 2;
    public btnDisminuirZoomInactivo: boolean = false;
    public btnAumentarZoomInactivo: boolean = false;

    constructor(private store: Store<any>) {
        this.visualizandoPdf$ = this.store.select(selectPdfVisualizarState);
        this.descargandoPdf$ = this.store.select(selectPdfDescargarState);
        (window as any).pdfWorkerSrc = 'assets/pdfjs/pdf.worker.min.js';
    }

    ngOnInit(): void {}

    zoom(accion: string) {
        let nuevoZoom = accion == '-' ? this._zoom - 0.1 : this._zoom + 0.1;
        nuevoZoom = Math.round((nuevoZoom + Number.EPSILON) * 100) / 100;
        this.btnAumentarZoomInactivo = false;
        this.btnDisminuirZoomInactivo = false;

        if (nuevoZoom >= this.maxZoom) {
            this.btnAumentarZoomInactivo = true;
        } else if (nuevoZoom <= this.minZoom) {
            this.btnDisminuirZoomInactivo = true;
        }

        this._zoom = nuevoZoom;
    }

    iniciarDescargaPdfVisualizado() {
        this.descargarPdfVisualizado.emit(true);
    }

    pageInitialized(e: CustomEvent) {
        this.finalizadoRenderizadoPdf.emit(true);
    }
}

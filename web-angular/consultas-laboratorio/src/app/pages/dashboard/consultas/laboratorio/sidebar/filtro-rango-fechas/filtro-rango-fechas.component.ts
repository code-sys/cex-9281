import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { subMonths } from 'date-fns';

@Component({
    selector: 'app-filtro-rango-fechas',
    templateUrl: './filtro-rango-fechas.component.html',
    styleUrls: ['./filtro-rango-fechas.component.css'],
})
export class FiltroRangoFechasComponent implements OnInit {
    @Output() filtrar: EventEmitter<any> = new EventEmitter<any>();
    @Output() usarFiltro: EventEmitter<boolean> = new EventEmitter<boolean>();

    public filtroPorFecha: boolean = false;
    public minFecha: Date = new Date('December 31, 1900');
    public maxFecha: Date = new Date('December 31, 2021');
    public fechaDesde: Date;
    public fechaHasta: Date;

    constructor(private messageService: MessageService) {
        this.fechaDesde = subMonths(this.maxFecha, 2);
        this.fechaHasta = this.maxFecha;
    }

    ngOnInit(): void {}

    filtrarPorRangoFecha() {
        if (this.fechaDesde != null && this.fechaHasta != null) {
            this.filtrar.emit({
                desde: this.fechaDesde,
                hasta: this.fechaHasta,
            });
        } else {
            const campo = this.fechaDesde == null ? 'Desde' : 'Hasta';
            let msje = `Completa el campo "${campo}"`;

            if (this.fechaDesde == null && this.fechaHasta == null) {
                msje = 'Ingresa el rango de fechas por el cual filtrar';
            }

            this.messageService.add({
                severity: 'warn',
                summary: 'Campos incompletos',
                detail: msje,
            });
        }
    }

    evtUsarFiltro() {
        this.usarFiltro.emit(this.filtroPorFecha);
    }

    validarRangoFecha(control) {
        if (this.fechaDesdeEsMayor()) {
            this.limpiarControl(control);
            this.messageService.add({
                severity: 'warn',
                summary: 'Valor inválido',
                detail: 'La fecha del campo "Desde" no puede ser mayor',
            });
        }
    }

    limpiarControl(control) {
        if (control == 'hasta') {
            this.fechaHasta = null;
        } else {
            this.fechaDesde = null;
        }
    }

    fechaDesdeEsMayor(): boolean {
        if (this.fechaHasta == null && this.fechaDesde != null) {
            return false;
        }

        const timeFechaDesde =
            this.fechaDesde == null ? 0 : this.fechaDesde.getTime();
        const timeFechaHasta =
            this.fechaHasta == null ? 0 : this.fechaHasta.getTime();

        return timeFechaDesde > timeFechaHasta;
    }
}

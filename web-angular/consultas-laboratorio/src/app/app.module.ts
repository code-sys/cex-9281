import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptorService } from './core/services/auth-interceptor.service';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileSaverModule } from 'ngx-filesaver';

import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PasswordModule } from 'primeng/password';

import { AppComponent } from './app.component';
import { SidebarComponent } from './pages/dashboard/consultas/laboratorio/sidebar/sidebar.component';
import { MenubarComponent } from './pages/dashboard/consultas/laboratorio/menubar/menubar.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LaboratorioComponent } from './pages/dashboard/consultas/laboratorio/laboratorio.component';
import { PaginaNoEncontradaComponent } from './pages/pagina-no-encontrada/pagina-no-encontrada.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducerMenu } from './core/redux/menu.reducer';
import { reducerPdf } from './core/redux/pdf.reducer';

import { DatoNombrePdfConsultaLabPipe } from './core/pipes/dato-nombre-pdf-consulta-lab.pipe';
import { FormatoFechaPdfConsultaLabPipe } from './core/pipes/formato-fecha-pdf-consulta-lab.pipe';
import { UcfirstPipe } from './core/pipes/ucfirst.pipe';
import { FormatoOaPdfConsultaLab } from './core/pipes/formato-oa-pdf-consulta-lab.pipe';

import { FiltroRangoFechasComponent } from './pages/dashboard/consultas/laboratorio/sidebar/filtro-rango-fechas/filtro-rango-fechas.component';
import { environment } from '../environments/environment';
import { TblPdfsResultadoLaboratorioComponent } from './pages/dashboard/consultas/laboratorio/sidebar/tbl-pdfs-resultado-laboratorio/tbl-pdfs-resultado-laboratorio.component';
import { VisualizadorPdfComponent } from './pages/dashboard/consultas/laboratorio/visualizador-pdf/visualizador-pdf.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        MenubarComponent,
        LoginComponent,
        LaboratorioComponent,
        PaginaNoEncontradaComponent,
        DatoNombrePdfConsultaLabPipe,
        FormatoFechaPdfConsultaLabPipe,
        FormatoOaPdfConsultaLab,
        FiltroRangoFechasComponent,
        UcfirstPipe,
        TblPdfsResultadoLaboratorioComponent,
        VisualizadorPdfComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
        FileSaverModule,
        SidebarModule,
        ButtonModule,
        TableModule,
        CalendarModule,
        CheckboxModule,
        InputTextModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        ConfirmDialogModule,
        ScrollPanelModule,
        PasswordModule,
        ProgressSpinnerModule,
        RippleModule,
        StoreModule.forRoot({ menu: reducerMenu, pdf: reducerPdf }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
    ],
    providers: [
        CookieService,
        ConfirmationService,
        MessageService,
        UcfirstPipe,
        DatoNombrePdfConsultaLabPipe,
        FormatoFechaPdfConsultaLabPipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

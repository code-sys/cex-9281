import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { mostrarMenu, ocultarMenu } from 'src/app/core/redux/menu.actions';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-menubar',
    templateUrl: './menubar.component.html',
    styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent implements OnInit {
    public visibilidadMenu$: Observable<boolean>;
    public nombres: string;
    public apellidos: string;

    constructor(
        public store: Store<{ menu: boolean }>,
        private confirmationService: ConfirmationService,
        private userService: UserService,
        private router: Router
    ) {
        this.visibilidadMenu$ = store.select('menu');
        this.nombres = localStorage.getItem('nombres');
        this.apellidos = localStorage.getItem('apellidos');
    }

    ngOnInit(): void {}

    mostrarSidebar() {
        this.store.dispatch(mostrarMenu());
    }

    confirmarCerrarSesion() {
        this.confirmationService.confirm({
            message: '¿Cerrar sesión?',
            accept: () => {
                this.userService.deleteToken();
                this.router.navigateByUrl('/');
            },
        });
    }
}

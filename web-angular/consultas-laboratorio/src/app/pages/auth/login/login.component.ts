import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UcfirstPipe } from 'src/app/core/pipes/ucfirst.pipe';
import { UserService } from 'src/app/core/services/user.service';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    public autenticando: boolean = false;
    private expiresCookie: number = 12;
    public username: string;
    public password: string;
    public usernameVacio: boolean = true;
    public passwordVacio: boolean = true;

    constructor(
        private router: Router,
        private userService: UserService,
        public ucfirst: UcfirstPipe,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {}

    login(frm: NgForm): boolean | void {
        if (!frm.valid || this.usernameVacio || this.passwordVacio) {
            return false;
        }

        this.autenticando = true;

        localStorage.setItem('id', 'datos.id');
        localStorage.setItem('nombres', 'nombres');
        localStorage.setItem('apellidos', 'apellidos');
        localStorage.setItem('nroDocumento', '74892281');

        this.router.navigateByUrl('consultas/laboratorio');

        /*
        this.userService
            .login({
                username: this.username.trim(),
                password: this.password.trim(),
            })
            .then(
                (response: any) => {
                    if (!response.success) {
                        console.log('Error autenticando al usuario', response);
                    }

                    const { user, token } = response.data;

                    this.userService.setToken(token, this.expiresCookie);
                    this.guardarDatosUsuario(user);
                    this.router.navigateByUrl('consultas/laboratorio');
                },
                (error) => {
                    console.error(error);
                    let msjeError =
                        'Error al autenticar, por favor contacte con el administrador';
                    let severity = 'error';

                    this.autenticando = false;

                    if (error.status == 401) {
                        msjeError = 'Usuario o contraseña icorrecta';
                        severity = 'warn';
                    }

                    this.messageService.add({
                        severity: severity,
                        detail: msjeError,
                        life: 6000,
                    });
                }
            );
            */
    }

    verificarDatos() {
        this.usernameVacio = this.username?.trim().length == 0;
        this.passwordVacio = this.password?.trim().length == 0;
    }

    guardarDatosUsuario(datos) {
        const apellidoPaterno = datos.apellidoPaterno.toLocaleUpperCase();
        const apellidoMaterno = datos.apellidoMaterno.toLocaleUpperCase();
        const apellidos = `${apellidoPaterno} ${apellidoMaterno}`;
        const arrNombres = datos.nombres.split(' ');
        let nombres = this.ucfirst.transform(arrNombres[0]);
        if (arrNombres.length > 1) {
            nombres += ' ' + this.ucfirst.transform(arrNombres[1]);
        }

        localStorage.setItem('id', datos.id);
        localStorage.setItem('nombres', nombres);
        localStorage.setItem('apellidos', apellidos);
        localStorage.setItem('nroDocumento', datos.nroDocumento);
    }
}

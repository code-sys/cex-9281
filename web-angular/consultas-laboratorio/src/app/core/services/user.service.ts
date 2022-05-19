import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { addHours } from 'date-fns';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private tokenName: string = 'user-token';

    constructor(private http: HttpClient, private cookies: CookieService) {}

    login(user: User) {
        return this.http
            .post(environment.api_url + 'auth/login', user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .toPromise();
    }

    /**
     * @param token
     * @param expires Número de horas que el cookie será válido
     */
    setToken(token: string, expires: number = 12) {
        this.cookies.set(this.tokenName, token, addHours(new Date(), expires));
    }

    getToken(): string {
        return this.cookies.get(this.tokenName);
    }

    checkToken(): boolean {
        return this.cookies.check(this.tokenName);
    }

    deleteToken() {
        this.cookies.delete(this.tokenName, '/');
    }
}

import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private cookies: CookieService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token: string = this.cookies.get('user-token');
        let request = req;

        if (token) {
            request = req.clone({
                setHeaders: {
                    authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(request);
    }
}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(
		private router: Router,
		private ngxService: NgxUiLoaderService
	) { }

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		this.ngxService.start();

		// 1. SALIDA DE EMERGENCIA PARA RUTAS PÚBLICAS
		// Si la petición va al login, procesamos pero aseguramos apagar el loader al terminar
		if (request.url.includes('/auth/login')) {
			return next.handle(request).pipe(
				finalize(() => {
					this.ngxService.stop(); // <--- ¡Esto faltaba para evitar que se congele el Login!
				})
			);
		}

		console.log('--- INTERCEPTOR ACTIVO ---');
		console.log('Petición a:', request.url);

		// 1. Obtenemos el objeto completo 'currentUser' del localStorage
		const currentUserJson = localStorage.getItem('currentUser');
		let token: string | null = null;

		if (currentUserJson) {
			try {
				// 2. Parseamos el JSON para extraer solo el token
				const userData = JSON.parse(currentUserJson);
				token = userData.token;
				console.log('Token extraído con éxito de currentUser');
			} catch (e) {
				console.error('Error parseando currentUser del localStorage', e);
			}
		} else {
			console.warn('No se encontró currentUser en el storage');
		}

		// 3. Clonamos la petición e inyectamos el header si el token existe
		let authReq = request;
		if (token) {
			authReq = request.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}

		// 4. Enviamos la petición y manejamos errores globales (como el 401)
		return next.handle(authReq).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					console.error('Sesión expirada o token inválido (401). Redirigiendo...');
					// Limpiamos todo y al login
					localStorage.clear();
					this.router.navigate(['/auth/login']);
				}
				return throwError(() => error);
			}),
			finalize(() => {
				this.ngxService.stop(); // <-- Apaga el loader siempre en rutas privadas
			})
		);
	}


/* 	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		this.ngxService.start();

		// 1. SALIDA DE EMERGENCIA PARA RUTAS PÚBLICAS
		// Si la petición va al login, no ejecutamos nada de lo que sigue
		if (request.url.includes('/auth/login')) {
			return next.handle(request);
		}

		console.log('--- INTERCEPTOR ACTIVO ---');
		console.log('Petición a:', request.url);

		// 1. Obtenemos el objeto completo 'currentUser' del localStorage
		const currentUserJson = localStorage.getItem('currentUser');
		let token: string | null = null;

		if (currentUserJson) {
			try {
				// 2. Parseamos el JSON para extraer solo el token
				const userData = JSON.parse(currentUserJson);
				token = userData.token;
				console.log('Token extraído con éxito de currentUser');
			} catch (e) {
				console.error('Error parseando currentUser del localStorage', e);
			}
		} else {
			console.warn('No se encontró currentUser en el storage');
		}

		// 3. Clonamos la petición e inyectamos el header si el token existe
		let authReq = request;
		if (token) {
			authReq = request.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}

		// 4. Enviamos la petición y manejamos errores globales (como el 401)
		return next.handle(authReq).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					console.error('Sesión expirada o token inválido (401). Redirigiendo...');
					// Limpiamos todo y al login
					localStorage.clear();
					this.router.navigate(['/auth/login']);
				}
				return throwError(() => error);
			}),
			finalize(() => {
				this.ngxService.stop(); // <-- Apaga el loader siempre (con éxito o con error)
			})
		);
	} */
}